import type { ReactNode } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Patient } from '../../types';
import { calculateAge } from '../../utils/date';
import type { AssessmentWizardFormData } from './types';

interface AssessmentPreviewPanelProps {
  patient?: Patient | null;
  formData: AssessmentWizardFormData;
}

const MAX_BMI = 40;
const MAX_BF = 50;
const MAX_LEAN_MASS = 90;

export function AssessmentPreviewPanel({ patient, formData }: AssessmentPreviewPanelProps) {
  const weight = parseNumber(formData.weightKg);
  const height = parseNumber(formData.heightM) ?? patient?.heightM ?? undefined;
  const bfPercent = parseNumber(formData.bfPercent);
  const ffm = parseNumber(formData.ffmKg);
  const age = patient?.birthDate ? calculateAge(patient.birthDate) : undefined;

  const bmi = weight && height ? weight / Math.pow(height, 2) : undefined;
  const fatMass = weight && bfPercent !== undefined ? (weight * bfPercent) / 100 : undefined;
  const leanMass = weight && fatMass !== undefined ? weight - fatMass : ffm;

  const idealBfPercent = patient?.sex === 'M' ? 15 : patient?.sex === 'F' ? 23 : 20;
  const idealWeight = height ? 22 * Math.pow(height, 2) : undefined;
  const idealFatMass = idealWeight ? (idealWeight * idealBfPercent) / 100 : undefined;
  const idealLeanMass = idealWeight && idealFatMass !== undefined ? idealWeight - idealFatMass : undefined;

  const chartData = [
    { label: 'Peso', atual: weight, ideal: idealWeight },
    { label: 'Massa gorda', atual: fatMass, ideal: idealFatMass },
    { label: 'Massa magra', atual: leanMass, ideal: idealLeanMass },
  ].filter((item) => item.atual !== undefined || item.ideal !== undefined);

  const rca = computeRatio(formData.waistCm, height ? height * 100 : undefined);
  const rcq = computeRatio(formData.waistCm, parseNumber(formData.hipCm));
  const tdee = computeTdee(weight, height, age, formData.activityLevel, patient?.sex);

  const progressItems = [
    { label: 'IMC', value: bmi, unit: '', helper: getBmiCategory(bmi), color: '#12354a', max: MAX_BMI },
    { label: '% Gordura', value: bfPercent, unit: '%', helper: 'Atual', color: '#fb923c', max: MAX_BF },
    { label: 'Massa magra', value: leanMass, unit: ' kg', helper: 'Estimado', color: '#35d0a0', max: MAX_LEAN_MASS },
  ];

  return (
    <div className="sticky top-24 space-y-4 rounded-3xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-[#0c2332]">Preview da Avaliação Física</h3>
        <p className="text-xs text-[#7a838b]">Atualiza em tempo real conforme você preenche o wizard.</p>
      </div>

      <div className="space-y-4">
        <Card title="Dados pessoais">
          <InfoRow label="Paciente" value={patient?.name ?? '—'} />
          <InfoRow label="Idade" value={age ? `${age} anos` : '—'} />
          <InfoRow label="Sexo" value={patient ? translateSex(patient.sex) : '—'} />
          <InfoRow label="Altura" value={height ? `${height.toFixed(2)} m` : '—'} />
          <InfoRow label="Peso" value={weight ? `${weight.toFixed(1)} kg` : '—'} />
          <div className="mt-3 border-t border-[#f0ede8] pt-3">
            <p className="text-xs text-[#7a838b]">IMC estimado</p>
            <div className="flex items-center justify-between">
              <p className="text-xl font-semibold text-[#0c2332]">{bmi ? bmi.toFixed(1) : '—'}</p>
              <span className="rounded-full bg-[#a9e9ff]/50 px-3 py-1 text-xs font-semibold text-[#0c2332]">{getBmiCategory(bmi)}</span>
            </div>
          </div>
        </Card>

        <Card title="Indicadores principais">
          <div className="space-y-4">
            {progressItems.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#7a838b]">{item.label}</span>
                  <span className="font-semibold text-[#0c2332]">
                    {item.value !== undefined && !Number.isNaN(item.value) ? `${item.value.toFixed(1)}${item.unit}` : '—'}
                  </span>
                </div>
                <ProgressBar value={item.value} max={item.max} color={item.color} />
                <p className="text-xs text-[#a0a6ad]">{item.helper}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Riscos rápidos">
          <div className="grid grid-cols-3 gap-3 text-center text-sm text-[#0c2332]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#7a838b]">RCA</p>
              <p className="text-lg font-semibold">{rca ?? '—'}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#7a838b]">RCQ</p>
              <p className="text-lg font-semibold">{rcq ?? '—'}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#7a838b]">TDEE</p>
              <p className="text-lg font-semibold">{tdee ? `${tdee} kcal` : '—'}</p>
            </div>
          </div>
        </Card>

        <Card title="Análise corporal">
          <div className="h-64">
            {chartData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e0db" />
                  <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: '#e2e0db' }} tick={{ fill: '#7a838b', fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={{ stroke: '#e2e0db' }} tick={{ fill: '#7a838b', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: 'rgba(53, 208, 160, 0.12)' }} />
                  <Legend />
                  <Bar dataKey="atual" name="Atual" fill="#0c2332" radius={[6, 6, 0, 0]} barSize={24} />
                  <Bar dataKey="ideal" name="Ideal" fill="#35d0a0" radius={[6, 6, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-center text-xs text-[#7a838b]">
                Preencha peso, altura ou % gordura para visualizar o gráfico.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#e2e0db] bg-white/80 p-4 space-y-3">
      <p className="text-sm font-semibold text-[#0c2332]">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[#7a838b]">{label}</span>
      <span className="font-semibold text-[#0c2332]">{value}</span>
    </div>
  );
}

function ProgressBar({ value, max, color }: { value?: number; max: number; color: string }) {
  const width = value !== undefined && max ? `${Math.min((value / max) * 100, 100)}%` : '0%';
  return (
    <div className="h-2 rounded-full bg-[#f0ede8]">
      <div className="h-full rounded-full" style={{ width, backgroundColor: color }} />
    </div>
  );
}

function parseNumber(value?: string) {
  if (!value) return undefined;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return undefined;
  return parsed;
}

function getBmiCategory(bmi?: number) {
  if (!bmi) return '—';
  if (bmi < 18.5) return 'Magreza';
  if (bmi < 25) return 'Adequado';
  if (bmi < 30) return 'Sobrepeso';
  if (bmi < 35) return 'Obesidade I';
  if (bmi < 40) return 'Obesidade II';
  return 'Obesidade III';
}

function translateSex(sex: Patient['sex']) {
  if (sex === 'M') return 'Masculino';
  if (sex === 'F') return 'Feminino';
  return 'Outro';
}

function computeRatio(numerator: string, denominator?: number) {
  const top = parseNumber(numerator);
  if (!top || !denominator) return null;
  return (top / denominator).toFixed(2);
}

function computeTdee(weight?: number, height?: number, age?: number, activityLevel?: string, sex?: Patient['sex']) {
  if (!weight || !height || age === undefined) return null;
  const heightCm = height * 100;
  const mifflin = 10 * weight + 6.25 * heightCm - 5 * age + (sex === 'M' ? 5 : -161);
  const factor = activityFactors[activityLevel ?? 'MODERADO'];
  return Math.round(mifflin * factor);
}

const activityFactors: Record<string, number> = {
  SEDENTARIO: 1.2,
  LEVE: 1.35,
  MODERADO: 1.5,
  INTENSO: 1.7,
  ATLETA: 1.9,
};
