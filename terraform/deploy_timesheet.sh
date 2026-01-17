[200~#!/bin/bash
echo "INICIANDO"
set -e

TIMESTAMP=$(date +%Y%m%d%H%M%S)
APP_DIR=~/ligadokodigo.com.br/lk_apps_dev/timesheet
DEPLOY_DIR=~/ligadokodigo.com.br/deploy/timesheet
BACKUP_DIR=~/ligadokodigo.com.br
CUSTOM_CONFIG=~/ligadokodigo.com.br/deploy/timesheet_api_config.php

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

 echo "⚙️ Aplicando configuração de produção em kairos/api/config.php   ..."
 cp "$CUSTOM_CONFIG" "$APP_DIR/kairos/api/config.php"
else
 echo "❌ Erro: Conteúdo de deploy não encontrado em $DEPLOY_DIR"
 exit 1
fi

echo "✅ Deploy concluído com sucesso em $(date)"
echo "--- Fim do deploy ---"