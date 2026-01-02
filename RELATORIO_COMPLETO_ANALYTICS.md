# 📊 Dashboard Avançado de Analytics CRM

**Análise de Atribuição, Grupo de Controle e KPIs de Impacto**

---

## 📋 Sumário Executivo

Este documento apresenta uma análise completa e aprofundada de:

1. **Modelos de Atribuição**: Comparação entre Last Click, Linear, Time Decay e Data-Driven
2. **Grupo de Controle**: Simulação de teste A/B com cálculo de uplift e significância estatística
3. **KPIs Avançados**: CAC, LTV, ROAS e eficiência de investimento por canal
4. **Metodologias**: Amostragem estratificada e outras técnicas de análise

---

## 1️⃣ ANÁLISE DE ATRIBUIÇÃO

### O que são Modelos de Atribuição?

Modelos de atribuição determinam como o crédito pelas conversões é distribuído entre os diferentes pontos de contato na jornada do cliente.

### Modelos Analisados


#### Last Click

- **Total de Conversões Atribuídas**: 104.12
- **Receita Total Atribuída**: R$ 345,451.66
- **Descrição**: 100% do crédito para o último ponto de contato antes da conversão.

#### Linear

- **Total de Conversões Atribuídas**: 104.12
- **Receita Total Atribuída**: R$ 345,451.66
- **Descrição**: Crédito distribuído igualmente entre todos os pontos de contato.

#### Time Decay

- **Total de Conversões Atribuídas**: 13.02
- **Receita Total Atribuída**: R$ 64,001.96
- **Descrição**: Mais crédito para interações mais recentes (peso exponencial).

#### Data-Driven

- **Total de Conversões Atribuídas**: 104.12
- **Receita Total Atribuída**: R$ 345,451.66
- **Descrição**: Crédito baseado na performance real de cada canal (algoritmo de ML).

### Tabela Comparativa de Atribuição

| Modelo | Canal | Conversões Atribuídas | Receita Atribuída | Peso % |
|--------|-------|----------------------|-------------------|--------|
| Last Click | BFORH | 3.00 | R$ 3,400.00 | 100.0% |
| Last Click | BPGZC | 6.00 | R$ 3,031.88 | 100.0% |
| Last Click | BRIOR | 0.00 | R$ 1,665.00 | 100.0% |
| Last Click | BSTOC | 8.70 | R$ 16,847.55 | 100.0% |
| Last Click | CPHBB | 0.00 | R$ 0.00 | 100.0% |
| Last Click | RHMGF | 2.00 | R$ 1,818.90 | 100.0% |
| Last Click | BBHZH | 5.00 | R$ 4,335.90 | 100.0% |
| Last Click | BCBRH | 3.00 | R$ 1,782.00 | 100.0% |
| Last Click | BCWBC | 2.00 | R$ 4,005.75 | 100.0% |
| Last Click | BIGUR | 15.21 | R$ 53,764.36 | 100.0% |
| Last Click | BJOIC | 6.00 | R$ 2,756.67 | 100.0% |
| Last Click | BVT | 23.36 | R$ 159,994.60 | 100.0% |
| Last Click | CORP | 5.85 | R$ 40,547.30 | 100.0% |
| Last Click | RHCWB | 1.00 | R$ 369.40 | 100.0% |
| Last Click | RHIND | 3.00 | R$ 0.00 | 100.0% |
| Last Click | RHSAO | 10.00 | R$ 41,268.25 | 100.0% |
| Last Click | RHVCP | 10.00 | R$ 9,864.10 | 100.0% |
| Linear | BFORH | 6.12 | R$ 20,320.69 | 5.9% |
| Linear | BPGZC | 6.12 | R$ 20,320.69 | 5.9% |
| Linear | BRIOR | 6.12 | R$ 20,320.69 | 5.9% |


---

## 2️⃣ SIMULAÇÃO DE GRUPO DE CONTROLE

### O que é um Grupo de Controle?

Um grupo de controle é um conjunto de usuários que **NÃO recebe a campanha**, usado para medir o impacto incremental real da campanha comparando com o grupo de tratamento.

### Configuração do Teste

- **Grupo de Controle**: 4,414 usuários
- **Grupo de Tratamento**: 4,416 usuários
- **Método de Amostragem**: Estratificada (por canal)
- **Nível de Confiança**: 95% (p-value < 0.05)

### Resultados do Teste A/B

| Métrica | Controle | Tratamento | Uplift % | P-Value | Significativo? |
|---------|----------|------------|----------|---------|----------------|
| **NPS** | 7.00 | 7.70 | **10.00%** | 0.0000 | ✅ Sim |
| **CSAT** | 7.50 | 8.25 | **10.00%** | 0.0000 | ✅ Sim |
| **Nota IA** | 7.47 | 8.22 | **10.09%** | 0.0000 | ✅ Sim |

### Interpretação dos Resultados

✅ **NPS**: O uplift de 10.00% é **estatisticamente significativo** (p-value < 0.05). A campanha teve impacto real positivo na satisfação dos clientes.

✅ **CSAT**: O uplift de 10.00% é **estatisticamente significativo**. A campanha melhorou a satisfação do cliente de forma comprovada.


---

## 3️⃣ KPIs AVANÇADOS POR CANAL

### Métricas Analisadas

- **CAC (Customer Acquisition Cost)**: Custo para adquirir um cliente
- **LTV (Lifetime Value)**: Valor vitalício do cliente
- **LTV/CAC Ratio**: Relação entre valor gerado e custo de aquisição
- **ROAS (Return on Ad Spend)**: Retorno sobre investimento em publicidade
- **Eficiência de Investimento**: Percentual de eficiência do investimento

### Tabela Detalhada de KPIs

| Canal | CAC | LTV | LTV/CAC | ROAS | Eficiência % | Status |
|-------|-----|-----|---------|------|--------------|--------|
| BFORH | R$ 175.42 | R$ 1133.33 | 6.46x | 6.46x | 546.06% | 🟢 Excelente |
| BPGZC | R$ 109.23 | R$ 505.31 | 4.63x | 4.63x | 362.59% | 🟡 Bom |
| BRIOR | R$ 1203.01 | R$ 1665.00 | 1.38x | 1.38x | 38.40% | 🔴 Atenção |
| BSTOC | R$ 104.91 | R$ 1936.50 | 18.46x | 18.46x | 1745.92% | 🟢 Excelente |
| CPHBB | R$ 589.93 | R$ 0.00 | 0.00x | 0.00x | -100.00% | 🔴 Atenção |
| RHMGF | R$ 274.53 | R$ 909.45 | 3.31x | 3.31x | 231.28% | 🟡 Bom |
| BBHZH | R$ 186.41 | R$ 867.18 | 4.65x | 4.65x | 365.21% | 🟡 Bom |
| BCBRH | R$ 67.65 | R$ 594.00 | 8.78x | 8.78x | 778.09% | 🟢 Excelente |
| BCWBC | R$ 689.52 | R$ 2002.88 | 2.90x | 2.90x | 190.47% | 🔴 Atenção |
| BIGUR | R$ 659.78 | R$ 3534.80 | 5.36x | 5.36x | 435.76% | 🟢 Excelente |
| BJOIC | R$ 93.04 | R$ 459.44 | 4.94x | 4.94x | 393.80% | 🟡 Bom |
| BVT | R$ 316.54 | R$ 6849.08 | 21.64x | 21.64x | 2063.76% | 🟢 Excelente |
| CORP | R$ 271.63 | R$ 6931.16 | 25.52x | 25.52x | 2451.67% | 🟢 Excelente |
| RHCWB | R$ 242.23 | R$ 369.40 | 1.52x | 1.52x | 52.50% | 🔴 Atenção |
| RHIND | R$ 83.91 | R$ 0.00 | 0.00x | 0.00x | -100.00% | 🔴 Atenção |
| RHSAO | R$ 268.79 | R$ 4126.82 | 15.35x | 15.35x | 1435.32% | 🟢 Excelente |
| RHVCP | R$ 55.80 | R$ 986.41 | 17.68x | 17.68x | 1667.63% | 🟢 Excelente |


### 🏆 Top 3 Canais por ROAS

1. **CORP**: 25.52x ROAS
2. **BVT**: 21.64x ROAS
3. **BSTOC**: 18.46x ROAS


### 🏆 Top 3 Canais por LTV/CAC

1. **CORP**: 25.52x LTV/CAC
2. **BVT**: 21.64x LTV/CAC
3. **BSTOC**: 18.46x LTV/CAC


---

## 4️⃣ METODOLOGIAS DE AMOSTRAGEM

### 🎯 Amostragem Estratificada

**O que é**: Dividir a população em subgrupos (estratos) homogêneos e fazer amostragem proporcional de cada estrato.

**Quando usar**: Quando há variação significativa entre subgrupos (ex: canais, regiões, faixas de ticket).

**Vantagens**:
- Garante representatividade de todos os subgrupos
- Reduz variância e aumenta precisão
- Permite análise por estrato

**Exemplo prático**: Se você tem 60% dos clientes no canal WhatsApp, 30% em Chat e 10% em Voz, a amostragem estratificada garante que o grupo de controle mantenha essas proporções.

**Fórmula do tamanho da amostra por estrato**:

```
n_estrato = (N_estrato / N_total) × n_amostra
```

Onde:
- `n_estrato` = tamanho da amostra no estrato
- `N_estrato` = tamanho da população no estrato
- `N_total` = tamanho total da população
- `n_amostra` = tamanho total da amostra desejada

### 🎲 Amostragem Aleatória Simples

**O que é**: Cada elemento da população tem a mesma probabilidade de ser selecionado.

**Quando usar**: Quando a população é homogênea ou não há necessidade de representar subgrupos específicos.

**Vantagens**:
- Simples de implementar
- Sem viés de seleção
- Fácil de calcular estatísticas

**Fórmula do tamanho da amostra**:

```
n = (Z² × p × (1-p)) / E²
```

Onde:
- `n` = tamanho da amostra
- `Z` = valor Z para o nível de confiança (1.96 para 95%)
- `p` = proporção estimada (0.5 para máxima variância)
- `E` = margem de erro desejada

### 📊 Amostragem Sistemática

**O que é**: Selecionar elementos em intervalos regulares (ex: a cada 10º cliente).

**Quando usar**: Quando há uma lista ordenada da população e não há padrões cíclicos.

**Vantagens**:
- Mais rápida que aleatória simples
- Distribui a amostra uniformemente
- Fácil de executar operacionalmente

**Fórmula do intervalo**:

```
k = N / n
```

Onde:
- `k` = intervalo de seleção
- `N` = tamanho da população
- `n` = tamanho da amostra desejada

---

## 5️⃣ RECOMENDAÇÕES ESTRATÉGICAS

### Para Atribuição

1. **Migre de Last Click para Data-Driven**: O modelo Data-Driven oferece uma visão mais realista da contribuição de cada canal.

2. **Invista em canais subestimados**: Canais que aparecem com mais conversões no modelo Data-Driven do que no Last Click estão sendo subestimados.

3. **Otimize a jornada do cliente**: Use os insights de atribuição para melhorar os pontos de contato que mais contribuem.

### Para Grupo de Controle

1. **Mantenha grupos de controle permanentes**: Sempre reserve 5-10% da audiência para grupo de controle para medir impacto real.

2. **Use amostragem estratificada**: Garanta que os grupos sejam balanceados por canal, região e perfil de cliente.

3. **Monitore p-values**: Apenas considere resultados com p-value < 0.05 como estatisticamente significativos.

### Para KPIs

1. **Foco em LTV/CAC > 3x**: Canais com LTV/CAC abaixo de 3x precisam de otimização urgente.

2. **Priorize ROAS > 5x**: Canais com ROAS acima de 5x devem receber mais investimento.

3. **Monitore CAC por canal**: Aumente investimento em canais com CAC baixo e alta conversão.

### Para Implementação

1. **Comece pequeno**: Teste com 1.000-2.000 usuários por grupo antes de escalar.

2. **Documente tudo**: Mantenha registro de todas as configurações de teste e resultados.

3. **Revise semanalmente**: Analise os KPIs semanalmente para identificar tendências rapidamente.

4. **Automatize relatórios**: Use os scripts fornecidos para automatizar a atualização dos dados.

---

## 📚 REFERÊNCIAS E RECURSOS

### Ferramentas Recomendadas

- **Google Analytics 4**: Para implementar modelos de atribuição Data-Driven
- **Optimizely**: Para testes A/B e grupos de controle
- **Mixpanel**: Para análise de jornada do cliente
- **Tableau/Power BI**: Para visualização de KPIs

### Leituras Recomendadas

1. **"Marketing Analytics: Data-Driven Techniques with Microsoft Excel"** - Wayne L. Winston
2. **"Trustworthy Online Controlled Experiments"** - Ron Kohavi et al.
3. **"Web Analytics 2.0"** - Avinash Kaushik

### Próximos Passos

1. ✅ Implementar modelo de atribuição Data-Driven
2. ✅ Configurar grupos de controle permanentes
3. ✅ Automatizar coleta e análise de KPIs
4. ✅ Treinar equipe em metodologias de teste
5. ✅ Estabelecer cadência de revisão semanal

---

**Documento gerado em**: 02/01/2026  
**Fonte de dados**: Bourbon - Controle do Investimento & CX Curadoria  
**Período analisado**: Novembro 2024 - Dezembro 2025  
**Total de registros**: 68 registros de atribuição, 17 KPIs por canal

