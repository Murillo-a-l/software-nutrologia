import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { PatientList } from './pages/PatientList';
import { PatientForm } from './pages/PatientForm';
import { PatientDetail } from './pages/PatientDetail';
import { AssessmentForm } from './pages/AssessmentForm';
import { AssessmentDetail } from './pages/AssessmentDetail';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Patients */}
        <Route path="/patients" element={<PatientList />} />
        <Route path="/patients/new" element={<PatientForm />} />
        <Route path="/patients/:id" element={<PatientDetail />} />

        {/* Assessments */}
        <Route path="/patients/:id/assessments/new" element={<AssessmentForm />} />
        <Route path="/assessments/:id" element={<AssessmentDetail />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
