import React, { useEffect, useCallback } from 'react';
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
import { getReminders, updateReminder } from './services/reminderService';
import alarmService from './services/alarmService';

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