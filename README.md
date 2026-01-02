# 📊 Dashboard CRM - Análise Avançada

Dashboard interativo para análise de campanhas de CRM com foco em **atribuição avançada**, **testes com grupo de controle** e **KPIs de impacto**.

## 🎯 Funcionalidades

- **Filtros Dinâmicos**: Período e Canal com atualização em tempo real
- **4 Abas Principais**:
  - 📈 Visão Geral: Investimento, Receita, ROAS, Conversões
  - 📺 Mídia: Desempenho por canal, CAC, ROAS
  - 💰 KPIs: Métricas de impacto e eficiência
  - 😊 CX: NPS, CSAT, Satisfação por canal

- **Gráficos Interativos**: 6 visualizações dinâmicas com Chart.js
- **Tabelas Comparativas**: Badges de status e análise por canal
- **Design Responsivo**: Funciona em desktop e mobile

## 📊 Dados Disponíveis

| Tipo | Períodos | Canais |
|------|----------|--------|
| **Mídia** | Dezembro 2025 | Google Ads, Meta Ads |
| **CX** | Nov 2024 - Dez 2025 | Chat, Voz, WhatsApp |

## 🚀 Como Usar

1. **Abra o dashboard**: Acesse `index.html` no navegador
2. **Selecione filtros**:
   - Período: Escolha um mês específico
   - Canal: Escolha um canal de mídia ou atendimento
3. **Observe os dados**: Todos os gráficos e KPIs atualizam automaticamente
4. **Explore as abas**: Navegue entre Visão Geral, Mídia, KPIs e CX
5. **Resetar**: Clique em "🔄 Resetar Filtros" para voltar aos dados completos

## 📁 Estrutura de Arquivos

```
dashboard-crm/
├── index.html          # Dashboard interativo
├── data.json           # Dados estruturados por período e canal
├── README.md           # Este arquivo
└── .git/               # Repositório Git
```

## 🔧 Tecnologias

- **HTML5**: Estrutura semântica
- **CSS3**: Design responsivo e gradientes
- **JavaScript**: Lógica de filtros e atualização dinâmica
- **Chart.js**: Gráficos interativos
- **JSON**: Estrutura de dados

## 📈 KPIs Monitorados

### Mídia
- **Investimento Total**: Gasto em campanhas
- **Receita Gerada**: Receita GA4
- **ROAS**: Retorno sobre investimento em mídia
- **CAC**: Custo de aquisição de cliente
- **Conversões**: Total de conversões por canal

### CX
- **NPS**: Net Promoter Score (0-10)
- **CSAT**: Customer Satisfaction (0-10)
- **Nota IA**: Qualidade de atendimento (0-10)

## 💡 Insights Principais

- **Atribuição Data-Driven**: Identifica a verdadeira contribuição de cada canal
- **Incrementalidade**: Testes com grupo de controle comprovam impacto real
- **Eficiência**: Relação LTV/CAC mostra sustentabilidade do modelo
- **Satisfação**: Canais com melhor NPS e CSAT para priorização

## 🔄 Atualizar Dados

Para atualizar os dados do dashboard:

1. Edite o arquivo `data.json` com novos dados
2. Mantenha a estrutura JSON:
   ```json
   {
     "media_periods": ["2025|12"],
     "cx_periods": ["2024|11", ...],
     "all_channels": ["Google Ads", "Meta Ads", ...],
     "media_by_period_channel": [...],
     "cx_by_period_channel": [...]
   }
   ```
3. Faça commit e push para atualizar o site

## 📚 Documentação Técnica

Para entender os conceitos de:
- **Atribuição Data-Driven**
- **Testes com Grupo de Controle**
- **KPIs de Impacto**
- **Experiência do Cliente**

Consulte o guia técnico completo: `GUIA_TECNICO_DASHBOARD.md`

## 🌐 Deploy

Este projeto está hospedado no **GitHub Pages** e é atualizado automaticamente quando você faz push para a branch `main`.

**URL Permanente**: `https://[seu-usuario].github.io/dashboard-crm`

## 📝 Licença

Projeto criado para análise de CRM e marketing. Uso livre para fins internos.

## 📞 Suporte

Para dúvidas ou sugestões sobre o dashboard, entre em contato com a equipe de Analytics.

---

**Última atualização**: Janeiro 2026
**Versão**: 1.0
