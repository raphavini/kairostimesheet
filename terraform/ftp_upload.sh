#!/bin/bash
set -e

FTP_HOST="$1"
FTP_PORT="$2"
FTP_USER="$3"
FTP_PASS="$4"
LOCAL_PATH="$5"
REMOTE_PATH="$6"

# Verificar se lftp está instalado
if ! command -v lftp &> /dev/null; then
    echo "Instalando lftp..."
    sudo apt-get update -qq
    sudo apt-get install -y lftp
fi

echo "Iniciando upload FTP para $FTP_HOST..."
echo "Pasta local: $LOCAL_PATH"
echo "Pasta remota: $REMOTE_PATH"
echo ""

# Usar lftp para fazer mirror (upload) da pasta local para o servidor
lftp -u "$FTP_USER","$FTP_PASS" -p "$FTP_PORT" "$FTP_HOST" <<EOF
set ftp:ssl-allow no
set mirror:use-pget-n 5
mirror --reverse --verbose --delete --parallel=3 "$LOCAL_PATH" "$REMOTE_PATH"
bye
EOF

echo ""
echo "Upload concluído com sucesso!"
