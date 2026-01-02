# 🤖 Automação do Dashboard CRM

Este documento explica como usar os scripts de automação para atualizar o dashboard automaticamente.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Instalação](#instalação)
4. [Uso - Python](#uso-python)
5. [Uso - JavaScript](#uso-javascript)
6. [Automação com Cron/Scheduler](#automação-com-cronscheduler)
7. [Solução de Problemas](#solução-de-problemas)

---

## 🎯 Visão Geral

Os scripts de automação processam suas planilhas Excel (Bourbon e CX Curadoria) e atualizam o arquivo `data.json` no GitHub automaticamente. O GitHub Pages detecta a mudança e atualiza o dashboard em 2-5 minutos.

### Fluxo de Automação

```
Planilhas Excel → Script → data.json → Git Push → GitHub Pages → Dashboard Atualizado
```

---

## 📦 Pré-requisitos

### Para Python

- **Python 3.8+** instalado
- **Git** configurado com acesso ao repositório
- Dependências: `pandas`, `openpyxl`

### Para JavaScript/Node.js

- **Node.js 14+** instalado
- **Git** configurado com acesso ao repositório
- Dependência: `xlsx`

### Configuração do Git

Certifique-se de que o Git está configurado:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

E que você tem acesso ao repositório:

```bash
cd dashboard-crm
git remote -v
# Deve mostrar: origin  https://github.com/MarcosCoelhoT4C/dashboard-crm.git
```

---

## 🔧 Instalação

### Python

```bash
# 1. Clone o repositório (se ainda não tiver)
git clone https://github.com/MarcosCoelhoT4C/dashboard-crm.git
cd dashboard-crm

# 2. Instale as dependências
pip install -r requirements.txt

# 3. Torne o script executável (Linux/Mac)
chmod +x update_dashboard.py
```

### JavaScript/Node.js

```bash
# 1. Clone o repositório (se ainda não tiver)
git clone https://github.com/MarcosCoelhoT4C/dashboard-crm.git
cd dashboard-crm

# 2. Instale as dependências
npm install

# 3. Torne o script executável (Linux/Mac)
chmod +x update_dashboard.js
```

---

## 🐍 Uso - Python

### Comando Básico

```bash
python update_dashboard.py \
  --bourbon /caminho/para/bourbon.xlsx \
  --cx /caminho/para/cx_curadoria.xlsx
```

### Opções Disponíveis

| Opção | Descrição | Obrigatório |
|-------|-----------|-------------|
| `--bourbon` | Caminho para a planilha Bourbon | ✅ Sim |
| `--cx` | Caminho para a planilha CX Curadoria | ✅ Sim |
| `--output` | Nome do arquivo JSON de saída (padrão: `data.json`) | ❌ Não |
| `--no-push` | Não fazer push para o GitHub (apenas gerar JSON) | ❌ Não |

### Exemplos

**1. Atualização completa (com push para GitHub)**

```bash
python update_dashboard.py \
  --bourbon ~/Downloads/Bourbon-ControledoInvestimento.xlsx \
  --cx ~/Downloads/CX-Curadoria.xlsx
```

**2. Apenas gerar JSON (sem push)**

```bash
python update_dashboard.py \
  --bourbon ~/Downloads/Bourbon-ControledoInvestimento.xlsx \
  --cx ~/Downloads/CX-Curadoria.xlsx \
  --no-push
```

**3. Salvar com nome diferente**

```bash
python update_dashboard.py \
  --bourbon ~/Downloads/Bourbon-ControledoInvestimento.xlsx \
  --cx ~/Downloads/CX-Curadoria.xlsx \
  --output backup-data.json
```

### Saída Esperada

```
============================================================
🔄 INICIANDO ATUALIZAÇÃO DO DASHBOARD
============================================================
📊 Processando dados de mídia...
✓ 2 registros de mídia processados
😊 Processando dados de CX...
✓ 42 registros de CX processados
📦 Criando estrutura JSON...
✓ JSON criado com 2 registros de mídia e 42 registros de CX
💾 Salvando data.json...
✓ Arquivo salvo: data.json
🚀 Enviando para o GitHub...
✓ Dados enviados para o GitHub com sucesso!
⏳ Aguarde 2-5 minutos para o GitHub Pages atualizar
============================================================
✅ ATUALIZAÇÃO CONCLUÍDA COM SUCESSO!
============================================================

📊 Dashboard disponível em: https://marcoscoelhot4c.github.io/dashboard-crm/
```

---

## 🟢 Uso - JavaScript

### Comando Básico

```bash
node update_dashboard.js \
  --bourbon /caminho/para/bourbon.xlsx \
  --cx /caminho/para/cx_curadoria.xlsx
```

### Opções Disponíveis

| Opção | Descrição | Obrigatório |
|-------|-----------|-------------|
| `--bourbon` | Caminho para a planilha Bourbon | ✅ Sim |
| `--cx` | Caminho para a planilha CX Curadoria | ✅ Sim |
| `--output` | Nome do arquivo JSON de saída (padrão: `data.json`) | ❌ Não |
| `--no-push` | Não fazer push para o GitHub (apenas gerar JSON) | ❌ Não |
| `--help`, `-h` | Mostra ajuda | ❌ Não |

### Exemplos

**1. Atualização completa (com push para GitHub)**

```bash
node update_dashboard.js \
  --bourbon ~/Downloads/Bourbon-ControledoInvestimento.xlsx \
  --cx ~/Downloads/CX-Curadoria.xlsx
```

**2. Apenas gerar JSON (sem push)**

```bash
node update_dashboard.js \
  --bourbon ~/Downloads/Bourbon-ControledoInvestimento.xlsx \
  --cx ~/Downloads/CX-Curadoria.xlsx \
  --no-push
```

**3. Ver ajuda**

```bash
node update_dashboard.js --help
```

---

## ⏰ Automação com Cron/Scheduler

### Linux/Mac - Cron

Para atualizar automaticamente todos os dias às 8h da manhã:

```bash
# 1. Abra o crontab
crontab -e

# 2. Adicione a linha (ajuste os caminhos):
0 8 * * * cd /home/usuario/dashboard-crm && python update_dashboard.py --bourbon /caminho/bourbon.xlsx --cx /caminho/cx.xlsx >> /var/log/dashboard-update.log 2>&1
```

**Exemplos de agendamento:**

| Cron | Descrição |
|------|-----------|
| `0 8 * * *` | Todos os dias às 8h |
| `0 */6 * * *` | A cada 6 horas |
| `0 9 * * 1` | Toda segunda-feira às 9h |
| `0 0 1 * *` | Todo dia 1 do mês à meia-noite |

### Windows - Task Scheduler

**1. Criar arquivo batch (.bat):**

```batch
@echo off
cd C:\Users\Usuario\dashboard-crm
python update_dashboard.py --bourbon C:\dados\bourbon.xlsx --cx C:\dados\cx.xlsx
```

**2. Agendar no Task Scheduler:**

1. Abra o **Agendador de Tarefas**
2. Clique em **Criar Tarefa Básica**
3. Nome: "Atualizar Dashboard CRM"
4. Gatilho: Escolha a frequência (diária, semanal, etc.)
5. Ação: **Iniciar um programa**
6. Programa: `C:\Users\Usuario\dashboard-crm\atualizar.bat`
7. Finalize

### GitHub Actions (Automação na Nuvem)

Crie `.github/workflows/update-dashboard.yml`:

```yaml
name: Atualizar Dashboard

on:
  schedule:
    - cron: '0 8 * * *'  # Todos os dias às 8h UTC
  workflow_dispatch:  # Permite execução manual

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      
      - name: Install dependencies
        run: pip install -r requirements.txt
      
      - name: Download data files
        run: |
          # Baixe suas planilhas de um local seguro
          # Ex: Google Drive, Dropbox, S3, etc.
          
      - name: Update dashboard
        run: |
          python update_dashboard.py \
            --bourbon bourbon.xlsx \
            --cx cx.xlsx
      
      - name: Commit and push
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add data.json
          git commit -m "Atualização automática - $(date)"
          git push
```

---

## 🔍 Solução de Problemas

### Erro: "Arquivo não encontrado"

**Problema:** O script não encontra as planilhas Excel.

**Solução:**
```bash
# Verifique o caminho completo do arquivo
ls -la /caminho/para/arquivo.xlsx

# Use caminhos absolutos
python update_dashboard.py \
  --bourbon /home/usuario/Downloads/bourbon.xlsx \
  --cx /home/usuario/Downloads/cx.xlsx
```

### Erro: "Permission denied" (Git)

**Problema:** Não tem permissão para fazer push no GitHub.

**Solução:**
```bash
# Configure suas credenciais do GitHub
gh auth login

# Ou use SSH
git remote set-url origin git@github.com:MarcosCoelhoT4C/dashboard-crm.git
```

### Erro: "ModuleNotFoundError: No module named 'pandas'"

**Problema:** Dependências Python não instaladas.

**Solução:**
```bash
pip install -r requirements.txt
```

### Erro: "Cannot find module 'xlsx'"

**Problema:** Dependências Node.js não instaladas.

**Solução:**
```bash
npm install
```

### Dashboard não atualiza

**Problema:** O GitHub Pages não reflete as mudanças.

**Solução:**
1. Verifique se o commit foi feito: `git log -1`
2. Verifique o deploy: https://github.com/MarcosCoelhoT4C/dashboard-crm/deployments
3. Aguarde 5 minutos
4. Limpe o cache do navegador (Ctrl+Shift+R)

### Dados incorretos no dashboard

**Problema:** Os dados não aparecem corretamente.

**Solução:**
1. Valide o JSON: https://jsonlint.com/
2. Verifique a estrutura das planilhas:
   - Bourbon: Sheets "Base Bourbon - Google Ads" e "Base Bourbon - Meta Ads"
   - CX: Sheet "CX_Curadoria"
3. Verifique os nomes das colunas:
   - `Year & month`, `Cost`, `Conversions`, `Receita GA4`
   - `Data`, `Canal`, `NPS P2`, `CSAT P2`, `Nota IA`

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs de erro
2. Consulte este documento
3. Abra uma issue no GitHub: https://github.com/MarcosCoelhoT4C/dashboard-crm/issues

---

## 📚 Recursos Adicionais

- **Repositório**: https://github.com/MarcosCoelhoT4C/dashboard-crm
- **Dashboard**: https://marcoscoelhot4c.github.io/dashboard-crm/
- **Documentação do Git**: https://git-scm.com/doc
- **Documentação do Pandas**: https://pandas.pydata.org/docs/
- **Documentação do XLSX**: https://www.npmjs.com/package/xlsx

---

**Última atualização**: Janeiro 2026
**Versão**: 1.0
