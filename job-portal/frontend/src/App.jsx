import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth';
import { Navbar } from './components';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Auth from './pages/Auth';
import Candidate from './pages/Candidate';
import Company from './pages/Company';
import JobForm from './pages/JobForm';
import Dashboard from './pages/Dashboard';

function Guard({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return user.role === role ? children : <Navigate to="/" />;
}

export default function App() {
  const C = r => ({ role: r });
  return <>
    <Navbar />
    <main className="container">
      <Routes>
        <Route path="/" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/register" element={<Auth mode="register" />} />
        <Route path="/candidate" element={<Guard {...C('CANDIDATE')}><Candidate /></Guard>} />
        <Route path="/recruiter" element={<Guard {...C('RECRUITER')}><Dashboard /></Guard>} />
        <Route path="/recruiter/company" element={<Guard {...C('RECRUITER')}><Company /></Guard>} />
        <Route path="/recruiter/jobs/new" element={<Guard {...C('RECRUITER')}><JobForm /></Guard>} />
        <Route path="/recruiter/jobs/:id/edit" element={<Guard {...C('RECRUITER')}><JobForm /></Guard>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </main>
  </>;
}
