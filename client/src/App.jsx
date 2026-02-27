import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MedicineList from './pages/MedicineList';
import MedicineForm from './pages/MedicineForm';
import StockPrediction from './pages/StockPrediction';
import Billing from './pages/Billing';
import SupplierList from './pages/SupplierList';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import SmartPrescription from './pages/SmartPrescription';
import ExpiryRisk from './pages/ExpiryRisk';
import SymptomAnalyzer from './pages/SymptomAnalyzer';
import VoiceAssistant from './components/VoiceAssistant';
import PatientHealth from './pages/PatientHealth';
import GlobalAnalytics from './pages/GlobalAnalytics';
import PharmaChatbot from './components/PharmaChatbot';
import Subscription from './pages/Subscription';
import DietaryAdvisor from './pages/DietaryAdvisor';

function App() {
  return (
    <div className="App font-sans text-white bg-[#020617] min-h-screen">
      <Navbar />
      <VoiceAssistant />
      <PharmaChatbot />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/medicines" element={<MedicineList />} />
        <Route path="/add-medicine" element={<MedicineForm />} />
        <Route path="/predictions" element={<StockPrediction />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/suppliers" element={<SupplierList />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/smart-rx" element={<SmartPrescription />} />
        <Route path="/smart-prescription" element={<SmartPrescription />} />
        <Route path="/expiry-risk" element={<ExpiryRisk />} />
        <Route path="/patient-care" element={<PatientHealth />} />
        <Route path="/global-analytics" element={<GlobalAnalytics />} />
        <Route path="/ai-diagnosis" element={<SymptomAnalyzer />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/dietary-advisor" element={<DietaryAdvisor />} />
      </Routes>
    </div>
  );
}

export default App;
