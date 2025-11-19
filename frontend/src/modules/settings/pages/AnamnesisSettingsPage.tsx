import { useEffect, useState } from 'react';
import { Layout } from '../../../components/Layout';
import { apiClient } from '../../../api/client';
import type { AnamnesisConfig } from '../../../types';

// Default configuration
const defaultConfig: AnamnesisConfig = {
  comorbidities: [
    { id: 'has-1', label: 'HAS', fieldName: 'hasHypertension', enabled: true },
    { id: 'dm2-1', label: 'DM2', fieldName: 'hasDiabetes', enabled: true },
    { id: 'predm-1', label: 'Pré-DM', fieldName: 'hasPrediabetes', enabled: true },
    { id: 'dyslip-1', label: 'Dislipidemia', fieldName: 'hasDyslipidemia', enabled: true },
    { id: 'steat-1', label: 'Esteatose', fieldName: 'hasSteatosis', enabled: true },
    { id: 'thyroid-1', label: 'Tireoide', fieldName: 'hasThyroidDisorder', enabled: true },
  ],
  familyHistory: [
    { id: 'fh-cv-1', label: 'DCV precoce', fieldName: 'familyHistoryCV', enabled: true },
    { id: 'fh-dm-1', label: 'DM', fieldName: 'familyHistoryDM', enabled: true },
    { id: 'fh-ob-1', label: 'Obesidade', fieldName: 'familyHistoryObesity', enabled: true },
  ],
  redsSymptoms: [
    { id: 'reds-fatigue', label: 'Fadiga', fieldName: 'hasFatigue', enabled: true },
    { id: 'reds-perf', label: 'Queda performance', fieldName: 'hasPerformanceDrop', enabled: true },
    { id: 'reds-amen', label: 'Amenorreia', fieldName: 'hasAmenorrhea', enabled: true },
    { id: 'reds-frat', label: 'Fraturas estresse', fieldName: 'hasStressFractures', enabled: true },
    { id: 'reds-infec', label: 'Infecções freq.', fieldName: 'hasFrequentInfections', enabled: true },
    { id: 'reds-tgi', label: 'TGI', fieldName: 'hasDigestiveIssues', enabled: true },
    { id: 'reds-humor', label: 'Humor', fieldName: 'hasMoodChanges', enabled: true },
  ],
  treatmentGoals: [
    { id: 'goal-emag', label: 'Emagrecimento', fieldName: 'emagrecimento', enabled: true },
    { id: 'goal-hiper', label: 'Hipertrofia', fieldName: 'hipertrofia', enabled: true },
    { id: 'goal-perf', label: 'Performance esportiva', fieldName: 'performance', enabled: true },
    { id: 'goal-long', label: 'Longevidade', fieldName: 'longevidade', enabled: true },
    { id: 'goal-saude', label: 'Saúde geral', fieldName: 'saude_geral', enabled: true },
  ],
};

export function AnamnesisSettingsPage() {
  const [config, setConfig] = useState<AnamnesisConfig>(defaultConfig);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<keyof AnamnesisConfig>('comorbidities');

  // New item state for each section
  const [newItemLabel, setNewItemLabel] = useState('');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const savedConfig = await apiClient.getAnamnesisConfig();
      if (savedConfig) {
        setConfig(savedConfig);
      }
    } catch (err) {
      // Use default config if not found
      console.log('Using default anamnesis config');
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await apiClient.saveAnamnesisConfig(config);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const toggleOption = (section: keyof AnamnesisConfig, optionId: string) => {
    setConfig({
      ...config,
      [section]: config[section].map((opt) =>
        opt.id === optionId ? { ...opt, enabled: !opt.enabled } : opt
      ),
    });
  };

  const updateOptionLabel = (section: keyof AnamnesisConfig, optionId: string, newLabel: string) => {
    setConfig({
      ...config,
      [section]: config[section].map((opt) =>
        opt.id === optionId ? { ...opt, label: newLabel } : opt
      ),
    });
  };

  const removeOption = (section: keyof AnamnesisConfig, optionId: string) => {
    setConfig({
      ...config,
      [section]: config[section].filter((opt) => opt.id !== optionId),
    });
  };

  const addOption = (section: keyof AnamnesisConfig) => {
    if (!newItemLabel.trim()) return;

    const newId = `custom-${Date.now()}`;
    const fieldName = `custom_${newItemLabel.toLowerCase().replace(/\s+/g, '_')}`;

    setConfig({
      ...config,
      [section]: [
        ...config[section],
        {
          id: newId,
          label: newItemLabel.trim(),
          fieldName,
          enabled: true,
        },
      ],
    });
    setNewItemLabel('');
  };

  const moveOption = (section: keyof AnamnesisConfig, optionId: string, direction: 'up' | 'down') => {
    const options = [...config[section]];
    const index = options.findIndex((opt) => opt.id === optionId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= options.length) return;

    [options[index], options[newIndex]] = [options[newIndex], options[index]];
    setConfig({ ...config, [section]: options });
  };

  const sectionLabels: Record<keyof AnamnesisConfig, string> = {
    comorbidities: 'Antecedentes Pessoais - Comorbidades',
    familyHistory: 'Antecedentes Familiares',
    redsSymptoms: 'Sintomas RED-S / Performance',
    treatmentGoals: 'Objetivos do Tratamento',
  };

  return (
    <Layout>
      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[#7a838b]">Configurações</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#0c2332]">Personalizar Anamnese</h1>
        <p className="mt-2 text-sm text-[#4f5a63]">
          Configure os checkboxes e campos que aparecem no formulário de anamnese.
          Adicione, remova ou edite opções conforme necessário.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {success && (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Configurações salvas com sucesso!
        </div>
      )}

      {/* Section tabs */}
      <div className="rounded-2xl border border-[#e2e0db] bg-white/90 p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(sectionLabels) as Array<keyof AnamnesisConfig>).map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                activeSection === section
                  ? 'bg-[#35d0a0] text-[#0c2332]'
                  : 'bg-[#f5f3f0] text-[#5c6772] hover:bg-[#e2e0db]'
              }`}
            >
              {sectionLabels[section]}
            </button>
          ))}
        </div>
      </div>

      {/* Active section editor */}
      <div className="rounded-2xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0c2332]">{sectionLabels[activeSection]}</h2>
        <p className="mt-1 text-xs text-[#7a838b]">
          Arraste para reordenar, edite os nomes ou desative opções que não deseja exibir.
        </p>

        {/* Options list */}
        <div className="mt-4 space-y-2">
          {config[activeSection].map((option, index) => (
            <div
              key={option.id}
              className={`flex items-center gap-3 rounded-xl border p-3 ${
                option.enabled ? 'border-[#e2e0db] bg-white' : 'border-gray-200 bg-gray-50'
              }`}
            >
              {/* Enable/disable toggle */}
              <button
                onClick={() => toggleOption(activeSection, option.id)}
                className={`h-5 w-5 rounded border-2 flex items-center justify-center ${
                  option.enabled
                    ? 'border-[#35d0a0] bg-[#35d0a0] text-white'
                    : 'border-[#e2e0db] bg-white'
                }`}
              >
                {option.enabled && (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              {/* Editable label */}
              <input
                type="text"
                value={option.label}
                onChange={(e) => updateOptionLabel(activeSection, option.id, e.target.value)}
                className={`flex-1 rounded-lg border border-transparent px-2 py-1 text-sm focus:border-[#35d0a0] focus:outline-none ${
                  option.enabled ? 'text-[#0c2332]' : 'text-gray-400'
                }`}
              />

              {/* Move buttons */}
              <div className="flex gap-1">
                <button
                  onClick={() => moveOption(activeSection, option.id, 'up')}
                  disabled={index === 0}
                  className="rounded p-1 text-[#7a838b] hover:bg-[#f5f3f0] disabled:opacity-30"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => moveOption(activeSection, option.id, 'down')}
                  disabled={index === config[activeSection].length - 1}
                  className="rounded p-1 text-[#7a838b] hover:bg-[#f5f3f0] disabled:opacity-30"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Delete button */}
              <button
                onClick={() => removeOption(activeSection, option.id)}
                className="rounded p-1 text-[#7a838b] hover:bg-red-50 hover:text-red-500"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Add new option */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={newItemLabel}
            onChange={(e) => setNewItemLabel(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addOption(activeSection)}
            className="flex-1 rounded-xl border border-[#e2e0db] bg-white px-4 py-2 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
            placeholder={`Adicionar novo item em ${sectionLabels[activeSection]}...`}
          />
          <button
            onClick={() => addOption(activeSection)}
            className="rounded-xl bg-[#35d0a0] px-4 py-2 text-sm font-semibold text-[#0c2332] hover:bg-[#2eb48a]"
          >
            + Adicionar
          </button>
        </div>
      </div>

      {/* Reset to defaults */}
      <div className="rounded-2xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-[#0c2332]">Restaurar padrões</h3>
        <p className="mt-1 text-xs text-[#7a838b]">
          Isso irá restaurar todas as configurações de anamnese para os valores padrão do sistema.
        </p>
        <button
          onClick={() => setConfig(defaultConfig)}
          className="mt-3 rounded-xl border border-[#e2e0db] bg-white px-4 py-2 text-sm font-medium text-[#5c6772] hover:bg-[#f5f3f0]"
        >
          Restaurar padrões
        </button>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-2xl bg-[#35d0a0] px-6 py-3 text-sm font-semibold text-[#0c2332] shadow-sm hover:bg-[#2eb48a] disabled:opacity-60"
        >
          {saving ? 'Salvando...' : 'Salvar configurações'}
        </button>
      </div>
    </Layout>
  );
}
