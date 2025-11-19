import type { ReactNode } from 'react';
import type { Patient } from '../../types';
import type { AssessmentStepProps } from './types';

interface AssessmentStepReviewProps extends AssessmentStepProps {
  patient?: Patient | null;
}

export function AssessmentStepReview({ formData, patient }: AssessmentStepReviewProps) {
  const anthropometry = [
    { label: 'Altura', value: formatUnit(formData.heightM, 'm') },
    { label: 'Cintura', value: formatUnit(formData.waistCm, 'cm') },
    { label: 'Quadril', value: formatUnit(formData.hipCm, 'cm') },
    { label: 'Pescoço', value: formatUnit(formData.neckCm, 'cm') },
    { label: 'Tórax', value: formatUnit(formData.chestCm, 'cm') },
    { label: 'Braço', value: formatUnit(formData.armCm, 'cm') },
    { label: 'Coxa', value: formatUnit(formData.thighCm, 'cm') },
    { label: 'Panturrilha', value: formatUnit(formData.calfCm, 'cm') },
  ];

  const bia = [
    { label: 'FFM', value: formatUnit(formData.ffmKg, 'kg') },
    { label: 'Massa muscular esquelética', value: formatUnit(formData.skeletalMuscleKg, 'kg') },
    { label: 'Índice de gordura visceral', value: formData.visceralFatIndex || '—' },
    { label: 'TBW', value: formatUnit(formData.tbwL, 'L') },
    { label: 'ECW', value: formatUnit(formData.ecwL, 'L') },
    { label: 'ICW', value: formatUnit(formData.icwL, 'L') },
    { label: 'Ângulo de fase', value: formatUnit(formData.phaseAngleDeg, '°') },
    { label: 'Proteína', value: formatUnit(formData.proteinMassKg, 'kg') },
    { label: 'Minerais', value: formatUnit(formData.mineralMassKg, 'kg') },
  ];

  const skinfolds = [
    { label: 'Tríceps', value: formatUnit(formData.tricepsMm, 'mm') },
    { label: 'Subescapular', value: formatUnit(formData.subscapularMm, 'mm') },
    { label: 'Supra-ilíaca', value: formatUnit(formData.suprailiacMm, 'mm') },
    { label: 'Abdominal', value: formatUnit(formData.abdominalMm, 'mm') },
    { label: 'Coxa', value: formatUnit(formData.thighMm, 'mm') },
    { label: 'Peitoral', value: formatUnit(formData.chestMm, 'mm') },
    { label: 'Axilar média', value: formatUnit(formData.midaxillaryMm, 'mm') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#0c2332]">Revisão e finalização</h2>
        <p className="text-sm text-[#4f5a63]">Confira os dados antes de salvar. Você pode voltar a qualquer etapa para ajustes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SummaryCard title="Dados da avaliação">
          <SummaryRow label="Paciente" value={patient?.name ?? '—'} />
          <SummaryRow label="Data" value={formData.dateTime || '—'} />
          <SummaryRow label="Peso" value={formatUnit(formData.weightKg, 'kg')} />
          <SummaryRow label="% Gordura" value={formData.bfPercent ? `${formData.bfPercent}%` : '—'} />
          <SummaryRow label="Atividade" value={translateActivity(formData.activityLevel)} />
        </SummaryCard>

        <SummaryCard title="Antropometria">
          {anthropometry.map((item) => (
            <SummaryRow key={item.label} label={item.label} value={item.value} />
          ))}
        </SummaryCard>

        <SummaryCard title="Bioimpedância">
          {bia.map((item) => (
            <SummaryRow key={item.label} label={item.label} value={item.value} />
          ))}
        </SummaryCard>

        <SummaryCard title="Dobras cutâneas">
          <SummaryRow label="Protocolo" value={formData.skinfoldProtocol || 'Não informado'} />
          {skinfolds.map((item) => (
            <SummaryRow key={item.label} label={item.label} value={item.value} />
          ))}
          {formData.skinfoldNotes && <p className="mt-2 text-xs text-[#7a838b]">Obs.: {formData.skinfoldNotes}</p>}
        </SummaryCard>
      </div>
    </div>
  );
}

function SummaryCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#e2e0db] bg-white/80 p-4 space-y-3">
      <p className="text-sm font-semibold text-[#0c2332]">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[#7a838b]">{label}</span>
      <span className="font-semibold text-[#0c2332]">{value}</span>
    </div>
  );
}

function formatUnit(value: string, unit: string) {
  if (!value) return '—';
  return `${value}${unit}`;
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
