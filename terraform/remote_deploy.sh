#!/bin/bash
# Este script deve ser colocado no servidor Hostgator em:
# ~/ligadokodigo.com.br/deploy/deploy.sh
set -e

TIMESTAMP=$(date +%Y%m%d%H%M%S)
BLOG_DIR=~/ideia2all.com.br/blog
DEPLOY_DIR=~/ligadokodigo.com.br/deploy/ideia2all
BACKUP_DIR=~/ideia2all.com.br

echo "--- Iniciando script de deploy remoto ---"

# 1. Comprimir o conteúdo atual
if [ -d "$BLOG_DIR" ]; then
    echo "📦 Backup: Comprimindo $BLOG_DIR para blog_$TIMESTAMP.zip..."
    cd $BACKUP_DIR
    zip -r "blog_$TIMESTAMP.zip" "blog" -x "blog_$TIMESTAMP.zip"
else
    echo "⚠️ Aviso: Diretório $BLOG_DIR não encontrado para backup."
fi

# 2. Remover conteúdo atual
echo "🗑️ Removendo conteúdo de $BLOG_DIR/*..."
# Usamos -f para não falhar se estiver vazio, e garantimos que o diretório exista
mkdir -p "$BLOG_DIR"
rm -rf "$BLOG_DIR"/*

# 3. Mover conteúdo enviado
if [ -d "$DEPLOY_DIR" ] && [ "$(ls -A $DEPLOY_DIR)" ]; then
    echo "🚚 Movendo conteúdo de $DEPLOY_DIR para $BLOG_DIR..."
    mv "$DEPLOY_DIR"/* "$BLOG_DIR"/
else
    echo "❌ Erro: Conteúdo de deploy não encontrado em $DEPLOY_DIR"
    exit 1
fi

echo "✅ Deploy concluído com sucesso em $(date)"
echo "--- Fim do deploy ---"
