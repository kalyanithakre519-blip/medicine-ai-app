import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import VoiceAssistant from './components/VoiceAssistant';
import PharmaChatbot from './components/PharmaChatbot';

// Lazy loading all pages to drastically speed up initial load time on laptop/mobile
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const MedicineList = React.lazy(() => import('./pages/MedicineList'));
const MedicineForm = React.lazy(() => import('./pages/MedicineForm'));
const StockPrediction = React.lazy(() => import('./pages/StockPrediction'));
const Billing = React.lazy(() => import('./pages/Billing'));
const SupplierList = React.lazy(() => import('./pages/SupplierList'));
const Reports = React.lazy(() => import('./pages/Reports'));
const Profile = React.lazy(() => import('./pages/Profile'));
const SmartPrescription = React.lazy(() => import('./pages/SmartPrescription'));
const ExpiryRisk = React.lazy(() => import('./pages/ExpiryRisk'));
const SymptomAnalyzer = React.lazy(() => import('./pages/SymptomAnalyzer'));
const PatientHealth = React.lazy(() => import('./pages/PatientHealth'));
const GlobalAnalytics = React.lazy(() => import('./pages/GlobalAnalytics'));
const Subscription = React.lazy(() => import('./pages/Subscription'));
const DietaryAdvisor = React.lazy(() => import('./pages/DietaryAdvisor'));

const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-[80vh]">
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-indigo-400 font-semibold animate-pulse">Loading Platform...</p>
    </div>
  </div>
);

function App() {
  return (
    <div className="App font-sans text-white bg-[#020617] min-h-screen">
      <Navbar />
      <VoiceAssistant />
      <PharmaChatbot />
      <Suspense fallback={<LoadingScreen />}>
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
      </Suspense>
    </div>
  );
}

export default App;
