# ⏳ Kairos Timesheet

Sistema abrangente de rastreamento de tempo e gestão de contratos, projetado para oferecer visibilidade total sobre produtividade e alocação de recursos.

## 🚀 Tecnologias

### Frontend
- **React 19**: Biblioteca principal para interfaces dinâmicas.
- **Vite**: Build tool ultrarrápida para desenvolvimento moderno.
- **TypeScript**: Tipagem estática para maior robustez.
- **Tailwind CSS**: Estilização moderna e responsiva.
- **Recharts**: Visualização de dados e dashboards analíticos.
- **React Router 7**: Roteamento e navegação fluida.

### Backend & Infraestrutura
- **PHP**: API robusta e escalável para processamento de regras de negócio.
- **MySQL**: Banco de dados relacional para persistência segura.
- **Terraform**: Infraestrutura como código (IaC) para deploy reproduzível.

## 🏗️ Estrutura do Projeto

```text
kairostimesheet/
├── api/             # Backend em PHP (Auth, Projetos, Contratos, Stats)
├── components/      # Componentes UI (TimeTracker, Dashboard, Reports)
├── context/         # Estados globais (Autenticação)
├── database/        # Scripts SQL de inicialização
├── services/        # Clientes de API e lógica de comunicação
├── terraform/       # Definições de infraestrutura na nuvem
├── types.ts         # Definições globais de tipos TypeScript
└── vite.config.ts   # Configurações de build do Vite
```

## ✨ Funcionalidades

- **⏱️ Time Tracking**: Registro preciso de horas trabalhadas em projetos específicos.
- **📊 Dashboards**: Visualização em tempo real de estatísticas e métricas de desempenho.
- **📜 Gestão de Contratos**: Controle detalhado de contratos com clientes e prazos.
- **📂 Relatórios**: Geração de relatórios detalhados para análise de produtividade.
- **🛡️ Logs de Auditoria**: Rastreabilidade total de alterações no sistema.
- **🔐 Autenticação**: Sistema seguro de login e gestão de permissões.
- **🔗 Integração LK OS (SSO)**: Login automático quando aberto dentro do ecossistema LK OS via `postMessage`.


## 🛠️ Rodando Localmente

### Pré-requisitos
- Node.js (v18 ou superior)
- Servidor Web com PHP (ex: Apache/Nginx + PHP 8.1+)
- MySQL

### Configuração do Frontend

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure o endpoint da API no arquivo apropriado (ex: `services/api.ts`).
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

### Configuração do Backend (API)

1. Aponte seu servidor web para a pasta `api/`.
2. Configure as credenciais do banco de dados em `api/config.php`.
3. Execute os scripts em `database/` para configurar as tabelas.

---
Desenvolvido por [Raphael](https://github.com/raphavini)

