import type { AssessmentStepProps, AssessmentWizardFormData } from './types';

type BioimpedanceField = {
  key: keyof Pick<
    AssessmentWizardFormData,
    'ffmKg' | 'skeletalMuscleKg' | 'visceralFatIndex' | 'tbwL' | 'ecwL' | 'icwL' | 'phaseAngleDeg'
  >;
  label: string;
  placeholder: string;
};

const bioimpedanceFields: BioimpedanceField[] = [
  { key: 'ffmKg', label: 'Massa livre de gordura (kg)', placeholder: '55.0' },
  { key: 'skeletalMuscleKg', label: 'Massa muscular esquelética (kg)', placeholder: '28.0' },
  { key: 'visceralFatIndex', label: 'Índice de gordura visceral', placeholder: '8' },
  { key: 'tbwL', label: 'Água corporal total (L)', placeholder: '40.0' },
  { key: 'ecwL', label: 'Água extracelular (L)', placeholder: '16.0' },
  { key: 'icwL', label: 'Água intracelular (L)', placeholder: '24.0' },
  { key: 'phaseAngleDeg', label: 'Ângulo de fase (°)', placeholder: '6.5' },
];

export function AssessmentStepBioimpedance({ formData, onChange }: AssessmentStepProps) {
  const handleChange = (key: BioimpedanceField['key'], value: string) => {
    onChange({ [key]: value } as Partial<AssessmentWizardFormData>);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-primary">Bioimpedância</h2>
        <p className="text-sm text-gray-600">
          Utilize os dados exportados do equipamento de BIA. Todos os campos são opcionais e enriquecem o cálculo automático
          no backend.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {bioimpedanceFields.map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="text-sm font-medium text-primary">{field.label}</label>
            <input
              type="number"
              step="0.1"
              value={formData[field.key]}
              placeholder={field.placeholder}
              onChange={(event) => handleChange(field.key, event.target.value)}
              className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-accent"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

import type { AssessmentStepProps, AssessmentWizardFormData } from './types';

const bioimpedanceFields: { key: keyof AssessmentWizardFormData; label: string; placeholder: string }[] = [
  { key: 'ffmKg', label: 'Massa livre de gordura (kg)', placeholder: '55.0' },
  { key: 'skeletalMuscleKg', label: 'Massa muscular esquelética (kg)', placeholder: '28.0' },
  { key: 'visceralFatIndex', label: 'Índice de gordura visceral', placeholder: '8' },
  { key: 'tbwL', label: 'Água corporal total (L)', placeholder: '40.0' },
  { key: 'ecwL', label: 'Água extracelular (L)', placeholder: '16.0' },
  { key: 'icwL', label: 'Água intracelular (L)', placeholder: '24.0' },
  { key: 'phaseAngleDeg', label: 'Ângulo de fase (°)', placeholder: '6.5' },
  { key: 'proteinMassKg', label: 'Proteína corporal (kg)', placeholder: '12.0' },
  { key: 'mineralMassKg', label: 'Minerais (kg)', placeholder: '4.0' },
];

export function AssessmentStepBioimpedance({ formData, onChange }: AssessmentStepProps) {
  const handleChange = (key: keyof AssessmentWizardFormData, value: string) => {
    onChange({ [key]: value } as Partial<AssessmentWizardFormData>);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#0c2332]">Bioimpedância</h2>
        <p className="text-sm text-[#4f5a63]">Todos os campos são opcionais e alimentam BMR, TDEE e relatórios premium.</p>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {bioimpedanceFields.map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="text-sm font-medium text-[#0c2332]">{field.label}</label>
            <input
              type="number"
              step="0.1"
              value={formData[field.key]}
              placeholder={field.placeholder}
              onChange={(event) => handleChange(field.key, event.target.value)}
              className="w-full rounded-2xl border border-[#e2e0db] bg-white px-4 py-2.5 text-sm focus:border-[#35d0a0] focus:outline-none"
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-[#7a838b]">Integre com o equipamento InBody / Omron para preencher automaticamente.</p>
    </div>
  );
}
