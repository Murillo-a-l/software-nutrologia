import { useEffect, useState } from 'react';
import { Layout } from '../../../components/Layout';
import { apiClient } from '../../../api/client';
import type { FormTemplate, FormSection, FormField, FieldType } from '../../../types';

// Default template based on current anamnesis structure
const defaultTemplate: FormTemplate = {
  id: 'default',
  name: 'Anamnese Nutrologia',
  description: 'Template padrão para consultas de nutrologia',
  isDefault: true,
  sections: [
    {
      id: 'qp',
      title: 'QP - Queixa Principal',
      fields: [
        { id: 'mainComplaint', type: 'textarea', label: 'Queixa Principal', placeholder: 'Descreva a queixa principal do paciente...', rows: 2, width: 'full' }
      ]
    },
    {
      id: 'muc',
      title: 'MUC - Medicamentos em Uso Contínuo',
      fields: [
        { id: 'currentMedications', type: 'textarea', label: 'Medicamentos', placeholder: 'Liste os medicamentos em uso contínuo...', rows: 3, width: 'full' }
      ]
    },
    {
      id: 'comorbidities',
      title: 'Antecedentes Pessoais - Comorbidades',
      fields: [
        { id: 'comorbidities_checks', type: 'checkbox_group', label: 'Comorbidades', options: [
          { value: 'has', label: 'HAS' },
          { value: 'dm2', label: 'DM2' },
          { value: 'predm', label: 'Pré-DM' },
          { value: 'dislipidemia', label: 'Dislipidemia' },
          { value: 'esteatose', label: 'Esteatose' },
          { value: 'tireoide', label: 'Tireoide' }
        ], width: 'full' },
        { id: 'otherComorbidities', type: 'tags_input', label: 'Outras comorbidades', placeholder: 'Adicione outras...', width: 'full' }
      ]
    },
    {
      id: 'family_history',
      title: 'Antecedentes Familiares',
      fields: [
        { id: 'family_checks', type: 'checkbox_group', label: 'Histórico', options: [
          { value: 'dcv', label: 'DCV precoce' },
          { value: 'dm', label: 'DM' },
          { value: 'obesidade', label: 'Obesidade' }
        ], width: 'full' },
        { id: 'familyHistoryNotes', type: 'tags_input', label: 'Detalhes', placeholder: 'Ex: Mãe - CA mama...', width: 'full' }
      ]
    },
    {
      id: 'lifestyle',
      title: 'Hábitos de Vida',
      fields: [
        { id: 'sleepHours', type: 'number', label: 'Sono', unit: 'h/noite', placeholder: '7', width: 'third' },
        { id: 'sleepQuality', type: 'select', label: 'Qualidade sono', options: [
          { value: 'ruim', label: 'Ruim' },
          { value: 'regular', label: 'Regular' },
          { value: 'boa', label: 'Boa' },
          { value: 'excelente', label: 'Excelente' }
        ], width: 'third' },
        { id: 'alcohol', type: 'select', label: 'Etilismo', options: [
          { value: 'nunca', label: 'Nunca' },
          { value: 'raramente', label: 'Raramente' },
          { value: 'social', label: 'Social' },
          { value: 'frequente', label: 'Frequente' }
        ], width: 'third' },
        { id: 'activityLevel', type: 'select', label: 'Atividade física', options: [
          { value: 'sedentario', label: 'Sedentário' },
          { value: 'leve', label: 'Leve' },
          { value: 'moderado', label: 'Moderado' },
          { value: 'intenso', label: 'Intenso' },
          { value: 'atleta', label: 'Atleta' }
        ], width: 'third' },
        { id: 'activityType', type: 'text', label: 'Tipo de AF', placeholder: 'Musculação, corrida...', width: 'third' },
        { id: 'waterIntake', type: 'number', label: 'Água', unit: 'L/dia', placeholder: '2.0', step: 0.1, width: 'third' },
        { id: 'isSmoker', type: 'boolean_conditional', label: 'Tabagista', conditionalLabel: 'Detalhes', conditionalPlaceholder: 'Quantidade, tempo...', width: 'full' }
      ]
    },
    {
      id: 'physical_exam',
      title: 'Exame Físico',
      fields: [
        { id: 'vitals', type: 'vitals_group', label: 'Sinais Vitais', width: 'full' },
        { id: 'physicalExamText', type: 'textarea', label: 'Exame Segmentar', placeholder: 'Ectoscopia: BEG...\nCP: ...\nACV: ...', rows: 10, width: 'full' }
      ]
    },
    {
      id: 'reds',
      title: 'Sintomas RED-S / Performance',
      fields: [
        { id: 'reds_checks', type: 'checkbox_group', label: 'Sintomas', options: [
          { value: 'fadiga', label: 'Fadiga' },
          { value: 'performance', label: 'Queda performance' },
          { value: 'amenorreia', label: 'Amenorreia' },
          { value: 'fraturas', label: 'Fraturas estresse' },
          { value: 'infeccoes', label: 'Infecções freq.' },
          { value: 'tgi', label: 'TGI' },
          { value: 'humor', label: 'Humor' }
        ], width: 'full' },
        { id: 'otherSymptoms', type: 'tags_input', label: 'Outros sintomas', placeholder: 'Adicione outros...', width: 'full' }
      ]
    },
    {
      id: 'diagnosis',
      title: 'HD - Hipótese Diagnóstica',
      fields: [
        { id: 'diagnosticHypothesis', type: 'textarea', label: 'Hipóteses', placeholder: 'Liste as hipóteses diagnósticas...', rows: 3, width: 'full' }
      ]
    },
    {
      id: 'plan',
      title: 'P - Plano',
      fields: [
        { id: 'plan', type: 'textarea', label: 'Plano terapêutico', placeholder: 'Descreva o plano, exames, orientações...', rows: 4, width: 'full' }
      ]
    },
    {
      id: 'goals',
      title: 'Objetivos do Tratamento',
      fields: [
        { id: 'goals_checks', type: 'checkbox_group', label: 'Objetivos', options: [
          { value: 'emagrecimento', label: 'Emagrecimento' },
          { value: 'hipertrofia', label: 'Hipertrofia' },
          { value: 'performance', label: 'Performance' },
          { value: 'longevidade', label: 'Longevidade' },
          { value: 'saude_geral', label: 'Saúde geral' }
        ], width: 'full' },
        { id: 'customGoals', type: 'tags_input', label: 'Objetivos personalizados', placeholder: 'Adicione outros...', width: 'full' }
      ]
    },
    {
      id: 'supplements',
      title: 'Suplementos em Uso',
      fields: [
        { id: 'currentSupplements', type: 'textarea', label: 'Suplementos', placeholder: 'Liste os suplementos em uso...', rows: 2, width: 'full' }
      ]
    }
  ]
};

const fieldTypeLabels: Record<FieldType, string> = {
  text: 'Texto curto',
  textarea: 'Texto longo',
  number: 'Número',
  select: 'Seleção',
  checkbox_group: 'Checkboxes',
  boolean: 'Sim/Não',
  boolean_conditional: 'Sim/Não com detalhe',
  vitals_group: 'Sinais vitais',
  tags_input: 'Tags dinâmicas'
};

const fieldTypeIcons: Record<FieldType, string> = {
  text: 'T',
  textarea: '¶',
  number: '#',
  select: '▼',
  checkbox_group: '☑',
  boolean: '◯',
  boolean_conditional: '◯+',
  vitals_group: '♥',
  tags_input: '⊕'
};

export function FormBuilderPage() {
  const [template, setTemplate] = useState<FormTemplate>(defaultTemplate);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [showFieldPalette, setShowFieldPalette] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const saved = await apiClient.getFormTemplates();
      if (saved && saved.length > 0) {
        const defaultTpl = saved.find(t => t.isDefault) || saved[0];
        setTemplate(defaultTpl);
      }
    } catch (err) {
      console.log('Using default template');
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await apiClient.saveFormTemplate(template);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving template:', err);
    } finally {
      setSaving(false);
    }
  };

  const addSection = () => {
    const newSection: FormSection = {
      id: `section-${Date.now()}`,
      title: 'Nova Seção',
      fields: []
    };
    setTemplate({
      ...template,
      sections: [...template.sections, newSection]
    });
    setSelectedSection(newSection.id);
  };

  const removeSection = (sectionId: string) => {
    setTemplate({
      ...template,
      sections: template.sections.filter(s => s.id !== sectionId)
    });
    if (selectedSection === sectionId) {
      setSelectedSection(null);
    }
  };

  const updateSection = (sectionId: string, updates: Partial<FormSection>) => {
    setTemplate({
      ...template,
      sections: template.sections.map(s =>
        s.id === sectionId ? { ...s, ...updates } : s
      )
    });
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    const index = template.sections.findIndex(s => s.id === sectionId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= template.sections.length) return;

    const newSections = [...template.sections];
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    setTemplate({ ...template, sections: newSections });
  };

  const addField = (sectionId: string, fieldType: FieldType) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: fieldType,
      label: fieldTypeLabels[fieldType],
      width: 'full'
    };

    if (fieldType === 'select' || fieldType === 'checkbox_group') {
      newField.options = [{ value: 'opcao1', label: 'Opção 1' }];
    }

    setTemplate({
      ...template,
      sections: template.sections.map(s =>
        s.id === sectionId
          ? { ...s, fields: [...s.fields, newField] }
          : s
      )
    });
    setSelectedField(newField.id);
    setShowFieldPalette(null);
  };

  const removeField = (sectionId: string, fieldId: string) => {
    setTemplate({
      ...template,
      sections: template.sections.map(s =>
        s.id === sectionId
          ? { ...s, fields: s.fields.filter(f => f.id !== fieldId) }
          : s
      )
    });
    if (selectedField === fieldId) {
      setSelectedField(null);
    }
  };

  const updateField = (sectionId: string, fieldId: string, updates: Partial<FormField>) => {
    setTemplate({
      ...template,
      sections: template.sections.map(s =>
        s.id === sectionId
          ? {
              ...s,
              fields: s.fields.map(f =>
                f.id === fieldId ? { ...f, ...updates } : f
              )
            }
          : s
      )
    });
  };

  const moveField = (sectionId: string, fieldId: string, direction: 'up' | 'down') => {
    const section = template.sections.find(s => s.id === sectionId);
    if (!section) return;

    const index = section.fields.findIndex(f => f.id === fieldId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= section.fields.length) return;

    const newFields = [...section.fields];
    [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];

    setTemplate({
      ...template,
      sections: template.sections.map(s =>
        s.id === sectionId ? { ...s, fields: newFields } : s
      )
    });
  };

  const getSelectedFieldData = () => {
    if (!selectedField) return null;
    for (const section of template.sections) {
      const field = section.fields.find(f => f.id === selectedField);
      if (field) return { field, sectionId: section.id };
    }
    return null;
  };

  const selectedFieldData = getSelectedFieldData();

  return (
    <Layout>
      {/* Header */}
      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[#7a838b]">Configurações</p>
        <div className="mt-2 flex items-center gap-3">
          {editingName ? (
            <input
              type="text"
              value={template.name}
              onChange={(e) => setTemplate({ ...template, name: e.target.value })}
              onBlur={() => setEditingName(false)}
              onKeyPress={(e) => e.key === 'Enter' && setEditingName(false)}
              className="text-3xl font-semibold text-[#0c2332] bg-transparent border-b-2 border-[#35d0a0] focus:outline-none"
              autoFocus
            />
          ) : (
            <h1
              className="text-3xl font-semibold text-[#0c2332] cursor-pointer hover:text-[#35d0a0]"
              onClick={() => setEditingName(true)}
            >
              {template.name}
            </h1>
          )}
          <button
            onClick={() => setEditingName(!editingName)}
            className="text-[#7a838b] hover:text-[#0c2332]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-sm text-[#4f5a63]">
          Arraste seções e campos para reorganizar. Clique para editar propriedades.
        </p>
      </div>

      {success && (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Template salvo com sucesso!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sections List */}
        <div className="lg:col-span-2 space-y-3">
          {template.sections.map((section, sectionIndex) => (
            <div
              key={section.id}
              className={`rounded-2xl border bg-white/90 shadow-sm transition ${
                selectedSection === section.id
                  ? 'border-[#0c2332] ring-2 ring-[#0c2332]/20'
                  : 'border-[#e2e0db] hover:border-[#35d0a0]'
              }`}
            >
              {/* Section Header */}
              <div
                className="flex items-center gap-3 p-4 cursor-pointer"
                onClick={() => setSelectedSection(selectedSection === section.id ? null : section.id)}
              >
                <div className="flex flex-col gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'up'); }}
                    disabled={sectionIndex === 0}
                    className="text-[#7a838b] hover:text-[#0c2332] disabled:opacity-30"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'down'); }}
                    disabled={sectionIndex === template.sections.length - 1}
                    className="text-[#7a838b] hover:text-[#0c2332] disabled:opacity-30"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSection(section.id, { title: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 text-sm font-semibold text-[#0c2332] bg-transparent border-none focus:outline-none focus:ring-0"
                />

                <span className="text-xs text-[#7a838b]">{section.fields.length} campos</span>

                <button
                  onClick={(e) => { e.stopPropagation(); removeSection(section.id); }}
                  className="text-[#7a838b] hover:text-red-500"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Section Fields */}
              {selectedSection === section.id && (
                <div className="border-t border-[#e2e0db] p-4 space-y-2">
                  {section.fields.map((field, fieldIndex) => (
                    <div
                      key={field.id}
                      className={`flex items-center gap-3 rounded-xl p-3 cursor-pointer transition ${
                        selectedField === field.id
                          ? 'bg-[#0c2332] text-white'
                          : 'bg-[#f5f3f0] hover:bg-[#e2e0db]'
                      }`}
                      onClick={() => setSelectedField(selectedField === field.id ? null : field.id)}
                    >
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); moveField(section.id, field.id, 'up'); }}
                          disabled={fieldIndex === 0}
                          className={`disabled:opacity-30 ${selectedField === field.id ? 'text-white/70 hover:text-white' : 'text-[#7a838b] hover:text-[#0c2332]'}`}
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); moveField(section.id, field.id, 'down'); }}
                          disabled={fieldIndex === section.fields.length - 1}
                          className={`disabled:opacity-30 ${selectedField === field.id ? 'text-white/70 hover:text-white' : 'text-[#7a838b] hover:text-[#0c2332]'}`}
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>

                      <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                        selectedField === field.id ? 'bg-white/20' : 'bg-[#0c2332] text-white'
                      }`}>
                        {fieldTypeIcons[field.type]}
                      </span>

                      <div className="flex-1">
                        <p className={`text-sm font-medium ${selectedField === field.id ? 'text-white' : 'text-[#0c2332]'}`}>
                          {field.label}
                        </p>
                        <p className={`text-xs ${selectedField === field.id ? 'text-white/70' : 'text-[#7a838b]'}`}>
                          {fieldTypeLabels[field.type]}
                        </p>
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); removeField(section.id, field.id); }}
                        className={selectedField === field.id ? 'text-white/70 hover:text-white' : 'text-[#7a838b] hover:text-red-500'}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}

                  {/* Add Field Button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowFieldPalette(showFieldPalette === section.id ? null : section.id)}
                      className="w-full rounded-xl border-2 border-dashed border-[#e2e0db] py-3 text-sm text-[#7a838b] hover:border-[#35d0a0] hover:text-[#35d0a0] transition"
                    >
                      + Adicionar campo
                    </button>

                    {showFieldPalette === section.id && (
                      <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white rounded-xl shadow-lg border border-[#e2e0db] z-10">
                        <p className="text-xs font-semibold text-[#7a838b] mb-2">Escolha o tipo:</p>
                        <div className="grid grid-cols-3 gap-2">
                          {(Object.keys(fieldTypeLabels) as FieldType[]).map((type) => (
                            <button
                              key={type}
                              onClick={() => addField(section.id, type)}
                              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-[#f5f3f0] transition"
                            >
                              <span className="w-8 h-8 rounded-lg bg-[#0c2332] text-white flex items-center justify-center text-sm font-bold">
                                {fieldTypeIcons[type]}
                              </span>
                              <span className="text-xs text-[#5c6772]">{fieldTypeLabels[type]}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add Section Button */}
          <button
            onClick={addSection}
            className="w-full rounded-2xl border-2 border-dashed border-[#e2e0db] py-6 text-sm font-medium text-[#7a838b] hover:border-[#35d0a0] hover:text-[#35d0a0] transition"
          >
            + Adicionar seção
          </button>
        </div>

        {/* Properties Panel */}
        <div className="space-y-4">
          {selectedFieldData ? (
            <div className="rounded-2xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-[#0c2332]">Propriedades do campo</h3>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#7a838b]">Título</label>
                  <input
                    type="text"
                    value={selectedFieldData.field.label}
                    onChange={(e) => updateField(selectedFieldData.sectionId, selectedFieldData.field.id, { label: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#e2e0db] px-3 py-2 text-sm text-[#0c2332] focus:border-[#0c2332] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#7a838b]">Placeholder</label>
                  <input
                    type="text"
                    value={selectedFieldData.field.placeholder || ''}
                    onChange={(e) => updateField(selectedFieldData.sectionId, selectedFieldData.field.id, { placeholder: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#e2e0db] px-3 py-2 text-sm text-[#0c2332] focus:border-[#0c2332] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#7a838b]">Largura</label>
                  <select
                    value={selectedFieldData.field.width || 'full'}
                    onChange={(e) => updateField(selectedFieldData.sectionId, selectedFieldData.field.id, { width: e.target.value as 'full' | 'half' | 'third' })}
                    className="mt-1 w-full rounded-lg border border-[#e2e0db] px-3 py-2 text-sm text-[#0c2332] focus:border-[#0c2332] focus:outline-none"
                  >
                    <option value="full">100%</option>
                    <option value="half">50%</option>
                    <option value="third">33%</option>
                  </select>
                </div>

                {selectedFieldData.field.type === 'number' && (
                  <div>
                    <label className="block text-xs font-medium text-[#7a838b]">Unidade</label>
                    <input
                      type="text"
                      value={selectedFieldData.field.unit || ''}
                      onChange={(e) => updateField(selectedFieldData.sectionId, selectedFieldData.field.id, { unit: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-[#e2e0db] px-3 py-2 text-sm text-[#0c2332] focus:border-[#0c2332] focus:outline-none"
                      placeholder="Ex: kg, L/dia, h"
                    />
                  </div>
                )}

                {selectedFieldData.field.type === 'textarea' && (
                  <div>
                    <label className="block text-xs font-medium text-[#7a838b]">Linhas</label>
                    <input
                      type="number"
                      value={selectedFieldData.field.rows || 3}
                      onChange={(e) => updateField(selectedFieldData.sectionId, selectedFieldData.field.id, { rows: parseInt(e.target.value) })}
                      className="mt-1 w-full rounded-lg border border-[#e2e0db] px-3 py-2 text-sm text-[#0c2332] focus:border-[#0c2332] focus:outline-none"
                      min="1"
                      max="20"
                    />
                  </div>
                )}

                {selectedFieldData.field.type === 'boolean_conditional' && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-[#7a838b]">Label do detalhe</label>
                      <input
                        type="text"
                        value={selectedFieldData.field.conditionalLabel || ''}
                        onChange={(e) => updateField(selectedFieldData.sectionId, selectedFieldData.field.id, { conditionalLabel: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-[#e2e0db] px-3 py-2 text-sm text-[#0c2332] focus:border-[#0c2332] focus:outline-none"
                        placeholder="Ex: Detalhes"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#7a838b]">Placeholder do detalhe</label>
                      <input
                        type="text"
                        value={selectedFieldData.field.conditionalPlaceholder || ''}
                        onChange={(e) => updateField(selectedFieldData.sectionId, selectedFieldData.field.id, { conditionalPlaceholder: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-[#e2e0db] px-3 py-2 text-sm text-[#0c2332] focus:border-[#0c2332] focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {(selectedFieldData.field.type === 'select' || selectedFieldData.field.type === 'checkbox_group') && (
                  <div>
                    <label className="block text-xs font-medium text-[#7a838b] mb-2">Opções</label>
                    {selectedFieldData.field.options?.map((opt, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={opt.label}
                          onChange={(e) => {
                            const newOptions = [...(selectedFieldData.field.options || [])];
                            newOptions[i] = { ...opt, label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '_') };
                            updateField(selectedFieldData.sectionId, selectedFieldData.field.id, { options: newOptions });
                          }}
                          className="flex-1 rounded-lg border border-[#e2e0db] px-3 py-1 text-sm text-[#0c2332] focus:border-[#0c2332] focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            const newOptions = selectedFieldData.field.options?.filter((_, idx) => idx !== i);
                            updateField(selectedFieldData.sectionId, selectedFieldData.field.id, { options: newOptions });
                          }}
                          className="text-[#7a838b] hover:text-red-500"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newOptions = [...(selectedFieldData.field.options || []), { value: `opcao${Date.now()}`, label: 'Nova opção' }];
                        updateField(selectedFieldData.sectionId, selectedFieldData.field.id, { options: newOptions });
                      }}
                      className="text-xs text-[#35d0a0] hover:text-[#2eb48a]"
                    >
                      + Adicionar opção
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm text-center">
              <p className="text-sm text-[#7a838b]">Selecione um campo para editar suas propriedades</p>
            </div>
          )}

          {/* Actions */}
          <div className="rounded-2xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm space-y-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-xl bg-[#35d0a0] px-4 py-3 text-sm font-semibold text-[#0c2332] hover:bg-[#2eb48a] disabled:opacity-60"
            >
              {saving ? 'Salvando...' : 'Salvar template'}
            </button>
            <button
              onClick={() => setTemplate(defaultTemplate)}
              className="w-full rounded-xl border border-[#e2e0db] px-4 py-2 text-sm font-medium text-[#5c6772] hover:bg-[#f5f3f0]"
            >
              Restaurar padrão
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
