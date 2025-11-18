import type { AssessmentStepProps, AssessmentWizardFormData } from './types';

const anthropometryFields: { key: keyof AssessmentWizardFormData; label: string; placeholder: string; step: string }[] = [
  { key: 'heightM', label: 'Altura (m)', placeholder: '1.70', step: '0.01' },
  { key: 'waistCm', label: 'Cintura (cm)', placeholder: '80', step: '0.1' },
  { key: 'hipCm', label: 'Quadril (cm)', placeholder: '95', step: '0.1' },
  { key: 'neckCm', label: 'Pescoço (cm)', placeholder: '35', step: '0.1' },
  { key: 'chestCm', label: 'Tórax/peitoral (cm)', placeholder: '100', step: '0.1' },
  { key: 'armCm', label: 'Braço relaxado (cm)', placeholder: '32', step: '0.1' },
  { key: 'thighCm', label: 'Coxa (cm)', placeholder: '55', step: '0.1' },
  { key: 'calfCm', label: 'Panturrilha (cm)', placeholder: '37', step: '0.1' },
];

export function AssessmentStepAnthropometry({ formData, onChange }: AssessmentStepProps) {
  const handleChange = (key: keyof AssessmentWizardFormData, value: string) => {
    onChange({ [key]: value } as Partial<AssessmentWizardFormData>);
  };

  const waist = parseValue(formData.waistCm);
  const hip = parseValue(formData.hipCm);
  const heightMeters = parseValue(formData.heightM);
  const height = heightMeters ? heightMeters * 100 : undefined;
  const rca = waist && height ? waist / height : null;
  const rcq = waist && hip ? waist / hip : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#0c2332]">Antropometria clínica</h2>
        <p className="text-sm text-[#4f5a63]">Perímetros essenciais para RCA, RCQ e relatórios corporais.</p>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {anthropometryFields.map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="text-sm font-medium text-[#0c2332]">{field.label}</label>
            <input
              type="number"
              step={field.step}
              value={formData[field.key]}
              placeholder={field.placeholder}
              onChange={(event) => handleChange(field.key, event.target.value)}
              className="w-full rounded-2xl border border-[#e2e0db] bg-white px-4 py-2.5 text-sm focus:border-[#35d0a0] focus:outline-none"
            />
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-[#f0ede8] bg-white/70 px-4 py-3 text-sm text-[#4f5a63]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#7a838b]">RCA</p>
            <p className="text-xl font-semibold text-[#0c2332]">{rca ? rca.toFixed(2) : '—'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#7a838b]">RCQ</p>
            <p className="text-xl font-semibold text-[#0c2332]">{rcq ? rcq.toFixed(2) : '—'}</p>
          </div>
          <p className="text-xs text-[#7a838b]">Valores calculados automaticamente a partir das medidas.</p>
        </div>
      </div>
    </div>
  );
}

function parseValue(value: string) {
  if (!value) return undefined;
  const parsed = parseFloat(value);
  if (Number.isNaN(parsed)) return undefined;
  return parsed;
}
