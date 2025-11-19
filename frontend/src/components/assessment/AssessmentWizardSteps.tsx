interface WizardStep {
  title: string;
  subtitle?: string;
  optional?: boolean;
}

interface AssessmentWizardStepsProps {
  steps: WizardStep[];
  currentStep: number;
}

export function AssessmentWizardSteps({ steps, currentStep }: AssessmentWizardStepsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        {steps.map((step, index) => (
          <StepItem
            key={step.title}
            index={index}
            title={step.title}
            subtitle={step.subtitle}
            optional={step.optional}
            status={getStepStatus(index, currentStep)}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
      <p className="text-xs text-muted">
        Passo {currentStep + 1} de {steps.length}
      </p>
    </div>
  );
}

interface StepItemProps extends WizardStep {
  index: number;
  status: 'complete' | 'current' | 'upcoming';
  isLast: boolean;
}

function StepItem({ index, title, subtitle, optional, status, isLast }: StepItemProps) {
  const baseCircle =
    status === 'complete'
      ? 'bg-emerald-500 text-white'
      : status === 'current'
        ? 'bg-primary text-white'
        : 'bg-gray-200 text-gray-600';

  const connector =
    status === 'complete'
      ? 'bg-emerald-200'
      : status === 'current'
        ? 'bg-primary/40'
        : 'bg-gray-200';

  return (
    <div className="flex items-center gap-4">
      <div className={`flex items-center gap-3`}
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${baseCircle}`}>
          {index + 1}
        </div>
        <div>
          <p className="text-sm font-semibold text-primary">
            {title}
            {optional && <span className="ml-2 text-xs font-normal text-muted">(Opcional)</span>}
          </p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
      {!isLast && <div className={`hidden lg:block h-0.5 w-16 rounded-full ${connector}`} />}
    </div>
  );
}

function getStepStatus(stepIndex: number, currentStep: number): 'complete' | 'current' | 'upcoming' {
  if (stepIndex < currentStep) return 'complete';
  if (stepIndex === currentStep) return 'current';
  return 'upcoming';
}

interface WizardStep {
  title: string;
  subtitle?: string;
  optional?: boolean;
}

interface AssessmentWizardStepsProps {
  steps: WizardStep[];
  currentStep: number;
}

export function AssessmentWizardSteps({ steps, currentStep }: AssessmentWizardStepsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        {steps.map((step, index) => (
          <StepItem
            key={step.title}
            index={index}
            title={step.title}
            subtitle={step.subtitle}
            optional={step.optional}
            status={getStepStatus(index, currentStep)}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
      <p className="text-xs text-[#7a838b]">
        Passo {currentStep + 1} de {steps.length}
      </p>
    </div>
  );
}

interface StepItemProps extends WizardStep {
  index: number;
  status: 'complete' | 'current' | 'upcoming';
  isLast: boolean;
}

function StepItem({ index, title, subtitle, optional, status, isLast }: StepItemProps) {
  const baseCircle =
    status === 'complete'
      ? 'bg-[#35d0a0] text-white'
      : status === 'current'
        ? 'bg-[#0c2332] text-white'
        : 'bg-[#e2e0db] text-[#7a838b]';

  const connector =
    status === 'complete'
      ? 'bg-[#35d0a0]/40'
      : status === 'current'
        ? 'bg-[#0c2332]/30'
        : 'bg-[#e2e0db]';

  return (
    <div className="flex items-center gap-4">
      <div className={`flex items-center gap-3`}
      >
        <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${baseCircle}`}>
          {index + 1}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#0c2332]">
            {title}
            {optional && <span className="ml-2 text-xs font-normal text-[#7a838b]">(Opcional)</span>}
          </p>
          {subtitle && <p className="text-xs text-[#7a838b]">{subtitle}</p>}
        </div>
      </div>
      {!isLast && <div className={`hidden h-0.5 w-16 rounded-full lg:block ${connector}`} />}
    </div>
  );
}

function getStepStatus(stepIndex: number, currentStep: number): 'complete' | 'current' | 'upcoming' {
  if (stepIndex < currentStep) return 'complete';
  if (stepIndex === currentStep) return 'current';
  return 'upcoming';
}
