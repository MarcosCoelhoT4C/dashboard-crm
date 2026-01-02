#!/usr/bin/env python3
"""
Script de Automação - Dashboard CRM
Processa dados de planilhas Excel e atualiza o data.json no GitHub automaticamente
"""

import pandas as pd
import json
import os
import subprocess
from datetime import datetime
from pathlib import Path

class DashboardUpdater:
    def __init__(self, bourbon_file, cx_file, output_file='data.json'):
        """
        Inicializa o atualizador de dashboard
        
        Args:
            bourbon_file (str): Caminho para a planilha Bourbon
            cx_file (str): Caminho para a planilha CX Curadoria
            output_file (str): Nome do arquivo JSON de saída
        """
        self.bourbon_file = bourbon_file
        self.cx_file = cx_file
        self.output_file = output_file
        self.dashboard_data = {}
        
    def process_media_data(self):
        """Processa dados de mídia (Google Ads e Meta Ads)"""
        print("📊 Processando dados de mídia...")
        
        # Ler Google Ads
        google_ads = pd.read_excel(self.bourbon_file, sheet_name="Base Bourbon - Google Ads")
        google_ads_clean = google_ads.dropna(subset=['Year & month', 'Cost', 'Conversions']).copy()
        google_ads_clean['Channel'] = 'Google Ads'
        google_ads_clean['Cost'] = pd.to_numeric(google_ads_clean['Cost'], errors='coerce')
        google_ads_clean['Conversions'] = pd.to_numeric(google_ads_clean['Conversions'], errors='coerce')
        google_ads_clean['Receita GA4'] = pd.to_numeric(google_ads_clean['Receita GA4'], errors='coerce')
        
        # Ler Meta Ads
        meta_ads = pd.read_excel(self.bourbon_file, sheet_name="Base Bourbon - Meta Ads")
        meta_ads_clean = meta_ads.dropna(subset=['Year & month', 'Cost']).copy()
        meta_ads_clean['Channel'] = 'Meta Ads'
        meta_ads_clean['Cost'] = pd.to_numeric(meta_ads_clean['Cost'], errors='coerce')
        meta_ads_clean['Website purchases'] = pd.to_numeric(meta_ads_clean['Website purchases'], errors='coerce')
        meta_ads_clean['Receita GA4'] = pd.to_numeric(meta_ads_clean['Receita GA4'], errors='coerce')
        meta_ads_clean = meta_ads_clean[meta_ads_clean['Cost'] > 0]
        
        # Combinar dados
        media_combined = pd.concat([
            google_ads_clean[['Year & month', 'Channel', 'Cost', 'Conversions', 'Receita GA4']].rename(
                columns={'Conversions': 'Conversions_count'}),
            meta_ads_clean[['Year & month', 'Channel', 'Cost', 'Website purchases', 'Receita GA4']].rename(
                columns={'Website purchases': 'Conversions_count'})
        ], ignore_index=True)
        
        # Agrupar por período e canal
        media_by_period_channel = media_combined.groupby(['Year & month', 'Channel']).agg({
            'Cost': 'sum',
            'Conversions_count': 'sum',
            'Receita GA4': 'sum'
        }).reset_index()
        
        media_by_period_channel['CAC'] = media_by_period_channel['Cost'] / media_by_period_channel['Conversions_count'].replace(0, 1)
        media_by_period_channel['ROAS'] = media_by_period_channel['Receita GA4'] / media_by_period_channel['Cost'].replace(0, 1)
        
        print(f"✓ {len(media_by_period_channel)} registros de mídia processados")
        return media_by_period_channel
    
    def process_cx_data(self):
        """Processa dados de CX (NPS, CSAT, Nota IA)"""
        print("😊 Processando dados de CX...")
        
        cx_curadoria = pd.read_excel(self.cx_file, sheet_name="CX_Curadoria")
        cx_curadoria['Data'] = pd.to_datetime(cx_curadoria['Data'])
        cx_curadoria['Ano_Mes'] = cx_curadoria['Data'].dt.strftime('%Y|%m')
        cx_curadoria['Nota IA'] = pd.to_numeric(cx_curadoria['Nota IA'], errors='coerce')
        
        # Mapear NPS e CSAT
        nps_map = {'Promotor': 10, 'Neutro': 5, 'Detrator': 0}
        csat_map = {'Satisfeito': 10, 'Neutro': 5, 'Insatisfeito': 0}
        
        cx_curadoria['NPS_value'] = cx_curadoria['NPS P2'].map(nps_map)
        cx_curadoria['CSAT_value'] = cx_curadoria['CSAT P2'].map(csat_map)
        
        # Agrupar por período e canal
        cx_by_period_channel = cx_curadoria.groupby(['Ano_Mes', 'Canal']).agg({
            'NPS_value': 'mean',
            'CSAT_value': 'mean',
            'Nota IA': 'mean'
        }).reset_index()
        
        cx_by_period_channel.columns = ['Ano_Mes', 'Canal', 'NPS', 'CSAT', 'Nota_IA']
        
        print(f"✓ {len(cx_by_period_channel)} registros de CX processados")
        return cx_by_period_channel
    
    def create_dashboard_json(self, media_df, cx_df):
        """Cria estrutura JSON para o dashboard"""
        print("📦 Criando estrutura JSON...")
        
        self.dashboard_data = {
            'media_periods': sorted(media_df['Year & month'].unique().tolist()),
            'cx_periods': sorted(cx_df['Ano_Mes'].unique().tolist()),
            'all_channels': sorted(list(set(
                media_df['Channel'].unique().tolist() + 
                cx_df['Canal'].unique().tolist()
            ))),
            'media_by_period_channel': [],
            'cx_by_period_channel': [],
            'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        # Adicionar dados de mídia
        for _, row in media_df.iterrows():
            self.dashboard_data['media_by_period_channel'].append({
                'period': str(row['Year & month']),
                'channel': row['Channel'],
                'cost': round(float(row['Cost']), 2),
                'conversions': round(float(row['Conversions_count']), 2),
                'revenue': round(float(row['Receita GA4']), 2),
                'cac': round(float(row['CAC']), 2),
                'roas': round(float(row['ROAS']), 2)
            })
        
        # Adicionar dados de CX
        for _, row in cx_df.iterrows():
            self.dashboard_data['cx_by_period_channel'].append({
                'period': str(row['Ano_Mes']),
                'channel': row['Canal'],
                'nps': round(float(row['NPS']), 2),
                'csat': round(float(row['CSAT']), 2),
                'nota_ia': round(float(row['Nota_IA']), 2)
            })
        
        print(f"✓ JSON criado com {len(self.dashboard_data['media_by_period_channel'])} registros de mídia e {len(self.dashboard_data['cx_by_period_channel'])} registros de CX")
    
    def save_json(self):
        """Salva JSON no arquivo"""
        print(f"💾 Salvando {self.output_file}...")
        
        with open(self.output_file, 'w', encoding='utf-8') as f:
            json.dump(self.dashboard_data, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Arquivo salvo: {self.output_file}")
    
    def git_commit_push(self, commit_message=None):
        """Faz commit e push para o GitHub"""
        print("🚀 Enviando para o GitHub...")
        
        if commit_message is None:
            commit_message = f"Atualização automática dos dados - {datetime.now().strftime('%Y-%m-%d %H:%M')}"
        
        try:
            # Add
            subprocess.run(['git', 'add', self.output_file], check=True)
            
            # Commit
            subprocess.run(['git', 'commit', '-m', commit_message], check=True)
            
            # Push
            subprocess.run(['git', 'push', 'origin', 'main'], check=True)
            
            print("✓ Dados enviados para o GitHub com sucesso!")
            print("⏳ Aguarde 2-5 minutos para o GitHub Pages atualizar")
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Erro ao enviar para o GitHub: {e}")
            print("Certifique-se de que você está no diretório do repositório e tem permissões de push")
    
    def run(self, auto_push=True):
        """Executa o processo completo de atualização"""
        print("=" * 60)
        print("🔄 INICIANDO ATUALIZAÇÃO DO DASHBOARD")
        print("=" * 60)
        
        try:
            # Processar dados
            media_df = self.process_media_data()
            cx_df = self.process_cx_data()
            
            # Criar JSON
            self.create_dashboard_json(media_df, cx_df)
            
            # Salvar
            self.save_json()
            
            # Push para GitHub
            if auto_push:
                self.git_commit_push()
            
            print("=" * 60)
            print("✅ ATUALIZAÇÃO CONCLUÍDA COM SUCESSO!")
            print("=" * 60)
            
            return True
            
        except Exception as e:
            print(f"❌ Erro durante a atualização: {e}")
            import traceback
            traceback.print_exc()
            return False


def main():
    """Função principal"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Atualiza o dashboard CRM automaticamente')
    parser.add_argument('--bourbon', required=True, help='Caminho para a planilha Bourbon')
    parser.add_argument('--cx', required=True, help='Caminho para a planilha CX Curadoria')
    parser.add_argument('--output', default='data.json', help='Nome do arquivo JSON de saída')
    parser.add_argument('--no-push', action='store_true', help='Não fazer push para o GitHub')
    
    args = parser.parse_args()
    
    # Verificar se os arquivos existem
    if not os.path.exists(args.bourbon):
        print(f"❌ Arquivo não encontrado: {args.bourbon}")
        return
    
    if not os.path.exists(args.cx):
        print(f"❌ Arquivo não encontrado: {args.cx}")
        return
    
    # Executar atualização
    updater = DashboardUpdater(args.bourbon, args.cx, args.output)
    success = updater.run(auto_push=not args.no_push)
    
    if success:
        print("\n📊 Dashboard disponível em: https://marcoscoelhot4c.github.io/dashboard-crm/")
    else:
        print("\n❌ Atualização falhou. Verifique os erros acima.")


if __name__ == '__main__':
    main()
