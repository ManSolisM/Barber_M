import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import LoginPage from './pages/LoginPage';
import OwnerDashboard from './pages/OwnerDashboard';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/book" element={<BookingPage />} />
              <Route path="/my-appointments" element={<MyAppointmentsPage />} />
              <Route path="/owner/login" element={<LoginPage />} />
              <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;