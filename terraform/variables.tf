variable "ftp_host" {
  description = "Endereço do servidor FTP da Hostgator"
  type        = string
  sensitive   = true
}

variable "ftp_port" {
  description = "Porta do servidor FTP (geralmente 21)"
  type        = number
  default     = 21
}

variable "ftp_username" {
  description = "Nome de usuário FTP"
  type        = string
  sensitive   = true
}

variable "ftp_password" {
  description = "Senha do FTP"
  type        = string
  sensitive   = true
}

variable "local_files_path" {
  description = "Caminho local dos arquivos do frontend a serem enviados (dist após build)"
  type        = string
  default     = "../dist"
}

variable "app_root" {
  description = "Caminho raiz do aplicativo frontend (onde o package.json está)"
  type        = string
  default     = "../"
}

variable "local_backend_path" {
  description = "Caminho local dos arquivos do backend (API em PHP)"
  type        = string
  default     = "../api"
}

variable "remote_path_frontend" {
  description = "Caminho remoto no servidor FTP para o frontend"
  type        = string
  default     = "/kairosheet"
}

variable "remote_path_backend" {
  description = "Caminho remoto no servidor FTP para o backend (API)"
  type        = string
  default     = "/kairosheet_api"
}

# Mantido para compatibilidade (não usado mais)
variable "remote_path" {
  description = "[DEPRECATED] Caminho remoto no servidor FTP (ex: /public_html)"
  type        = string
  default     = "/kairosheet"
}

variable "ssh_host" {
  description = "Endereço do servidor SSH"
  type        = string
  default     = "50.116.86.19"
}

variable "ssh_port" {
  description = "Porta do servidor SSH"
  type        = number
  default     = 2222
}

variable "ssh_user" {
  description = "Usuário SSH"
  type        = string
  default     = "raph7664"
}

variable "ssh_key_path" {
  description = "Caminho para a chave privada SSH"
  type        = string
  default     = "~/.ssh/hostgator_terraform"
}
