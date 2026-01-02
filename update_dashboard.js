#!/usr/bin/env node
/**
 * Script de Automação - Dashboard CRM (Node.js)
 * Processa dados de planilhas Excel e atualiza o data.json no GitHub automaticamente
 */

const XLSX = require('xlsx');
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

class DashboardUpdater {
    constructor(bourbonFile, cxFile, outputFile = 'data.json') {
        this.bourbonFile = bourbonFile;
        this.cxFile = cxFile;
        this.outputFile = outputFile;
        this.dashboardData = {};
    }

    /**
     * Processa dados de mídia (Google Ads e Meta Ads)
     */
    processMediaData() {
        console.log('📊 Processando dados de mídia...');

        const workbook = XLSX.readFile(this.bourbonFile);

        // Ler Google Ads
        const googleAdsSheet = workbook.Sheets['Base Bourbon - Google Ads'];
        const googleAds = XLSX.utils.sheet_to_json(googleAdsSheet);
        
        const googleAdsClean = googleAds
            .filter(row => row['Year & month'] && row['Cost'] && row['Conversions'])
            .map(row => ({
                period: row['Year & month'],
                channel: 'Google Ads',
                cost: parseFloat(row['Cost']) || 0,
                conversions: parseFloat(row['Conversions']) || 0,
                revenue: parseFloat(row['Receita GA4']) || 0
            }));

        // Ler Meta Ads
        const metaAdsSheet = workbook.Sheets['Base Bourbon - Meta Ads'];
        const metaAds = XLSX.utils.sheet_to_json(metaAdsSheet);
        
        const metaAdsClean = metaAds
            .filter(row => row['Year & month'] && row['Cost'] && parseFloat(row['Cost']) > 0)
            .map(row => ({
                period: row['Year & month'],
                channel: 'Meta Ads',
                cost: parseFloat(row['Cost']) || 0,
                conversions: parseFloat(row['Website purchases']) || 0,
                revenue: parseFloat(row['Receita GA4']) || 0
            }));

        // Combinar dados
        const mediaCombined = [...googleAdsClean, ...metaAdsClean];

        // Agrupar por período e canal
        const mediaGrouped = {};
        mediaCombined.forEach(item => {
            const key = `${item.period}|${item.channel}`;
            if (!mediaGrouped[key]) {
                mediaGrouped[key] = {
                    period: item.period,
                    channel: item.channel,
                    cost: 0,
                    conversions: 0,
                    revenue: 0
                };
            }
            mediaGrouped[key].cost += item.cost;
            mediaGrouped[key].conversions += item.conversions;
            mediaGrouped[key].revenue += item.revenue;
        });

        // Calcular CAC e ROAS
        const mediaByPeriodChannel = Object.values(mediaGrouped).map(item => ({
            period: item.period,
            channel: item.channel,
            cost: Math.round(item.cost * 100) / 100,
            conversions: Math.round(item.conversions * 100) / 100,
            revenue: Math.round(item.revenue * 100) / 100,
            cac: Math.round((item.cost / (item.conversions || 1)) * 100) / 100,
            roas: Math.round((item.revenue / (item.cost || 1)) * 100) / 100
        }));

        console.log(`✓ ${mediaByPeriodChannel.length} registros de mídia processados`);
        return mediaByPeriodChannel;
    }

    /**
     * Processa dados de CX (NPS, CSAT, Nota IA)
     */
    processCXData() {
        console.log('😊 Processando dados de CX...');

        const workbook = XLSX.readFile(this.cxFile);
        const cxSheet = workbook.Sheets['CX_Curadoria'];
        const cxData = XLSX.utils.sheet_to_json(cxSheet);

        // Mapear NPS e CSAT
        const npsMap = { 'Promotor': 10, 'Neutro': 5, 'Detrator': 0 };
        const csatMap = { 'Satisfeito': 10, 'Neutro': 5, 'Insatisfeito': 0 };

        // Processar dados
        const cxProcessed = cxData
            .filter(row => row['Data'] && row['Canal'])
            .map(row => {
                const date = new Date(row['Data']);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const period = `${year}|${month}`;

                return {
                    period: period,
                    channel: row['Canal'],
                    nps: npsMap[row['NPS P2']] || 0,
                    csat: csatMap[row['CSAT P2']] || 0,
                    nota_ia: parseFloat(row['Nota IA']) || 0
                };
            });

        // Agrupar por período e canal
        const cxGrouped = {};
        cxProcessed.forEach(item => {
            const key = `${item.period}|${item.channel}`;
            if (!cxGrouped[key]) {
                cxGrouped[key] = {
                    period: item.period,
                    channel: item.channel,
                    nps: [],
                    csat: [],
                    nota_ia: []
                };
            }
            cxGrouped[key].nps.push(item.nps);
            cxGrouped[key].csat.push(item.csat);
            cxGrouped[key].nota_ia.push(item.nota_ia);
        });

        // Calcular médias
        const cxByPeriodChannel = Object.values(cxGrouped).map(item => ({
            period: item.period,
            channel: item.channel,
            nps: Math.round((item.nps.reduce((a, b) => a + b, 0) / item.nps.length) * 100) / 100,
            csat: Math.round((item.csat.reduce((a, b) => a + b, 0) / item.csat.length) * 100) / 100,
            nota_ia: Math.round((item.nota_ia.reduce((a, b) => a + b, 0) / item.nota_ia.length) * 100) / 100
        }));

        console.log(`✓ ${cxByPeriodChannel.length} registros de CX processados`);
        return cxByPeriodChannel;
    }

    /**
     * Cria estrutura JSON para o dashboard
     */
    createDashboardJSON(mediaData, cxData) {
        console.log('📦 Criando estrutura JSON...');

        const mediaPeriods = [...new Set(mediaData.map(d => d.period))].sort();
        const cxPeriods = [...new Set(cxData.map(d => d.period))].sort();
        const allChannels = [...new Set([
            ...mediaData.map(d => d.channel),
            ...cxData.map(d => d.channel)
        ])].sort();

        this.dashboardData = {
            media_periods: mediaPeriods,
            cx_periods: cxPeriods,
            all_channels: allChannels,
            media_by_period_channel: mediaData,
            cx_by_period_channel: cxData,
            last_updated: new Date().toISOString()
        };

        console.log(`✓ JSON criado com ${mediaData.length} registros de mídia e ${cxData.length} registros de CX`);
    }

    /**
     * Salva JSON no arquivo
     */
    saveJSON() {
        console.log(`💾 Salvando ${this.outputFile}...`);

        fs.writeFileSync(
            this.outputFile,
            JSON.stringify(this.dashboardData, null, 2),
            'utf-8'
        );

        console.log(`✓ Arquivo salvo: ${this.outputFile}`);
    }

    /**
     * Faz commit e push para o GitHub
     */
    gitCommitPush(commitMessage = null) {
        console.log('🚀 Enviando para o GitHub...');

        if (!commitMessage) {
            const now = new Date();
            commitMessage = `Atualização automática dos dados - ${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;
        }

        try {
            // Add
            execSync(`git add ${this.outputFile}`, { stdio: 'inherit' });

            // Commit
            execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });

            // Push
            execSync('git push origin main', { stdio: 'inherit' });

            console.log('✓ Dados enviados para o GitHub com sucesso!');
            console.log('⏳ Aguarde 2-5 minutos para o GitHub Pages atualizar');

        } catch (error) {
            console.error('❌ Erro ao enviar para o GitHub:', error.message);
            console.error('Certifique-se de que você está no diretório do repositório e tem permissões de push');
        }
    }

    /**
     * Executa o processo completo de atualização
     */
    run(autoPush = true) {
        console.log('='.repeat(60));
        console.log('🔄 INICIANDO ATUALIZAÇÃO DO DASHBOARD');
        console.log('='.repeat(60));

        try {
            // Processar dados
            const mediaData = this.processMediaData();
            const cxData = this.processCXData();

            // Criar JSON
            this.createDashboardJSON(mediaData, cxData);

            // Salvar
            this.saveJSON();

            // Push para GitHub
            if (autoPush) {
                this.gitCommitPush();
            }

            console.log('='.repeat(60));
            console.log('✅ ATUALIZAÇÃO CONCLUÍDA COM SUCESSO!');
            console.log('='.repeat(60));

            return true;

        } catch (error) {
            console.error('❌ Erro durante a atualização:', error);
            console.error(error.stack);
            return false;
        }
    }
}

// Função principal
function main() {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
Uso: node update_dashboard.js --bourbon <arquivo> --cx <arquivo> [opções]

Opções:
  --bourbon <arquivo>    Caminho para a planilha Bourbon (obrigatório)
  --cx <arquivo>         Caminho para a planilha CX Curadoria (obrigatório)
  --output <arquivo>     Nome do arquivo JSON de saída (padrão: data.json)
  --no-push              Não fazer push para o GitHub
  --help, -h             Mostra esta mensagem de ajuda

Exemplo:
  node update_dashboard.js --bourbon dados/bourbon.xlsx --cx dados/cx.xlsx
        `);
        return;
    }

    const bourbonIndex = args.indexOf('--bourbon');
    const cxIndex = args.indexOf('--cx');
    const outputIndex = args.indexOf('--output');
    const noPush = args.includes('--no-push');

    if (bourbonIndex === -1 || cxIndex === -1) {
        console.error('❌ Erro: --bourbon e --cx são obrigatórios');
        console.error('Use --help para ver as opções disponíveis');
        process.exit(1);
    }

    const bourbonFile = args[bourbonIndex + 1];
    const cxFile = args[cxIndex + 1];
    const outputFile = outputIndex !== -1 ? args[outputIndex + 1] : 'data.json';

    // Verificar se os arquivos existem
    if (!fs.existsSync(bourbonFile)) {
        console.error(`❌ Arquivo não encontrado: ${bourbonFile}`);
        process.exit(1);
    }

    if (!fs.existsSync(cxFile)) {
        console.error(`❌ Arquivo não encontrado: ${cxFile}`);
        process.exit(1);
    }

    // Executar atualização
    const updater = new DashboardUpdater(bourbonFile, cxFile, outputFile);
    const success = updater.run(!noPush);

    if (success) {
        console.log('\n📊 Dashboard disponível em: https://marcoscoelhot4c.github.io/dashboard-crm/');
    } else {
        console.log('\n❌ Atualização falhou. Verifique os erros acima.');
        process.exit(1);
    }
}

// Executar se for chamado diretamente
if (require.main === module) {
    main();
}

module.exports = DashboardUpdater;
