@echo off
REM Script de Automação - Dashboard CRM (Windows)
REM Atualiza o dashboard automaticamente

echo ============================================================
echo Atualizador do Dashboard CRM
echo ============================================================
echo.

REM Configurações - AJUSTE ESTES CAMINHOS
set BOURBON_FILE=C:\Users\Usuario\Downloads\Bourbon-ControledoInvestimento.xlsx
set CX_FILE=C:\Users\Usuario\Downloads\CX-Curadoria.xlsx
set REPO_DIR=C:\Users\Usuario\dashboard-crm

REM Verificar se os arquivos existem
if not exist "%BOURBON_FILE%" (
    echo ERRO: Arquivo Bourbon nao encontrado: %BOURBON_FILE%
    pause
    exit /b 1
)

if not exist "%CX_FILE%" (
    echo ERRO: Arquivo CX nao encontrado: %CX_FILE%
    pause
    exit /b 1
)

REM Ir para o diretório do repositório
cd /d "%REPO_DIR%"

REM Executar o script Python
echo Executando atualizacao...
python update_dashboard.py --bourbon "%BOURBON_FILE%" --cx "%CX_FILE%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================================
    echo Atualizacao concluida com sucesso!
    echo Dashboard disponivel em:
    echo https://marcoscoelhot4c.github.io/dashboard-crm/
    echo ============================================================
) else (
    echo.
    echo ============================================================
    echo ERRO: Falha na atualizacao. Verifique os erros acima.
    echo ============================================================
)

echo.
pause
