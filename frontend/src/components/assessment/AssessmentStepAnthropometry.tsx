import type { AssessmentStepProps, AssessmentWizardFormData } from './types';

type AnthropometryField = {
  key: keyof Pick<AssessmentWizardFormData, 'heightM' | 'waistCm' | 'hipCm' | 'neckCm'>;
  label: string;
  placeholder: string;
  step: string;
  required?: boolean;
};

const anthropometryFields: AnthropometryField[] = [
  { key: 'heightM', label: 'Altura (m)', placeholder: '1.70', step: '0.01', required: true },
  { key: 'waistCm', label: 'Circunferência da cintura (cm)', placeholder: '80', step: '0.1' },
  { key: 'hipCm', label: 'Circunferência do quadril (cm)', placeholder: '95', step: '0.1' },
  { key: 'neckCm', label: 'Circunferência do pescoço (cm)', placeholder: '35', step: '0.1' },
];

export function AssessmentStepAnthropometry({ formData, onChange }: AssessmentStepProps) {
  const handleChange = (key: AnthropometryField['key'], value: string) => {
    onChange({ [key]: value } as Partial<AssessmentWizardFormData>);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-primary">Antropometria</h2>
        <p className="text-sm text-gray-600">Registre as circunferências e medidas lineares utilizadas para RCQ, RCA e outras razões.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {anthropometryFields.map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="text-sm font-medium text-primary">
              {field.label}
              {field.required && <span className="ml-1 text-danger">*</span>}
            </label>
            <input
              type="number"
              step={field.step}
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
