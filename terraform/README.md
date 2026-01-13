# Deploy FTP para Hostgator com Terraform - Aplicação Timesheet

Este diretório contém a configuração Terraform para fazer deploy da aplicação Timesheet (frontend + backend PHP) via FTP para hospedagem Hostgator usando `lftp` no WSL/Linux.

## 📋 Pré-requisitos

1. **Terraform instalado** (versão 1.0 ou superior)
   - No WSL: `sudo apt-get install terraform` ou baixe em https://www.terraform.io/downloads
   - Verifique a instalação: `terraform version`

2. **WSL (Windows Subsystem for Linux)** ou ambiente Linux

3. **lftp** (será instalado automaticamente se necessário)
   - Instalação manual: `sudo apt-get install lftp`

4. **Credenciais FTP da Hostgator**
   - Host FTP (ex: `ftp.seudominio.com.br`)
   - Usuário FTP
   - Senha FTP
   - Caminho remoto para frontend (ex: `/kairosheet`)
   - Caminho remoto para backend (ex: `/kairosheet_api`)

## 🔧 Como Funciona

Esta configuração usa o **provider null do Terraform** combinado com **lftp** (ferramenta FTP avançada para Linux) para fazer upload de arquivos via FTP. O processo inclui:

1. **Instalação de dependências** do frontend (npm install)
2. **Build do frontend** (npm run build) - sem prerender
3. **Upload do frontend** para `/kairosheet`
4. **Upload do backend (API PHP)** para `/kairosheet_api`
5. **Comandos SSH pós-deploy** (se necessário)

## 🏗️ Estrutura da Aplicação

```
kairostimesheet/
├── terraform/           # Configuração Terraform (esta pasta)
├── api/                 # Backend PHP (enviado para /kairosheet_api)
├── dist/                # Frontend buildado (enviado para /kairosheet)
├── components/          # Componentes React
├── package.json         # Dependências do frontend
└── ...                  # Outros arquivos do frontend
```

## 🚀 Como Usar

### 1. Configurar Credenciais

Copie o arquivo de exemplo e preencha com suas credenciais:

```powershell
Copy-Item terraform.tfvars.example terraform.tfvars
```

Edite o arquivo `terraform.tfvars` com suas credenciais reais:

```hcl
ftp_host     = "ftp.seudominio.com.br"
ftp_username = "seu_usuario@seudominio.com.br"
ftp_password = "sua_senha_segura"

# Caminhos remotos
remote_path_frontend = "/kairosheet"
remote_path_backend  = "/kairosheet_api"
```

> ⚠️ **IMPORTANTE**: O arquivo `terraform.tfvars` contém informações sensíveis e está no `.gitignore`. Nunca faça commit deste arquivo!

### 2. Inicializar Terraform

```powershell
cd terraform
terraform init
```

Este comando irá:
- Baixar os providers necessários
- Preparar o ambiente Terraform

### 3. Visualizar Mudanças (Plan)

Antes de fazer o deploy, visualize o que será executado:

```powershell
terraform plan
```

### 4. Fazer Deploy (Apply)

Execute o deploy completo (build + upload):

```powershell
terraform apply
```

Digite `yes` quando solicitado para confirmar.

O processo irá:
1. ✅ Instalar dependências do frontend
2. ✅ Fazer build do frontend
3. ✅ Fazer upload do frontend para `/kairosheet`
4. ✅ Fazer upload do backend para `/kairosheet_api`
5. ✅ Executar comandos SSH pós-deploy

### 5. Remover Arquivos (Destroy)

Para remover os arquivos do servidor:

```powershell
terraform destroy
```

## 📁 Estrutura de Arquivos

```
terraform/
├── main.tf                    # Configuração principal
├── variables.tf               # Definição de variáveis
├── terraform.tfvars.example   # Exemplo de variáveis
├── terraform.tfvars          # Suas credenciais (não commitado)
├── ftp_upload.sh             # Script de upload FTP
├── ssh_deploy.sh             # Script SSH pós-deploy
├── .gitignore                # Arquivos ignorados pelo Git
└── README.md                 # Esta documentação
```

## ⚙️ Variáveis Disponíveis

| Variável | Descrição | Padrão | Obrigatório |
|----------|-----------|--------|-------------|
| `ftp_host` | Endereço do servidor FTP | - | ✅ |
| `ftp_port` | Porta FTP | 21 | ❌ |
| `ftp_username` | Usuário FTP | - | ✅ |
| `ftp_password` | Senha FTP | - | ✅ |
| `local_files_path` | Caminho local do frontend buildado | `../dist` | ❌ |
| `local_backend_path` | Caminho local do backend (API) | `../api` | ❌ |
| `app_root` | Raiz do aplicativo frontend | `../` | ❌ |
| `remote_path_frontend` | Caminho remoto para frontend | `/kairosheet` | ❌ |
| `remote_path_backend` | Caminho remoto para backend | `/kairosheet_api` | ❌ |
| `ssh_host` | Endereço do servidor SSH | `50.116.86.19` | ❌ |
| `ssh_port` | Porta SSH | `2222` | ❌ |
| `ssh_user` | Usuário SSH | - | ❌ |
| `ssh_key_path` | Caminho da chave SSH | `~/.ssh/hostgator_terraform` | ❌ |

## 🔧 Personalização

### Alterar destino do frontend

Edite `remote_path_frontend` no `terraform.tfvars`:

```hcl
remote_path_frontend = "/public_html/timesheet"
```

### Alterar destino do backend

Edite `remote_path_backend` no `terraform.tfvars`:

```hcl
remote_path_backend = "/public_html/timesheet_api"
```

### Alterar pasta do backend local

Edite `local_backend_path` no `terraform.tfvars`:

```hcl
local_backend_path = "../backend"  # Se a pasta API tiver outro nome
```

## 📝 Notas Importantes

1. **Segurança**: Nunca compartilhe o arquivo `terraform.tfvars` com suas credenciais
2. **Backup**: Faça backup dos arquivos antes de fazer deploy
3. **Teste**: Use `terraform plan` antes de `terraform apply`
4. **Hostgator**: Verifique se o FTP está habilitado no painel de controle
5. **Frontend**: O build do frontend não inclui prerender (diferente da aplicação anterior)
6. **Backend**: O backend é em PHP e está na pasta `api`
7. **Estrutura**: A pasta terraform está DENTRO do projeto (não fora como na aplicação anterior)

## 🐛 Troubleshooting

### Erro de conexão FTP

- Verifique se o host FTP está correto
- Confirme que o usuário e senha estão corretos
- Verifique se a porta 21 não está bloqueada no firewall

### Provider não encontrado

Execute novamente:
```powershell
terraform init -upgrade
```

### Arquivos não aparecem no servidor

- Verifique o `remote_path_frontend` e `remote_path_backend`
- Confirme que tem permissões de escrita nos diretórios remotos
- Verifique se as pastas `/kairosheet` e `/kairosheet_api` existem no servidor

### Erro no build do frontend

- Verifique se o `package.json` está na raiz do projeto
- Execute `npm install` manualmente para verificar dependências
- Verifique se o comando `npm run build` funciona localmente

### Backend não foi enviado

- Verifique se a pasta `api` existe
- Confirme o caminho em `local_backend_path`
- Verifique as permissões da pasta

## 📞 Suporte

Para problemas com:
- **Terraform**: https://www.terraform.io/docs
- **Hostgator**: Contate o suporte da Hostgator
- **lftp**: https://lftp.yar.ru/
