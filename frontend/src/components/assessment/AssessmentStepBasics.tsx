import type { AssessmentStepProps, AssessmentWizardFormData } from './types';

export function AssessmentStepBasics({ formData, onChange }: AssessmentStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-primary">Dados da avaliação</h2>
        <p className="text-sm text-gray-600">Preencha data, peso e indicadores básicos desta consulta.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField
          label="Data da avaliação"
          value={formData.dateTime}
          placeholder="DD/MM/AAAA"
          onChange={(value) => onChange({ dateTime: value })}
        />
        <InputField
          label="Peso (kg)"
          required
          type="number"
          step="0.1"
          value={formData.weightKg}
          placeholder="75.4"
          onChange={(value) => onChange({ weightKg: value })}
        />
        <InputField
          label="% Gordura corporal"
          type="number"
          step="0.1"
          value={formData.bfPercent}
          placeholder="23.5"
          onChange={(value) => onChange({ bfPercent: value })}
        />
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Nível de atividade física</label>
          <select
            value={formData.activityLevel}
            onChange={(event) =>
              onChange({
                activityLevel: event.target.value as AssessmentWizardFormData['activityLevel'],
              })
            }
            className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-accent"
          >
            <option value="SEDENTARIO">Sedentário</option>
            <option value="LEVE">Leve</option>
            <option value="MODERADO">Moderado</option>
            <option value="INTENSO">Intenso</option>
            <option value="ATLETA">Atleta</option>
          </select>
        </div>
      </div>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  step?: string;
  onChange: (value: string) => void;
}

function InputField({ label, value, placeholder, required, type = 'text', step, onChange }: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-primary">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        step={step}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-accent"
      />
    </div>
  );
}
