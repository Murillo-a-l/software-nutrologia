import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { PatientList } from './pages/PatientList';
import { PatientForm } from './pages/PatientForm';
import { AssessmentForm } from './pages/AssessmentForm';
import { AssessmentDetail } from './pages/AssessmentDetail';
import { AppShell } from './layout/AppShell';
import { SystemDashboard } from './modules/dashboard/pages/SystemDashboard';
import { PatientDashboard } from './modules/patients/pages/PatientDashboard';
import { PatientHistoryPage } from './modules/patients/pages/PatientHistoryPage';
import { AssessmentWorkspace } from './modules/assessments/pages/AssessmentWorkspace';
import { AnthropometryPage } from './modules/anthropometry/pages/AnthropometryPage';
import { BioimpedancePage } from './modules/bioimpedance/pages/BioimpedancePage';
import { SkinfoldPage } from './modules/skinfold/pages/SkinfoldPage';
import { MetabolismPage } from './modules/metabolism/pages/MetabolismPage';
import { ReportsPage } from './modules/reports/pages/ReportsPage';
import { AiAssistantPage } from './modules/ai/pages/AiAssistantPage';
import { PersonalCenterPage } from './modules/personal/pages/PersonalCenterPage';
import { SettingsPage } from './modules/settings/pages/SettingsPage';
import { AnamnesisSettingsPage } from './modules/settings/pages/AnamnesisSettingsPage';
import { FormBuilderPage } from './modules/settings/pages/FormBuilderPage';
import { AnamnesisPage } from './modules/clinical/pages/AnamnesisPage';
import { ClinicalExamsPage } from './modules/clinical/pages/ClinicalExamsPage';
import { DiagnosticsPage } from './modules/clinical/pages/DiagnosticsPage';
import { PrescriptionsPage } from './modules/clinical/pages/PrescriptionsPage';
import { CaloricPlannerPage } from './modules/nutrition/pages/CaloricPlannerPage';
import { DietDesignerPage } from './modules/nutrition/pages/DietDesignerPage';
import { FoodDatabasePage } from './modules/nutrition/pages/FoodDatabasePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<SystemDashboard />} />
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patients/new" element={<PatientForm />} />
          <Route path="/patients/:id" element={<PatientDashboard />} />
          <Route path="/patients/:id/assessments/new" element={<AssessmentForm />} />
          <Route path="/patients/history" element={<PatientHistoryPage />} />
          <Route path="/assessments/:id" element={<AssessmentDetail />} />
          <Route path="/assessments/workspace" element={<AssessmentWorkspace />} />
          <Route path="/anthropometry" element={<AnthropometryPage />} />
          <Route path="/bioimpedance" element={<BioimpedancePage />} />
          <Route path="/skinfold" element={<SkinfoldPage />} />
          <Route path="/metabolism" element={<MetabolismPage />} />
          <Route path="/clinical/anamnesis" element={<AnamnesisPage />} />
          <Route path="/clinical/exams" element={<ClinicalExamsPage />} />
          <Route path="/clinical/diagnostics" element={<DiagnosticsPage />} />
          <Route path="/clinical/prescriptions" element={<PrescriptionsPage />} />
          <Route path="/nutrition/caloric-planning" element={<CaloricPlannerPage />} />
          <Route path="/nutrition/diets" element={<DietDesignerPage />} />
          <Route path="/nutrition/food-bank" element={<FoodDatabasePage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/ai" element={<AiAssistantPage />} />
          <Route path="/personal" element={<PersonalCenterPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/anamnesis" element={<AnamnesisSettingsPage />} />
          <Route path="/settings/form-builder" element={<FormBuilderPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
