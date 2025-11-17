import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { PatientList } from './pages/PatientList';
import { PatientForm } from './pages/PatientForm';
import { AssessmentForm } from './pages/AssessmentForm';
import { AssessmentDetail } from './pages/AssessmentDetail';
import { AppShell } from './layout/AppShell';
import { SystemDashboard } from './modules/dashboard/pages/SystemDashboard';
import { PatientDashboard } from './modules/patients/pages/PatientDashboard';
import { AssessmentWorkspace } from './modules/assessments/pages/AssessmentWorkspace';
import { AnthropometryPage } from './modules/anthropometry/pages/AnthropometryPage';
import { BioimpedancePage } from './modules/bioimpedance/pages/BioimpedancePage';
import { SkinfoldPage } from './modules/skinfold/pages/SkinfoldPage';
import { MetabolismPage } from './modules/metabolism/pages/MetabolismPage';
import { DietPlanningPage } from './modules/diet/pages/DietPlanningPage';
import { ReportsPage } from './modules/reports/pages/ReportsPage';
import { AiAssistantPage } from './modules/ai/pages/AiAssistantPage';
import { PersonalCenterPage } from './modules/personal/pages/PersonalCenterPage';
import { SettingsPage } from './modules/settings/pages/SettingsPage';

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
          <Route path="/assessments/:id" element={<AssessmentDetail />} />
          <Route path="/assessments/workspace" element={<AssessmentWorkspace />} />
          <Route path="/anthropometry" element={<AnthropometryPage />} />
          <Route path="/bioimpedance" element={<BioimpedancePage />} />
          <Route path="/skinfold" element={<SkinfoldPage />} />
          <Route path="/metabolism" element={<MetabolismPage />} />
          <Route path="/diet" element={<DietPlanningPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/ai" element={<AiAssistantPage />} />
          <Route path="/personal" element={<PersonalCenterPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
