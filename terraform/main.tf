terraform {
  required_providers {
    null = {
      source  = "hashicorp/null"
      version = "~> 3.0"
    }
  }
}

# Recurso para executar o build do app
# Recurso para instalar dependências (apenas se package.json mudar)
resource "null_resource" "install_dependencies" {
  triggers = {
    package_json = filemd5("${var.app_root}/package.json")
  }

  provisioner "local-exec" {
    working_dir = var.app_root
    command     = "echo '📦 Instalando dependências...' && npm install && echo '✅ Dependências instaladas!'"
  }
}

# Recurso para executar o build do app (sempre roda)
resource "null_resource" "build_app" {
  triggers = {
    always_run = timestamp()
  }

  depends_on = [null_resource.install_dependencies]

  provisioner "local-exec" {
    working_dir = var.app_root
    command     = "echo '🏗️ Iniciando build do frontend...' && npm run build && echo '✅ Build do frontend concluído!'"
  }
}

# Recurso para executar o upload FTP do frontend
resource "null_resource" "ftp_upload_frontend" {
  triggers = {
    # Usar timestamp para forçar execução sempre que apply for rodado
    build_complete = null_resource.build_app.id
    always_run     = timestamp()
  }

  depends_on = [null_resource.build_app]

  provisioner "local-exec" {
    working_dir = "${path.module}"
    command = "echo '🚀 Iniciando upload FTP do frontend...' && bash ftp_upload.sh '${var.ftp_host}' '${var.ftp_port}' '${var.ftp_username}' '${var.ftp_password}' '${var.local_files_path}' '${var.remote_path_frontend}' && echo '✅ Upload do frontend concluído!'"
  }
}

# Recurso para executar o upload FTP do backend (API)
resource "null_resource" "ftp_upload_backend" {
  triggers = {
    # Usar timestamp para forçar execução sempre que apply for rodado
    always_run = timestamp()
  }

  depends_on = [null_resource.ftp_upload_frontend]

  provisioner "local-exec" {
    working_dir = "${path.module}"
    command = "echo '🚀 Iniciando upload FTP do backend (API)...' && bash ftp_upload.sh '${var.ftp_host}' '${var.ftp_port}' '${var.ftp_username}' '${var.ftp_password}' '${var.local_backend_path}' '${var.remote_path_backend}' && echo '✅ Upload do backend concluído!'"
  }
}

# Recurso para executar comandos SSH pós-deploy
resource "null_resource" "ssh_post_deploy" {
  triggers = {
    # Rodar após o upload FTP do backend
    upload_complete = null_resource.ftp_upload_backend.id
    always_run      = timestamp()
  }

  depends_on = [null_resource.ftp_upload_backend]

  provisioner "local-exec" {
    working_dir = "${path.module}"
    command = "echo '🔑 Executando comandos SSH pós-deploy...' && bash ssh_deploy.sh '${var.ssh_host}' '${var.ssh_port}' '${var.ssh_user}' '${var.ssh_key_path}' && echo '✅ Comandos SSH concluídos!'"
  }
}
