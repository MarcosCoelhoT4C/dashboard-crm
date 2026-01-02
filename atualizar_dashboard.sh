#!/bin/bash
# Script de Automação - Dashboard CRM (Linux/Mac)
# Atualiza o dashboard automaticamente

echo "============================================================"
echo "Atualizador do Dashboard CRM"
echo "============================================================"
echo ""

# Configurações - AJUSTE ESTES CAMINHOS
BOURBON_FILE="$HOME/Downloads/Bourbon-ControledoInvestimento.xlsx"
CX_FILE="$HOME/Downloads/CX-Curadoria.xlsx"
REPO_DIR="$HOME/dashboard-crm"

# Verificar se os arquivos existem
if [ ! -f "$BOURBON_FILE" ]; then
    echo "❌ ERRO: Arquivo Bourbon não encontrado: $BOURBON_FILE"
    exit 1
fi

if [ ! -f "$CX_FILE" ]; then
    echo "❌ ERRO: Arquivo CX não encontrado: $CX_FILE"
    exit 1
fi

# Ir para o diretório do repositório
cd "$REPO_DIR" || exit 1

# Executar o script Python
echo "🔄 Executando atualização..."
python3 update_dashboard.py --bourbon "$BOURBON_FILE" --cx "$CX_FILE"

if [ $? -eq 0 ]; then
    echo ""
    echo "============================================================"
    echo "✅ Atualização concluída com sucesso!"
    echo "📊 Dashboard disponível em:"
    echo "https://marcoscoelhot4c.github.io/dashboard-crm/"
    echo "============================================================"
else
    echo ""
    echo "============================================================"
    echo "❌ ERRO: Falha na atualização. Verifique os erros acima."
    echo "============================================================"
    exit 1
fi
