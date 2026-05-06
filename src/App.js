import React, { useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import NotificationConseils from './components/NotificationConseils';
import AudioActivator from './components/AudioActivator';
import WelcomeScreen from './pages/WelcomeScreen';
import Rappels from './pages/Rappels';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Conseils from './pages/Conseils';
import ForgotPassword from './pages/ForgotPassword';
import { getReminders, updateReminder } from './services/reminderService';
import alarmService from './services/alarmService';
import AuthService from './services/AuthService';

// Protection des routes
const PrivateRoute = ({ element }) => {
  const user = AuthService.getCurrentUser();
  return user ? element : <Navigate to="/login" />;
};

function App() {
  const handleAlarmTrigger = useCallback((reminder) => {
    alarmService.triggerAlarm(reminder, async (reminderId) => {
      await updateReminder(reminderId, { triggered: false });
      scheduleAllAlarms();
    });
  }, []);
  const scheduleAllAlarms = useCallback(() => {
    alarmService.clearAllTimeouts();
    const reminders = getReminders();
    reminders.filter(r => r.active).forEach(reminder => {
      alarmService.scheduleAlarm(reminder, handleAlarmTrigger);
    });
  }, [handleAlarmTrigger]);
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
    scheduleAllAlarms();
    const interval = setInterval(scheduleAllAlarms, 60000);
    return () => {
      clearInterval(interval);
      alarmService.clearAllTimeouts();
      alarmService.stopAlarm();
    };
  }, [scheduleAllAlarms]);

  return (
    <Router>
      <Navbar />
      <NotificationConseils />
      <AudioActivator />
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/conseils" element={<Conseils />} />
        {/* Routes protégées */}
        <Route path="/rappels" element={<PrivateRoute element={<Rappels />} />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
      </Routes>
    </Router>
  );
}

export default App;