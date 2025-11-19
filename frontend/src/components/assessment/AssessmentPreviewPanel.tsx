import type { Patient } from '../../types';
import type { AssessmentWizardFormData } from './types';

interface AssessmentPreviewPanelProps {
  patient: Patient;
  formData: AssessmentWizardFormData;
}

export function AssessmentPreviewPanel({ patient, formData }: AssessmentPreviewPanelProps) {
  const weight = parseFloat(formData.weightKg) || null;
  const height = parseFloat(formData.heightM) || patient.heightM;
  const bmi = weight && height ? weight / (height * height) : null;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#e2e0db] bg-white/95 p-5 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#7a838b]">Resumo</p>
        <h3 className="mt-2 text-lg font-semibold text-[#0c2332]">Preview da avaliação</h3>

        <div className="mt-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-[#5c6772]">Paciente</span>
            <span className="text-sm font-medium text-[#0c2332]">{patient.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-[#5c6772]">Data</span>
            <span className="text-sm font-medium text-[#0c2332]">{formData.dateTime || ''}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-[#5c6772]">Peso</span>
            <span className="text-sm font-medium text-[#0c2332]">
              {weight ? `${weight.toFixed(1)} kg` : ''}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-[#5c6772]">Altura</span>
            <span className="text-sm font-medium text-[#0c2332]">
              {height ? `${height.toFixed(2)} m` : ''}
            </span>
          </div>

          {bmi && (
            <div className="flex justify-between">
              <span className="text-sm text-[#5c6772]">IMC estimado</span>
              <span className="text-sm font-medium text-[#0c2332]">{bmi.toFixed(1)}</span>
            </div>
          )}

          {formData.bfPercent && (
            <div className="flex justify-between">
              <span className="text-sm text-[#5c6772]">% Gordura</span>
              <span className="text-sm font-medium text-[#0c2332]">{formData.bfPercent}%</span>
            </div>
          )}
        </div>
      </div>

      {(formData.waistCm || formData.hipCm || formData.neckCm) && (
        <div className="rounded-2xl border border-[#e2e0db] bg-white/95 p-5 shadow-sm">
          <p className="text-sm font-semibold text-[#0c2332]">Circunferências</p>
          <div className="mt-3 space-y-2">
            {formData.waistCm && (
              <div className="flex justify-between text-sm">
                <span className="text-[#5c6772]">Cintura</span>
                <span className="text-[#0c2332]">{formData.waistCm} cm</span>
              </div>
            )}
            {formData.hipCm && (
              <div className="flex justify-between text-sm">
                <span className="text-[#5c6772]">Quadril</span>
                <span className="text-[#0c2332]">{formData.hipCm} cm</span>
              </div>
            )}
            {formData.neckCm && (
              <div className="flex justify-between text-sm">
                <span className="text-[#5c6772]">Pescoço</span>
                <span className="text-[#0c2332]">{formData.neckCm} cm</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
