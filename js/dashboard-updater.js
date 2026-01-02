/**
 * Dashboard Updater - Processamento de Excel no Navegador
 * Processa arquivos Excel diretamente no frontend usando SheetJS
 */

class DashboardUpdater {
    constructor() {
        this.bourbonData = null;
        this.cxData = null;
        this.dashboardData = null;
    }

    /**
     * Processa arquivo Excel no navegador
     */
    async processExcelFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    resolve(workbook);
                } catch (error) {
                    reject(new Error(`Erro ao ler arquivo: ${error.message}`));
                }
            };
            
            reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Processa dados de mídia (Google Ads e Meta Ads)
     */
    processMediaData(workbook) {
        try {
            // Ler Google Ads
            const googleAdsSheet = workbook.Sheets['Base Bourbon - Google Ads'];
            if (!googleAdsSheet) {
                throw new Error('Sheet "Base Bourbon - Google Ads" não encontrada');
            }
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
            if (!metaAdsSheet) {
                throw new Error('Sheet "Base Bourbon - Meta Ads" não encontrada');
            }
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

            return mediaByPeriodChannel;
        } catch (error) {
            throw new Error(`Erro ao processar dados de mídia: ${error.message}`);
        }
    }

    /**
     * Processa dados de CX (NPS, CSAT, Nota IA)
     */
    processCXData(workbook) {
        try {
            const cxSheet = workbook.Sheets['CX_Curadoria'];
            if (!cxSheet) {
                throw new Error('Sheet "CX_Curadoria" não encontrada');
            }
            const cxData = XLSX.utils.sheet_to_json(cxSheet);

            // Mapear NPS e CSAT
            const npsMap = { 'Promotor': 10, 'Neutro': 5, 'Detrator': 0 };
            const csatMap = { 'Satisfeito': 10, 'Neutro': 5, 'Insatisfeito': 0 };

            // Processar dados
            const cxProcessed = cxData
                .filter(row => row['Data'] && row['Canal'])
                .map(row => {
                    // Converter data do Excel para JavaScript
                    let date;
                    if (typeof row['Data'] === 'number') {
                        // Data do Excel (número de dias desde 1900-01-01)
                        date = XLSX.SSF.parse_date_code(row['Data']);
                    } else {
                        date = new Date(row['Data']);
                    }
                    
                    const year = date.y || date.getFullYear();
                    const month = String(date.m || (date.getMonth() + 1)).padStart(2, '0');
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

            return cxByPeriodChannel;
        } catch (error) {
            throw new Error(`Erro ao processar dados de CX: ${error.message}`);
        }
    }

    /**
     * Cria estrutura JSON para o dashboard
     */
    createDashboardJSON(mediaData, cxData) {
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

        return this.dashboardData;
    }

    /**
     * Processa ambos os arquivos e retorna JSON
     */
    async processFiles(bourbonFile, cxFile, onProgress) {
        try {
            // Validar arquivos
            if (!bourbonFile || !cxFile) {
                throw new Error('Ambos os arquivos são obrigatórios');
            }

            if (onProgress) onProgress('Lendo arquivo Bourbon...', 10);
            
            // Processar Bourbon
            const bourbonWorkbook = await this.processExcelFile(bourbonFile);
            this.bourbonData = bourbonWorkbook;
            
            if (onProgress) onProgress('Processando dados de mídia...', 30);
            const mediaData = this.processMediaData(bourbonWorkbook);
            
            if (onProgress) onProgress('Lendo arquivo CX...', 50);
            
            // Processar CX
            const cxWorkbook = await this.processExcelFile(cxFile);
            this.cxData = cxWorkbook;
            
            if (onProgress) onProgress('Processando dados de CX...', 70);
            const cxData = this.processCXData(cxWorkbook);
            
            if (onProgress) onProgress('Criando JSON...', 90);
            
            // Criar JSON
            const dashboardData = this.createDashboardJSON(mediaData, cxData);
            
            if (onProgress) onProgress('Concluído!', 100);
            
            return {
                success: true,
                data: dashboardData,
                stats: {
                    media_records: mediaData.length,
                    cx_records: cxData.length,
                    periods: new Set([...mediaPeriods, ...cxPeriods]).size
                }
            };
            
        } catch (error) {
            throw new Error(`Erro ao processar arquivos: ${error.message}`);
        }
    }

    /**
     * Baixa o JSON gerado
     */
    downloadJSON(filename = 'data.json') {
        if (!this.dashboardData) {
            throw new Error('Nenhum dado processado. Execute processFiles() primeiro.');
        }

        const dataStr = JSON.stringify(this.dashboardData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /**
     * Atualiza o dashboard com novos dados
     */
    updateDashboard(data) {
        // Recarregar a página com novos dados
        if (typeof loadData === 'function') {
            dashboardData = data;
            applyFilters();
        } else {
            // Salvar no localStorage e recarregar
            localStorage.setItem('dashboardData', JSON.stringify(data));
            window.location.reload();
        }
    }
}

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardUpdater;
}
