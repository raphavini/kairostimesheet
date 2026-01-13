#!/bin/bash

# Script para limpar estado do Terraform e fazer deploy limpo

echo "🧹 Limpando estado do Terraform..."
rm -f terraform.tfstate*
rm -rf .terraform/

echo "🔧 Inicializando Terraform..."
terraform init

echo "🚀 Fazendo deploy..."
terraform apply -auto-approve

echo "✅ Deploy concluído!"
