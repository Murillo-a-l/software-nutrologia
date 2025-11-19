import type { AssessmentStepProps, AssessmentWizardFormData } from './types';

type SkinfoldField = {
  key: keyof Pick<
    AssessmentWizardFormData,
    'tricepsMm' | 'subscapularMm' | 'suprailiacMm' | 'abdominalMm' | 'thighMm' | 'chestMm' | 'midaxillaryMm'
  >;
  label: string;
  tip: string;
};

const skinfoldFields: SkinfoldField[] = [
  { key: 'tricepsMm', label: 'Tríceps', tip: 'Dobra vertical na parte posterior do braço, no ponto médio entre ombro e cotovelo.' },
  { key: 'subscapularMm', label: 'Subescapular', tip: 'Dobra diagonal logo abaixo da escápula, acompanhando o ângulo do osso.' },
  { key: 'suprailiacMm', label: 'Supra-ilíaca', tip: 'Dobra diagonal acima da crista ilíaca, alinhada à linha axilar.' },
  { key: 'abdominalMm', label: 'Abdominal', tip: 'Dobra vertical a 2 cm lateralmente do umbigo.' },
  { key: 'thighMm', label: 'Coxa', tip: 'Dobra vertical na parte anterior da coxa, no ponto médio entre quadril e joelho.' },
  { key: 'chestMm', label: 'Peitoral', tip: 'Dobra diagonal entre a axila e o mamilo (homens) ou linha axilar (mulheres).' },
  { key: 'midaxillaryMm', label: 'Axilar média', tip: 'Dobra vertical na linha axilar média, ao nível do apêndice xifoide.' },
];

export function AssessmentStepSkinfolds({ formData, onChange }: AssessmentStepProps) {
  const handleChange = (key: SkinfoldField['key'], value: string) => {
    onChange({ [key]: value } as Partial<AssessmentWizardFormData>);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#0c2332]">Dobras cutâneas</h2>
        <p className="text-sm text-[#4f5a63]">
          Registre as sete dobras do protocolo Jackson &amp; Pollock. Opcional, porém essencial para % gordura por dobras.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#0c2332]">Protocolo utilizado</label>
            <select
              value={formData.skinfoldProtocol}
              onChange={(event) => onChange({ skinfoldProtocol: event.target.value })}
              className="w-full rounded-2xl border border-[#e2e0db] bg-white px-4 py-2.5 text-sm focus:border-[#35d0a0] focus:outline-none"
            >
              <option value="">Selecione uma opção</option>
              <option value="Jackson-Pollock 7 dobras">Jackson &amp; Pollock – 7 dobras</option>
              <option value="Jackson-Pollock 3 dobras">Jackson &amp; Pollock – 3 dobras</option>
              <option value="Outro">Outro protocolo</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skinfoldFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="flex items-center justify-between text-sm font-medium text-[#0c2332]">
                  {field.label} (mm)
                  <span className="text-[11px] text-gray-500">{field.tip.split(' ')[0]}</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData[field.key]}
                  placeholder="0.0"
                  onChange={(event) => handleChange(field.key, event.target.value)}
                  className="w-full rounded-2xl border border-[#e2e0db] bg-white px-4 py-2.5 text-sm focus:border-[#35d0a0] focus:outline-none"
                />
                <p className="text-xs text-[#7a838b]">{field.tip}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#0c2332]">Observações</label>
            <textarea
              value={formData.skinfoldNotes}
              onChange={(event) => onChange({ skinfoldNotes: event.target.value })}
              rows={3}
              placeholder="Registre temperatura da pele, instrumentos ou observações relevantes."
              className="w-full rounded-2xl border border-[#e2e0db] bg-white px-4 py-2.5 text-sm focus:border-[#35d0a0] focus:outline-none"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-[#e2e0db] bg-white/70 p-5 space-y-4">
          <p className="text-sm font-semibold text-[#0c2332]">Mapa das dobras</p>
          <SkinfoldGuide />
          <p className="text-xs text-[#7a838b]">
            As marcações ilustram os pontos de coleta das sete dobras principais. Utilize o desenho como guia rápido durante a
            avaliação.
          </p>
        </div>
      </div>
    </div>
  );
}

function SkinfoldGuide() {
  return (
    <div className="flex justify-center">
      <svg width="160" height="260" viewBox="0 0 160 260" className="text-[#12354a]">
        <circle cx="80" cy="30" r="28" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <line x1="80" y1="58" x2="80" y2="180" stroke="currentColor" strokeWidth="1.5" />
        <line x1="80" y1="90" x2="40" y2="130" stroke="currentColor" strokeWidth="1.5" />
        <line x1="80" y1="90" x2="120" y2="130" stroke="currentColor" strokeWidth="1.5" />
        <line x1="80" y1="180" x2="50" y2="240" stroke="currentColor" strokeWidth="1.5" />
        <line x1="80" y1="180" x2="110" y2="240" stroke="currentColor" strokeWidth="1.5" />

        {skinfoldMarkers.map((marker) => (
          <g key={marker.label}>
            <circle cx={marker.x} cy={marker.y} r="5" fill="#38BDF8" opacity="0.8" />
            <text x={marker.x + 8} y={marker.y + 4} fontSize="9" fill="#0F172A">
              {marker.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

const skinfoldMarkers = [
  { label: 'Tríceps', x: 38, y: 120 },
  { label: 'Subesc.', x: 30, y: 95 },
  { label: 'Supra-ilíaca', x: 120, y: 150 },
  { label: 'Abd.', x: 110, y: 170 },
  { label: 'Coxa', x: 55, y: 220 },
  { label: 'Peitoral', x: 110, y: 105 },
  { label: 'Axilar', x: 120, y: 125 },
];

import type { AssessmentStepProps, AssessmentWizardFormData } from './types';

type SkinfoldField = {
  key: keyof Pick<
    AssessmentWizardFormData,
    'tricepsMm' | 'subscapularMm' | 'suprailiacMm' | 'abdominalMm' | 'thighMm' | 'chestMm' | 'midaxillaryMm'
  >;
  label: string;
  tip: string;
};

const skinfoldFields: SkinfoldField[] = [
  { key: 'tricepsMm', label: 'Tríceps', tip: 'Dobra vertical na parte posterior do braço, no ponto médio entre ombro e cotovelo.' },
  { key: 'subscapularMm', label: 'Subescapular', tip: 'Dobra diagonal logo abaixo da escápula, acompanhando o ângulo do osso.' },
  { key: 'suprailiacMm', label: 'Supra-ilíaca', tip: 'Dobra diagonal acima da crista ilíaca, alinhada à linha axilar.' },
  { key: 'abdominalMm', label: 'Abdominal', tip: 'Dobra vertical a 2 cm lateralmente do umbigo.' },
  { key: 'thighMm', label: 'Coxa', tip: 'Dobra vertical na parte anterior da coxa, no ponto médio entre quadril e joelho.' },
  { key: 'chestMm', label: 'Peitoral', tip: 'Dobra diagonal entre a axila e o mamilo (homens) ou linha axilar (mulheres).' },
  { key: 'midaxillaryMm', label: 'Axilar média', tip: 'Dobra vertical na linha axilar média, ao nível do apêndice xifoide.' },
];

export function AssessmentStepSkinfolds({ formData, onChange }: AssessmentStepProps) {
  const handleChange = (key: SkinfoldField['key'], value: string) => {
    onChange({ [key]: value } as Partial<AssessmentWizardFormData>);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-primary">Dobras cutâneas</h2>
        <p className="text-sm text-gray-600">
          Registre as sete dobras do protocolo Jackson & Pollock. Esses dados são opcionais, mas enriquecem o cálculo de %
          gordura por dobras.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">Protocolo utilizado</label>
            <select
              value={formData.skinfoldProtocol}
              onChange={(event) => onChange({ skinfoldProtocol: event.target.value })}
              className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-accent"
            >
              <option value="">Selecione uma opção</option>
              <option value="Jackson-Pollock 7 dobras">Jackson &amp; Pollock – 7 dobras</option>
              <option value="Jackson-Pollock 3 dobras">Jackson &amp; Pollock – 3 dobras</option>
              <option value="Outro">Outro protocolo</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skinfoldFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="text-sm font-medium text-primary flex items-center justify-between">
                  {field.label} (mm)
                  <span className="text-[11px] text-gray-500">{field.tip.split(' ')[0]}</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData[field.key]}
                  placeholder="0.0"
                  onChange={(event) => handleChange(field.key, event.target.value)}
                  className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-accent"
                />
                <p className="text-xs text-gray-500">{field.tip}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">Observações</label>
            <textarea
              value={formData.skinfoldNotes}
              onChange={(event) => onChange({ skinfoldNotes: event.target.value })}
              rows={3}
              placeholder="Registre temperatura da pele, instrumentos ou observações relevantes."
              className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 space-y-4">
          <p className="text-sm font-semibold text-primary">Mapa das dobras</p>
          <SkinfoldGuide />
          <p className="text-xs text-gray-600">
            As marcações ilustram os pontos de coleta das sete dobras principais. Utilize o desenho como guia rápido durante a
            avaliação.
          </p>
        </div>
      </div>
    </div>
  );
}

function SkinfoldGuide() {
  return (
    <div className="flex justify-center">
      <svg width="160" height="260" viewBox="0 0 160 260" className="text-primary/60">
        <circle cx="80" cy="30" r="28" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <line x1="80" y1="58" x2="80" y2="180" stroke="currentColor" strokeWidth="1.5" />
        <line x1="80" y1="90" x2="40" y2="130" stroke="currentColor" strokeWidth="1.5" />
        <line x1="80" y1="90" x2="120" y2="130" stroke="currentColor" strokeWidth="1.5" />
        <line x1="80" y1="180" x2="50" y2="240" stroke="currentColor" strokeWidth="1.5" />
        <line x1="80" y1="180" x2="110" y2="240" stroke="currentColor" strokeWidth="1.5" />

        {skinfoldMarkers.map((marker) => (
          <g key={marker.label}>
            <circle cx={marker.x} cy={marker.y} r="5" fill="#38BDF8" opacity="0.8" />
            <text x={marker.x + 8} y={marker.y + 4} fontSize="9" fill="#0F172A">
              {marker.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

const skinfoldMarkers = [
  { label: 'Tríceps', x: 38, y: 120 },
  { label: 'Subesc.', x: 30, y: 95 },
  { label: 'Supra-ilíaca', x: 120, y: 150 },
  { label: 'Abd.', x: 110, y: 170 },
  { label: 'Coxa', x: 55, y: 220 },
  { label: 'Peitoral', x: 110, y: 105 },
  { label: 'Axilar', x: 120, y: 125 },
];
