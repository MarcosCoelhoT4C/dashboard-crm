# 🚀 Instruções para Habilitar GitHub Pages

O repositório foi criado com sucesso! Agora você precisa habilitar o GitHub Pages manualmente.

## 📋 Passo a Passo

### 1. Acesse as Configurações do Repositório

Acesse: **https://github.com/MarcosCoelhoT4C/dashboard-crm/settings/pages**

Ou siga:
1. Vá para https://github.com/MarcosCoelhoT4C/dashboard-crm
2. Clique em **Settings** (Configurações)
3. No menu lateral, clique em **Pages**

### 2. Configure o GitHub Pages

Na seção **"Build and deployment"**:

1. **Source**: Selecione **"Deploy from a branch"**
2. **Branch**: Selecione **"main"**
3. **Folder**: Selecione **"/ (root)"**
4. Clique em **"Save"**

### 3. Aguarde o Deploy

- O GitHub levará alguns minutos (1-5 min) para fazer o deploy
- Você verá uma mensagem: **"Your site is live at..."**
- A URL será: **https://marcoscoelhot4c.github.io/dashboard-crm/**

### 4. Acesse o Dashboard

Após o deploy, acesse:

**🌐 https://marcoscoelhot4c.github.io/dashboard-crm/**

## ✅ Verificar Status

Para verificar se o site está no ar:

1. Acesse: https://github.com/MarcosCoelhoT4C/dashboard-crm/deployments
2. Você verá o status do deploy
3. Quando aparecer ✅ **"Active"**, o site está no ar

## 🔄 Atualizar o Dashboard

Para atualizar o dashboard no futuro:

```bash
# 1. Clone o repositório (apenas uma vez)
git clone https://github.com/MarcosCoelhoT4C/dashboard-crm.git
cd dashboard-crm

# 2. Faça suas alterações nos arquivos
# Edite index.html, data.json, etc.

# 3. Commit e push
git add .
git commit -m "Atualização dos dados"
git push origin main

# 4. O GitHub Pages atualiza automaticamente em 1-5 minutos
```

## 📊 Atualizar Apenas os Dados

Para atualizar apenas os dados sem mexer no código:

1. Edite o arquivo `data.json`
2. Mantenha a estrutura JSON:
   ```json
   {
     "media_periods": ["2025|12"],
     "cx_periods": ["2024|11", "2024|12", ...],
     "all_channels": ["Google Ads", "Meta Ads", ...],
     "media_by_period_channel": [...],
     "cx_by_period_channel": [...]
   }
   ```
3. Commit e push:
   ```bash
   git add data.json
   git commit -m "Atualização dos dados - [data]"
   git push origin main
   ```

## 🔧 Solução de Problemas

### Site não carrega

1. Verifique se o GitHub Pages está habilitado em Settings > Pages
2. Aguarde 5 minutos após habilitar
3. Limpe o cache do navegador (Ctrl+Shift+R)

### Dados não atualizam

1. Verifique se o arquivo `data.json` está correto
2. Valide o JSON em https://jsonlint.com/
3. Aguarde 5 minutos após o push

### Erro 404

1. Verifique se o arquivo `index.html` existe na raiz
2. Verifique se a branch está configurada como `main`
3. Acesse https://github.com/MarcosCoelhoT4C/dashboard-crm/deployments para ver logs

## 📞 Suporte

Se tiver problemas, verifique:
- https://docs.github.com/pt/pages
- https://github.com/MarcosCoelhoT4C/dashboard-crm/issues

---

**Repositório**: https://github.com/MarcosCoelhoT4C/dashboard-crm
**URL do Site**: https://marcoscoelhot4c.github.io/dashboard-crm/
**Última atualização**: Janeiro 2026
