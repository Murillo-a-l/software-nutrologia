# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Software de Nutrologia - A comprehensive nutrition and body composition analysis system written in TypeScript/Node.js. The system calculates various nutritional metrics, body composition indicators, and health risk assessments for patients.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js (v5.x)
- **TypeScript**: v5.9+ with strict mode enabled
- **Database**: Prisma ORM (planned/in setup)
- **Development**: ts-node-dev for hot-reloading

## Development Commands

### Running the Development Server
```bash
npm run dev
```
Starts the server at `http://localhost:3000` (or `$PORT` if set) with hot-reloading enabled.

### Building the Project
```bash
npx tsc
```
Compiles TypeScript to JavaScript in the `./dist` directory.

### TypeScript Configuration
The project uses strict TypeScript settings including:
- `strict: true`
- `noUncheckedIndexedAccess: true`
- `exactOptionalPropertyTypes: true`
- `verbatimModuleSyntax: true`
- `isolatedModules: true`

## Architecture

### Directory Structure

```
src/
├── index.ts                    # Application entry point
├── http/                       # HTTP layer (Express server, routes)
│   └── server.ts              # Server initialization and health endpoint
├── domain/                     # Domain models and type definitions
│   └── types.ts               # Core types: PatientBasic, AssessmentInput, CalculatedMetrics
└── calc/                       # Calculation engine for nutritional metrics
    └── calculateMetrics.ts    # Main calculation function (currently skeleton)
```

### Core Domain Types

**PatientBasic**: Patient demographics and physical attributes
- id, name, birthDate, sex, heightM

**AssessmentInput**: Assessment data collected during patient evaluation
- Body measurements: weightKg, waistCm, hipCm, neckCm
- Body composition: bfPercent, ffmKg, skeletalMuscleMassKg, tbwL, ecwL, icwL
- Bioimpedance: visceralFatIndex, phaseAngleDeg
- Activity: activityLevel, estimatedIntakeKcal, exerciseEnergyExpenditureKcal

**CalculatedMetrics**: Comprehensive nutritional and body composition metrics including:
- Anthropometric: BMI, waist-to-height ratio, waist-to-hip ratio
- Body composition: fat mass, lean mass, SMI (skeletal muscle index), FFMI, FMI
- Metabolic: BMR (Mifflin-St Jeor & Cunningham), TDEE, energy availability
- Health risks: cardiometabolic score/risk, RED-S score/risk
- Advanced: metabolic age, ECW/TBW ratio, body composition score

### Calculation Engine (`src/calc/calculateMetrics.ts`)

The `calculateMetrics()` function is the core of the system. It takes `AssessmentInput` and `PatientBasic` and returns all `CalculatedMetrics`. Currently returns undefined for all metrics - this is where calculation logic needs to be implemented.

Key metrics to implement (refer to `Documentos base do software/Calculos e estruturas.docx` for formulas):
- BMI and classification
- Basal Metabolic Rate (Mifflin-St Jeor and Cunningham formulas)
- Total Daily Energy Expenditure (TDEE)
- Energy Availability and RED-S screening
- Cardiometabolic risk assessment
- Body composition indices (SMI, FFMI, FMI)
- Hydration ratios (ECW/TBW)

## Important Project Documentation

Located in `Documentos base do software/` (in Portuguese):
- **VISÃO GERAL DO PRODUTO.docx**: Product vision and scope
- **Funcionalidades.docx**: Detailed feature requirements
- **Calculos e estruturas.docx**: Calculation formulas and data structures
- **Variáveis.docx**: Variable definitions and units
- **Paineis de acesso.docx**: Access panels and user interface structure

Design assets are in `Designe ilustrações/`.

## Development Workflow

1. **Adding New Calculations**: Implement formulas in `src/calc/calculateMetrics.ts`, replacing undefined returns with actual calculations. Reference the documentation in `Calculos e estruturas.docx`.

2. **Adding New Endpoints**: Add routes in `src/http/server.ts` following Express.js patterns.

3. **Type Safety**: Always define types in `src/domain/types.ts` first. The project enforces strict type checking.

4. **Domain Logic**: Keep business logic in `src/calc/` and domain types in `src/domain/`. HTTP layer should remain thin.

## Key Conventions

- Use Portuguese for domain terminology and documentation (this is a Brazilian project)
- Sex field uses "M" | "F" | "OUTRO" (not "OTHER")
- Activity levels: "SEDENTARIO" | "LEVE" | "MODERADO" | "INTENSO" | "ATLETA"
- All body measurements use metric units (kg, cm, L)
- Height is stored in meters (heightM)
- Optional fields use TypeScript's `?:` syntax
- Calculated metrics can be `number | string` to handle special cases or error states

## Future Considerations

- Database integration with Prisma is planned (migrations directory gitignored)
- Authentication/authorization will be needed (multiple user roles mentioned in documentation)
- Frontend integration (React with JSX configured in tsconfig.json)
