#!/usr/bin/env python3
"""
API Flask para Dashboard CRM
Processa arquivos Excel e retorna JSON para atualização do dashboard
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import json
from datetime import datetime
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Permitir requisições do GitHub Pages

# Configurações
UPLOAD_FOLDER = '/tmp/uploads'
ALLOWED_EXTENSIONS = {'xlsx', 'xls'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Criar pasta de upload se não existir
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    """Verifica se o arquivo tem extensão permitida"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def process_media_data(bourbon_file):
    """Processa dados de mídia (Google Ads e Meta Ads)"""
    try:
        # Ler Google Ads
        google_ads = pd.read_excel(bourbon_file, sheet_name="Base Bourbon - Google Ads")
        google_ads_clean = google_ads.dropna(subset=['Year & month', 'Cost', 'Conversions']).copy()
        google_ads_clean['Channel'] = 'Google Ads'
        google_ads_clean['Cost'] = pd.to_numeric(google_ads_clean['Cost'], errors='coerce')
        google_ads_clean['Conversions'] = pd.to_numeric(google_ads_clean['Conversions'], errors='coerce')
        google_ads_clean['Receita GA4'] = pd.to_numeric(google_ads_clean['Receita GA4'], errors='coerce')
        
        # Ler Meta Ads
        meta_ads = pd.read_excel(bourbon_file, sheet_name="Base Bourbon - Meta Ads")
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
        
        return media_by_period_channel
    
    except Exception as e:
        raise Exception(f"Erro ao processar dados de mídia: {str(e)}")


def process_cx_data(cx_file):
    """Processa dados de CX (NPS, CSAT, Nota IA)"""
    try:
        cx_curadoria = pd.read_excel(cx_file, sheet_name="CX_Curadoria")
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
        
        return cx_by_period_channel
    
    except Exception as e:
        raise Exception(f"Erro ao processar dados de CX: {str(e)}")


def create_dashboard_json(media_df, cx_df):
    """Cria estrutura JSON para o dashboard"""
    dashboard_data = {
        'media_periods': sorted(media_df['Year & month'].unique().tolist()),
        'cx_periods': sorted(cx_df['Ano_Mes'].unique().tolist()),
        'all_channels': sorted(list(set(
            media_df['Channel'].unique().tolist() + 
            cx_df['Canal'].unique().tolist()
        ))),
        'media_by_period_channel': [],
        'cx_by_period_channel': [],
        'last_updated': datetime.now().isoformat()
    }
    
    # Adicionar dados de mídia
    for _, row in media_df.iterrows():
        dashboard_data['media_by_period_channel'].append({
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
        dashboard_data['cx_by_period_channel'].append({
            'period': str(row['Ano_Mes']),
            'channel': row['Canal'],
            'nps': round(float(row['NPS']), 2),
            'csat': round(float(row['CSAT']), 2),
            'nota_ia': round(float(row['Nota_IA']), 2)
        })
    
    return dashboard_data


@app.route('/')
def index():
    """Endpoint raiz"""
    return jsonify({
        'status': 'online',
        'service': 'Dashboard CRM API',
        'version': '1.0.0',
        'endpoints': {
            '/': 'Status da API',
            '/health': 'Health check',
            '/process': 'Processar arquivos Excel (POST)'
        }
    })


@app.route('/health')
def health():
    """Health check"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})


@app.route('/process', methods=['POST'])
def process_files():
    """
    Processa arquivos Excel e retorna JSON
    
    Espera dois arquivos:
    - bourbon: Planilha Bourbon
    - cx: Planilha CX Curadoria
    """
    try:
        # Verificar se os arquivos foram enviados
        if 'bourbon' not in request.files or 'cx' not in request.files:
            return jsonify({
                'error': 'Arquivos bourbon e cx são obrigatórios'
            }), 400
        
        bourbon_file = request.files['bourbon']
        cx_file = request.files['cx']
        
        # Verificar se os arquivos têm nome
        if bourbon_file.filename == '' or cx_file.filename == '':
            return jsonify({
                'error': 'Nenhum arquivo selecionado'
            }), 400
        
        # Verificar extensões
        if not (allowed_file(bourbon_file.filename) and allowed_file(cx_file.filename)):
            return jsonify({
                'error': 'Apenas arquivos .xlsx e .xls são permitidos'
            }), 400
        
        # Salvar arquivos temporariamente
        bourbon_filename = secure_filename(bourbon_file.filename)
        cx_filename = secure_filename(cx_file.filename)
        
        bourbon_path = os.path.join(app.config['UPLOAD_FOLDER'], bourbon_filename)
        cx_path = os.path.join(app.config['UPLOAD_FOLDER'], cx_filename)
        
        bourbon_file.save(bourbon_path)
        cx_file.save(cx_path)
        
        # Processar dados
        media_df = process_media_data(bourbon_path)
        cx_df = process_cx_data(cx_path)
        
        # Criar JSON
        dashboard_data = create_dashboard_json(media_df, cx_df)
        
        # Limpar arquivos temporários
        os.remove(bourbon_path)
        os.remove(cx_path)
        
        return jsonify({
            'success': True,
            'data': dashboard_data,
            'stats': {
                'media_records': len(dashboard_data['media_by_period_channel']),
                'cx_records': len(dashboard_data['cx_by_period_channel']),
                'periods': len(set(dashboard_data['media_periods'] + dashboard_data['cx_periods']))
            }
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
