#!/bin/bash
SSH_HOST="50.116.86.19"
SSH_PORT="2222"
SSH_USER="raph7664"
SSH_KEY="~/.ssh/hostgator_terraform"

if [ -z "$SSH_HOST" ] || [ -z "$SSH_PORT" ] || [ -z "$SSH_USER" ] || [ -z "$SSH_KEY" ]; then
    echo "Erro: Parâmetros insuficientes para o script ssh_deploy.sh"
    exit 1
fi

echo "🔗 Conectando ao servidor via SSH (Porta $SSH_PORT) em $SSH_USER@$SSH_HOST..."

# Executa o script remoto
ssh -i "$SSH_KEY" -p "$SSH_PORT" -o StrictHostKeyChecking=no "$SSH_USER@$SSH_HOST" "bash ~/ligadokodigo.com.br/deploy/deploy_timesheet_prd.sh"
