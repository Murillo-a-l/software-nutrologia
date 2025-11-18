import type { Patient } from '../../types';
import { calculateAge } from '../../utils/date';
import type { AssessmentStepProps } from './types';

interface AssessmentStepRisksProps extends AssessmentStepProps {
  patient?: Patient | null;
}

const activityFactors: Record<string, number> = {
  SEDENTARIO: 1.2,
  LEVE: 1.35,
  MODERADO: 1.5,
  INTENSO: 1.7,
  ATLETA: 1.9,
};

export function AssessmentStepRisks({ formData, patient }: AssessmentStepRisksProps) {
  const weight = parseNumber(formData.weightKg);
  const height = parseNumber(formData.heightM);
  const bfPercent = parseNumber(formData.bfPercent);
  const skeletal = parseNumber(formData.skeletalMuscleKg);
  const ffm = parseNumber(formData.ffmKg);
  const age = patient ? calculateAge(patient.birthDate) : undefined;

  const fatMass = weight && bfPercent !== undefined ? (weight * bfPercent) / 100 : undefined;
  const leanMass = ffm ?? (weight && fatMass !== undefined ? weight - fatMass : undefined);
  const smi = skeletal && height ? skeletal / (height * height) : undefined;
  const ffmi = leanMass && height ? leanMass / (height * height) : undefined;
  const fmi = fatMass && height ? fatMass / (height * height) : undefined;
  const bmi = weight && height ? weight / (height * height) : undefined;

  const heightCm = height ? height * 100 : undefined;
  const mifflin =
    weight && heightCm && age !== undefined
      ? 10 * weight + 6.25 * heightCm - 5 * age + (patient?.sex === 'M' ? 5 : -161)
      : undefined;
  const cunningham = leanMass ? 500 + 22 * leanMass : undefined;
  const tdee = mifflin ? mifflin * (activityFactors[formData.activityLevel] ?? 1.4) : undefined;

  const riskBlocks = [
    { title: 'IMC', value: bmi ? bmi.toFixed(1) : '—', helper: getBmiLabel(bmi), accent: '#a9e9ff' },
    { title: 'SMI', value: smi ? smi.toFixed(1) : '—', helper: 'Índice muscular', accent: '#35d0a0' },
    { title: 'FFMI', value: ffmi ? ffmi.toFixed(1) : '—', helper: 'Força relativa', accent: '#12354a' },
    { title: 'FMI', value: fmi ? fmi.toFixed(1) : '—', helper: 'Massa gorda / altura²', accent: '#fb923c' },
    { title: 'BMR Mifflin', value: mifflin ? `${Math.round(mifflin)} kcal` : '—', helper: 'Taxa basal', accent: '#0c2332' },
    { title: 'BMR Cunningham', value: cunningham ? `${Math.round(cunningham)} kcal` : '—', helper: 'Baseado em FFM', accent: '#35d0a0' },
    { title: 'TDEE estimado', value: tdee ? `${Math.round(tdee)} kcal` : '—', helper: translateActivity(formData.activityLevel), accent: '#a9e9ff' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#0c2332]">Riscos e métricas automáticas</h2>
        <p className="text-sm text-[#4f5a63]">Os indicadores abaixo são derivados instantaneamente dos dados preenchidos.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {riskBlocks.map((block) => (
          <div key={block.title} className="rounded-2xl border border-[#e2e0db] bg-white/80 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[#7a838b]">{block.title}</p>
            <p className="mt-2 text-2xl font-semibold text-[#0c2332]">{block.value}</p>
            <p className="text-xs text-[#7a838b]">{block.helper}</p>
            <div className="mt-3 h-1.5 w-full rounded-full bg-[#f0ede8]">
              <div className="h-full rounded-full" style={{ width: block.value === '—' ? '0%' : '90%', backgroundColor: block.accent }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function parseNumber(value: string) {
  if (!value) return undefined;
  const parsed = parseFloat(value);
  if (Number.isNaN(parsed)) return undefined;
  return parsed;
}

function getBmiLabel(bmi?: number) {
  if (!bmi) return '—';
  if (bmi < 18.5) return 'Magreza';
  if (bmi < 25) return 'Adequado';
  if (bmi < 30) return 'Sobrepeso';
  if (bmi < 35) return 'Obesidade I';
  if (bmi < 40) return 'Obesidade II';
  return 'Obesidade III';
}

function translateActivity(value: string) {
  switch (value) {
    case 'SEDENTARIO':
      return 'Sedentário';
    case 'LEVE':
      return 'Leve';
    case 'MODERADO':
      return 'Moderado';
    case 'INTENSO':
      return 'Intenso';
    case 'ATLETA':
      return 'Atleta';
    default:
      return value;
  }
}
