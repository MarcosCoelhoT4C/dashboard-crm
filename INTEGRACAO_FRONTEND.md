# 🔄 Integração Frontend - Dashboard CRM

Documentação completa para atualizar o dashboard diretamente pelo navegador ou via API.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Solução 1: Upload no Navegador](#solução-1-upload-no-navegador)
3. [Solução 2: API Flask](#solução-2-api-flask)
4. [Comparação das Soluções](#comparação-das-soluções)
5. [Guia de Uso](#guia-de-uso)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

Criamos **duas soluções** para atualizar o dashboard:

| Solução | Tecnologia | Onde Funciona | Complexidade |
|---------|-----------|---------------|--------------|
| **Upload no Navegador** | JavaScript + SheetJS | GitHub Pages (estático) | ⭐ Simples |
| **API Flask** | Python + Flask | Servidor próprio | ⭐⭐ Moderada |

### Fluxo de Atualização

```
Planilhas Excel → Processamento → data.json → Git Push → Dashboard Atualizado
```

---

## 🌐 Solução 1: Upload no Navegador

**Recomendada para GitHub Pages** - Funciona 100% no navegador sem precisar de servidor!

### Como Funciona

1. Usuário acessa `upload.html`
2. Faz upload das planilhas Excel
3. JavaScript processa os arquivos no navegador usando SheetJS
4. Gera o `data.json` atualizado
5. Usuário baixa e substitui no repositório

### Arquivos Criados

- `upload.html` - Interface de upload
- `js/dashboard-updater.js` - Biblioteca de processamento
- Botão "🔄 Atualizar Dados" no dashboard

### Passo a Passo

#### 1. Acessar a Página de Upload

```
https://marcoscoelhot4c.github.io/dashboard-crm/upload.html
```

Ou clique no botão **"🔄 Atualizar Dados"** no dashboard.

#### 2. Fazer Upload dos Arquivos

1. Clique em **"Selecione o arquivo..."** para Bourbon
2. Escolha a planilha `Bourbon-ControledoInvestimento.xlsx`
3. Clique em **"Selecione o arquivo..."** para CX
4. Escolha a planilha `CX-Curadoria.xlsx`

#### 3. Processar

1. Clique em **"🚀 Processar e Atualizar Dashboard"**
2. Aguarde o processamento (10-30 segundos)
3. Veja as estatísticas:
   - Registros de Mídia processados
   - Registros de CX processados
   - Períodos identificados

#### 4. Baixar e Atualizar

1. Clique em **"💾 Baixar data.json"**
2. Substitua o arquivo no repositório:

```bash
# Clone o repositório (se ainda não tiver)
git clone https://github.com/MarcosCoelhoT4C/dashboard-crm.git
cd dashboard-crm

# Substitua o arquivo
mv ~/Downloads/data.json ./data.json

# Commit e push
git add data.json
git commit -m "Atualização dos dados - $(date +%Y-%m-%d)"
git push origin main
```

3. Aguarde 2-5 minutos para o GitHub Pages atualizar

### Vantagens

✅ **Sem servidor** - Funciona no GitHub Pages
✅ **Privacidade** - Dados não saem do navegador
✅ **Simples** - Interface visual intuitiva
✅ **Gratuito** - Sem custos de hospedagem

### Limitações

⚠️ Requer upload manual
⚠️ Não automatiza o Git push
⚠️ Limitado a arquivos de até 50MB

---

## 🖥️ Solução 2: API Flask

**Recomendada para automação** - API backend que processa e atualiza automaticamente.

### Como Funciona

1. API Flask recebe arquivos Excel via POST
2. Processa os dados em Python (pandas)
3. Retorna JSON pronto para uso
4. Pode ser integrada com GitHub Actions para automação total

### Arquivos Criados

- `api/app.py` - API Flask
- `api/requirements.txt` - Dependências

### Deploy da API

#### Opção 1: Heroku

```bash
# 1. Instalar Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# 2. Login
heroku login

# 3. Criar app
cd api
heroku create dashboard-crm-api

# 4. Deploy
git init
git add .
git commit -m "Initial commit"
git push heroku main

# 5. Ver logs
heroku logs --tail
```

#### Opção 2: Railway

```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Deploy
cd api
railway init
railway up

# 4. Ver URL
railway domain
```

#### Opção 3: Servidor Próprio

```bash
# 1. Instalar dependências
cd api
pip install -r requirements.txt

# 2. Executar
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# 3. Configurar Nginx (opcional)
# Ver documentação do Nginx para reverse proxy
```

### Usar a API

#### Via cURL

```bash
curl -X POST https://sua-api.herokuapp.com/process \
  -F "bourbon=@/caminho/para/bourbon.xlsx" \
  -F "cx=@/caminho/para/cx.xlsx" \
  -o data.json
```

#### Via JavaScript (Frontend)

```javascript
const formData = new FormData();
formData.append('bourbon', bourbonFile);
formData.append('cx', cxFile);

const response = await fetch('https://sua-api.herokuapp.com/process', {
    method: 'POST',
    body: formData
});

const result = await response.json();
console.log(result.data); // JSON do dashboard
```

#### Via Python

```python
import requests

files = {
    'bourbon': open('bourbon.xlsx', 'rb'),
    'cx': open('cx.xlsx', 'rb')
}

response = requests.post('https://sua-api.herokuapp.com/process', files=files)
data = response.json()

# Salvar JSON
with open('data.json', 'w') as f:
    json.dump(data['data'], f, indent=2)
```

### Endpoints da API

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/` | GET | Status da API |
| `/health` | GET | Health check |
| `/process` | POST | Processar arquivos Excel |

### Vantagens

✅ **Automação completa** - Integra com GitHub Actions
✅ **Processamento robusto** - Usa pandas (Python)
✅ **Escalável** - Pode processar múltiplos arquivos
✅ **API REST** - Integra com qualquer sistema

### Limitações

⚠️ Requer servidor/hospedagem
⚠️ Custo mensal (gratuito em planos básicos)
⚠️ Mais complexo de configurar

---

## ⚖️ Comparação das Soluções

| Critério | Upload no Navegador | API Flask |
|----------|---------------------|-----------|
| **Hospedagem** | GitHub Pages (grátis) | Heroku/Railway ($0-7/mês) |
| **Configuração** | ⭐ Simples | ⭐⭐ Moderada |
| **Automação** | ❌ Manual | ✅ Total |
| **Privacidade** | ✅ Dados no navegador | ⚠️ Dados no servidor |
| **Performance** | ⚠️ Limitado pelo navegador | ✅ Rápido |
| **Tamanho de arquivo** | Até 50MB | Até 100MB+ |
| **Integração** | ❌ Limitada | ✅ API REST |

### Recomendação

- **Use Upload no Navegador** se:
  - Quer simplicidade
  - Não precisa de automação
  - Usa GitHub Pages
  - Atualiza manualmente (semanal/mensal)

- **Use API Flask** se:
  - Precisa de automação
  - Atualiza frequentemente (diária)
  - Tem servidor disponível
  - Quer integrar com outros sistemas

---

## 📖 Guia de Uso

### Cenário 1: Atualização Manual (Navegador)

```
1. Acesse: https://marcoscoelhot4c.github.io/dashboard-crm/upload.html
2. Faça upload das planilhas
3. Clique em "Processar"
4. Baixe data.json
5. Substitua no repositório
6. Git push
```

**Tempo total**: ~5 minutos

### Cenário 2: Atualização Automatizada (API + GitHub Actions)

**1. Configure a API** (uma vez)

```bash
# Deploy no Heroku
cd api
heroku create dashboard-crm-api
git push heroku main
```

**2. Crie GitHub Action**

Arquivo: `.github/workflows/update-dashboard.yml`

```yaml
name: Atualizar Dashboard

on:
  schedule:
    - cron: '0 8 * * *'  # Diariamente às 8h
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Download planilhas
        run: |
          # Baixe de Google Drive, Dropbox, etc.
          # Exemplo: wget https://...
      
      - name: Processar via API
        run: |
          curl -X POST https://sua-api.herokuapp.com/process \
            -F "bourbon=@bourbon.xlsx" \
            -F "cx=@cx.xlsx" \
            -o data.json
      
      - name: Commit e Push
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add data.json
          git commit -m "Atualização automática - $(date)"
          git push
```

**Tempo total**: Automático (0 minutos)

### Cenário 3: Atualização via Script Local

```bash
# 1. Processar localmente
python update_dashboard.py \
  --bourbon ~/Downloads/bourbon.xlsx \
  --cx ~/Downloads/cx.xlsx

# 2. Já faz push automaticamente
# Dashboard atualiza em 2-5 minutos
```

**Tempo total**: ~2 minutos

---

## 🔧 Troubleshooting

### Problema: "Erro ao ler arquivo"

**Causa**: Arquivo Excel corrompido ou formato incorreto

**Solução**:
1. Verifique se o arquivo é `.xlsx` ou `.xls`
2. Abra no Excel e salve novamente
3. Verifique se as sheets têm os nomes corretos:
   - `Base Bourbon - Google Ads`
   - `Base Bourbon - Meta Ads`
   - `CX_Curadoria`

### Problema: "Sheet não encontrada"

**Causa**: Nome da sheet está diferente

**Solução**:
1. Abra o Excel
2. Verifique os nomes das abas
3. Renomeie para os nomes esperados
4. Salve e tente novamente

### Problema: "API retorna erro 500"

**Causa**: Erro no processamento dos dados

**Solução**:
1. Verifique os logs da API:
   ```bash
   heroku logs --tail
   ```
2. Verifique se as colunas estão corretas:
   - `Year & month`, `Cost`, `Conversions`, `Receita GA4`
   - `Data`, `Canal`, `NPS P2`, `CSAT P2`, `Nota IA`

### Problema: "Dashboard não atualiza"

**Causa**: GitHub Pages ainda não processou a mudança

**Solução**:
1. Aguarde 5 minutos
2. Limpe o cache do navegador (Ctrl+Shift+R)
3. Verifique o deploy:
   ```
   https://github.com/MarcosCoelhoT4C/dashboard-crm/deployments
   ```

### Problema: "Arquivo muito grande"

**Causa**: Arquivo Excel > 50MB

**Solução**:
1. Use a API Flask (suporta até 100MB)
2. Ou divida os dados em múltiplos arquivos
3. Ou remova dados antigos desnecessários

---

## 📚 Recursos Adicionais

### Documentação

- [SheetJS](https://docs.sheetjs.com/) - Biblioteca para processar Excel
- [Flask](https://flask.palletsprojects.com/) - Framework web Python
- [GitHub Pages](https://pages.github.com/) - Hospedagem estática
- [GitHub Actions](https://docs.github.com/actions) - Automação CI/CD

### Exemplos de Código

- `upload.html` - Interface de upload completa
- `js/dashboard-updater.js` - Biblioteca JavaScript
- `api/app.py` - API Flask completa
- `update_dashboard.py` - Script Python CLI

### Links Úteis

- **Dashboard**: https://marcoscoelhot4c.github.io/dashboard-crm/
- **Upload**: https://marcoscoelhot4c.github.io/dashboard-crm/upload.html
- **Repositório**: https://github.com/MarcosCoelhoT4C/dashboard-crm
- **Issues**: https://github.com/MarcosCoelhoT4C/dashboard-crm/issues

---

## 🎯 Próximos Passos

1. **Teste a solução de navegador**
   - Acesse `upload.html`
   - Faça um teste com suas planilhas
   - Verifique o JSON gerado

2. **Configure automação (opcional)**
   - Deploy da API Flask
   - Configure GitHub Actions
   - Agende atualizações diárias

3. **Monitore e otimize**
   - Acompanhe os logs
   - Ajuste conforme necessário
   - Adicione validações extras

---

**Última atualização**: Janeiro 2026
**Versão**: 1.0
**Suporte**: https://github.com/MarcosCoelhoT4C/dashboard-crm/issues
