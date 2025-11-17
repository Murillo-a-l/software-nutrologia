# Software de Nutrologia - Backend

Sistema completo de análise nutricional e composição corporal desenvolvido em TypeScript/Node.js com Express e Prisma.

## 🚀 Tecnologias

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **TypeScript**: v5.9+ (strict mode)
- **ORM**: Prisma
- **Database**: SQLite (desenvolvimento)

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Criar banco de dados e executar migrations
npx prisma migrate dev --name init

# Ou usar db push (mais rápido para desenvolvimento)
npx prisma db push
```

## 🏃 Executando o Servidor

```bash
# Modo desenvolvimento
npm run dev

# Ou diretamente com tsx
npx tsx src/index.ts
```

O servidor estará disponível em `http://localhost:3000`

## 📚 API Endpoints

### Health Check
- `GET /health` - Verifica status do servidor

### Cálculos (sem persistência)
- `POST /calculate` - Calcula métricas nutricionais sem salvar no banco

### Pacientes
- `POST /patients` - Criar novo paciente
- `GET /patients` - Listar todos os pacientes
- `GET /patients/:id` - Buscar paciente por ID

### Avaliações
- `POST /patients/:id/assessments` - Criar nova avaliação para um paciente
- `GET /patients/:id/assessments` - Listar avaliações de um paciente
- `GET /assessments/:id` - Buscar avaliação específica com métricas

## 📝 Formato de Datas

**IMPORTANTE**: O sistema utiliza o formato brasileiro para datas:

- **Frontend/API**: `DD/MM/YYYY` (exemplo: `21/03/1995`)
- **Backend (interno)**: Conversão automática para ISO `YYYY-MM-DD`

## 🧪 Exemplos de Uso

### Criar Paciente

```bash
curl -X POST http://localhost:3000/patients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "sex": "M",
    "birthDate": "21/03/1995",
    "heightM": 1.75
  }'
```

### Criar Avaliação

```bash
curl -X POST http://localhost:3000/patients/{patientId}/assessments \
  -H "Content-Type: application/json" \
  -d '{
    "dateTime": "16/11/2024",
    "weightKg": 80,
    "waistCm": 90,
    "hipCm": 100,
    "bfPercent": 20,
    "ffmKg": 64,
    "skeletalMuscleKg": 35,
    "activityLevel": "MODERADO"
  }'
```

## 🗄️ Estrutura do Banco de Dados

### Patient
- id, name, sex, birthDate, heightM
- Relacionamento: 1:N com Assessment

### Assessment
- id, patientId, dateTime, weightKg, bfPercent, waistCm, hipCm, etc.
- Relacionamento: N:1 com Patient, 1:1 com Metrics

### Metrics
- id, assessmentId
- Todas as métricas calculadas (BMI, TDEE, scores, etc.)
- Relacionamento: 1:1 com Assessment

## 📊 Métricas Calculadas

O sistema calcula automaticamente:

1. **Antropometria**: BMI, RCA, RCQ
2. **Composição Corporal**: Massa gorda, massa magra, SMI, FFMI, FMI
3. **Metabolismo**: BMR (Mifflin e Cunningham), TDEE
4. **Riscos**: Score cardiometabólico, RED-S
5. **Avançados**: Idade metabólica, body comp score, ECW/TBW

## 🛠️ Desenvolvimento

### Prisma Commands

```bash
# Gerar client após mudanças no schema
npx prisma generate

# Criar nova migration
npx prisma migrate dev --name <nome>

# Resetar banco (CUIDADO: apaga dados)
npx prisma migrate reset

# Visualizar banco de dados
npx prisma studio
```

### Estrutura de Diretórios

```
src/
├── calc/              # Motor de cálculos
├── domain/            # Tipos e interfaces
├── http/              # Servidor Express e rotas
├── services/          # Camada de serviço (Prisma)
└── index.ts           # Entry point

prisma/
├── schema.prisma      # Schema do banco
└── dev.db             # Banco SQLite (gitignored)
```

## 📄 Licença

ISC
