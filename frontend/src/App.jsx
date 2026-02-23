import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import RegisterPage from './Pages/Register';
import SignInPage from './Pages/SignIn';
import ManagerDashboard from './Pages/ManagerDashboard';
import Workers from './Pages/Workers';
import Ratings from './Pages/Ratings';
import Settings from './Pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/workers" element={<Workers />} />
        <Route path="/ratings" element={<Ratings />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;