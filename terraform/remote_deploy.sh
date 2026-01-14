#!/bin/bash
# Este script deve ser colocado no servidor Hostgator em:
# ~/ligadokodigo.com.br/deploy/deploy.sh
set -e

TIMESTAMP=$(date +%Y%m%d%H%M%S)
APP_DIR=~/ligadokodigo.com.br/timesheet
DEPLOY_DIR=~/ligadokodigo.com.br/deploy/timesheet
BACKUP_DIR=~/ligadokodigo.com.br

echo "--- Iniciando script de deploy remoto ---"

# 1. Comprimir o conteúdo atual
if [ -d "APP_DIR" ]; then
    echo "📦 Backup: Comprimindo APP_DIR para timesheet_$TIMESTAMP.zip..."
    cd $BACKUP_DIR
    zip -r "timesheet_$TIMESTAMP.zip" "timesheet" -x "timesheet_$TIMESTAMP.zip"
else
    echo "⚠️ Aviso: Diretório $APP_DIR não encontrado para backup."
fi

# 2. Remover conteúdo atual
echo "🗑️ Removendo conteúdo de APP_DIR/*..."
# Usamos -f para não falhar se estiver vazio, e garantimos que o diretório exista
mkdir -p "$APP_DIR"
rm -rf "$APP_DIR"/*

# 3. Mover conteúdo enviado
if [ -d "$DEPLOY_DIR" ] && [ "$(ls -A $DEPLOY_DIR)" ]; then
    echo "🚚 Movendo conteúdo de $DEPLOY_DIR para $BLOG_DIR..."
    mv "$DEPLOY_DIR"/* "$APP_DIR"/
else
    echo "❌ Erro: Conteúdo de deploy não encontrado em $DEPLOY_DIR"
    exit 1
fi

echo "✅ Deploy concluído com sucesso em $(date)"
echo "--- Fim do deploy ---"