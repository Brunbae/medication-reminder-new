// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import NotificationConseils from './components/NotificationConseils';
import AudioActivator from './components/AudioActivator';
import WelcomeScreen from './pages/WelcomeScreen';
import Rappels from './pages/Rappels';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Conseils from './pages/Conseils';

function App() {
  return (
    <Router 
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Navbar />
      <NotificationConseils />
      <AudioActivator />
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/rappels" element={<Rappels />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/conseils" element={<Conseils />} />
      </Routes>
    </Router>
  );
}

export default App;