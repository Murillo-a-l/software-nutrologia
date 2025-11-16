# NutroLab Frontend

Frontend do Sistema de Nutrologia desenvolvido com React, TypeScript, Vite e Tailwind CSS.

## 🚀 Tecnologias

- **React** 18+
- **TypeScript**
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **React Router** - Navegação

## 📦 Instalação

```bash
# Instalar dependências
npm install
```

## 🏃 Executando

```bash
# Modo desenvolvimento (com hot reload)
npm run dev

# O frontend estará disponível em: http://localhost:5173
```

**IMPORTANTE**: O backend deve estar rodando em `http://localhost:3000` para que a aplicação funcione corretamente.

## 🏗️ Build para Produção

```bash
# Build
npm run build

# Preview do build
npm run preview
```

## 📁 Estrutura do Projeto

```
src/
├── api/           # Cliente da API e chamadas HTTP
├── components/    # Componentes reutilizáveis (Layout, etc)
├── pages/         # Páginas da aplicação
├── types/         # Definições de tipos TypeScript
├── utils/         # Utilitários (formatação de data, etc)
├── App.tsx        # Componente principal com rotas
├── main.tsx       # Entry point da aplicação
└── index.css      # Estilos globais (Tailwind)
```

## 🎨 Design System

### Cores

- **Primary**: `#0F172A` (Azul Petróleo Clínico)
- **Secondary**: `#38BDF8` (Azul claro para ações)
- **Background**: `#F9FAFB` (Branco gelo)
- **Card**: `#E5E7EB` (Cinza claro)

### Tipografia

- **Fonte**: Inter (Google Fonts)
- **Pesos**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)

## 📄 Páginas Disponíveis

### Login (`/`)
- Tela de login simples (autenticação fake por enquanto)
- Redireciona para `/dashboard` ao entrar

### Dashboard (`/dashboard`)
- Visão geral do sistema
- Estatísticas de pacientes
- Ações rápidas (cadastrar paciente, ver lista)
- Lista dos últimos pacientes cadastrados

### Pacientes

- **Lista** (`/patients`) - Lista completa de pacientes
- **Novo** (`/patients/new`) - Cadastro de novo paciente
- **Detalhe** (`/patients/:id`) - Informações do paciente e suas avaliações

### Avaliações

- **Nova** (`/patients/:id/assessments/new`) - Criar avaliação com cálculo automático
- **Detalhe** (`/assessments/:id`) - Visualizar avaliação completa com métricas

## 🔌 Integração com Backend

O frontend consome a API REST do backend através do arquivo `src/api/client.ts`.

### Endpoints utilizados:

- `GET /patients` - Listar pacientes
- `GET /patients/:id` - Buscar paciente
- `POST /patients` - Criar paciente
- `POST /patients/:id/assessments` - Criar avaliação
- `GET /patients/:id/assessments` - Listar avaliações do paciente
- `GET /assessments/:id` - Buscar avaliação

### Formato de Datas

**IMPORTANTE**: O sistema utiliza o formato brasileiro para datas:

- **Interface**: DD/MM/YYYY (exemplo: 21/03/1995)
- O backend converte automaticamente para ISO antes de processar

## 🎯 Funcionalidades

### Cadastro de Pacientes
- Nome, sexo, data de nascimento, altura
- Validação de campos obrigatórios
- Validação de formato de data brasileira

### Criação de Avaliações
- Dados básicos: peso, % gordura, circunferências
- Nível de atividade física
- Dados de bioimpedância (opcional)
- **Cálculo automático** de todas as métricas ao salvar

### Visualização de Métricas
- IMC e categoria
- TDEE (gasto energético total)
- Composição corporal
- Riscos cardiometabólicos
- Idade metabólica
- Body Composition Score
- E muito mais!
