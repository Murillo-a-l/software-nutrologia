import type { ReactNode } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
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

  const bmi = weight && height ? weight / Math.pow(height, 2) : undefined;
  const bmiCategory = bmi ? getBmiCategory(bmi) : '—';
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

  const progressItems = [
    {
      label: 'IMC',
      value: bmi,
      unit: '',
      helper: bmiCategory,
      color: 'bg-sky-600',
      max: MAX_BMI,
    },
    {
      label: '% Gordura',
      value: bfPercent,
      unit: '%',
      color: 'bg-amber-400',
      max: MAX_BF,
    },
    {
      label: 'Massa gorda',
      value: fatMass,
      unit: ' kg',
      color: 'bg-rose-400',
      max: MAX_BF,
    },
    {
      label: 'Massa magra',
      value: leanMass,
      unit: ' kg',
      color: 'bg-emerald-500',
      max: MAX_LEAN_MASS,
    },
  ];

  const age = patient?.birthDate ? calculateAge(patient.birthDate) : undefined;

  return (
    <div className="bg-white border border-border rounded-2xl shadow-sm p-5 space-y-6 sticky top-24">
      <div>
        <h3 className="text-lg font-semibold text-primary">Preview da Avaliação Física</h3>
        <p className="text-sm text-gray-500">Atualizado em tempo real conforme você preenche o wizard.</p>
      </div>

      <div className="space-y-4">
        <Card title="Dados pessoais">
          <InfoRow label="Paciente" value={patient?.name ?? '—'} />
          <InfoRow label="Idade" value={age ? `${age} anos` : '—'} />
          <InfoRow label="Sexo" value={patient ? translateSex(patient.sex) : '—'} />
          <InfoRow label="Altura" value={height ? `${height.toFixed(2)} m` : '—'} />
          <InfoRow label="Peso" value={weight ? `${weight.toFixed(1)} kg` : '—'} />
          <div className="pt-3 mt-3 border-t border-border">
            <p className="text-xs text-muted">IMC estimado</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">{bmi ? bmi.toFixed(1) : '—'}</span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-50 text-cyan-700">{bmiCategory}</span>
            </div>
          </div>
        </Card>

        <Card title="Resultados principais">
          <div className="space-y-4">
            {progressItems.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="font-semibold text-gray-900">
                    {item.value !== undefined && !Number.isNaN(item.value) ? `${item.value.toFixed(1)}${item.unit}` : '—'}
                  </span>
                </div>
                <ProgressBar value={item.value} max={item.max} colorClass={item.color} />
              </div>
            ))}
          </div>
        </Card>

        <Card title="Análise corporal">
          <div className="h-64">
            {chartData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: '#E5E7EB' }} tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={{ stroke: '#E5E7EB' }} tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: 'rgba(56, 189, 248, 0.08)' }} />
                  <Legend />
                  <Bar dataKey="atual" name="Atual" fill="#0F172A" radius={[6, 6, 0, 0]} barSize={26} />
                  <Bar dataKey="ideal" name="Ideal" fill="#10B981" radius={[6, 6, 0, 0]} barSize={26} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-500 text-center">
                Insira peso, altura ou % gordura para visualizar o gráfico comparativo.
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
    <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
      <p className="text-sm font-semibold text-primary">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

function ProgressBar({ value, max, colorClass }: { value?: number; max: number; colorClass: string }) {
  const width = value !== undefined && max ? `${Math.min((value / max) * 100, 100)}%` : '0%';
  return (
    <div className="w-full h-2.5 rounded-full bg-gray-200 overflow-hidden">
      <div className={`h-full ${colorClass}`} style={{ width }} />
    </div>
  );
}

function parseNumber(value?: string) {
  if (!value) return undefined;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return undefined;
  return parsed;
}

function getBmiCategory(bmi: number) {
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
