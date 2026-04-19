// pages/Dashboard.js - VERSION CORRIGÉE
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getReminders, updateReminder, deleteReminder } from '../services/reminderService';
import NotificationService from '../services/notificationService';
import './Dashboard.css';

const Dashboard = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }

    loadReminders();
    
    intervalRef.current = setInterval(() => {
      checkReminderTimes();
    }, 60000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const loadReminders = () => {
    try {
      const allReminders = getReminders();
      const activeReminders = allReminders.filter(r => r.active !== false);
      setReminders(activeReminders);
    } catch (error) {
      console.error("Erreur chargement rappels:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkReminderTimes = () => {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    reminders.forEach(reminder => {
      if (reminder.time === currentTime && !reminder.triggered) {
        NotificationService.showMedicationReminder(
          reminder.medicationName,
          reminder.dosage,
          reminder.instructions,
          reminder.id
        );
        
        updateReminder(reminder.id, { 
          triggered: true,
          lastTriggered: new Date().toISOString()
        });
        
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const timeUntilTomorrow = tomorrow - now;
        
        setTimeout(() => {
          updateReminder(reminder.id, { triggered: false });
          loadReminders();
        }, timeUntilTomorrow);
      }
    });
  };

  const markAsTaken = (id) => {
    NotificationService.markReminderAsTaken(id);
    updateReminder(id, { 
      triggered: false,
      lastTaken: new Date().toISOString()
    });
    alert("✅ Médicament pris ! Prochain rappel demain à la même heure.");
    loadReminders();
  };

  const deleteReminderHandler = (id, medicationName) => {
    if (window.confirm(`Supprimer le rappel pour ${medicationName} ?`)) {
      deleteReminder(id);
      loadReminders();
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">⏳ Chargement des rappels...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📋 Mes Rappels de Médicaments</h1>
        <Link to="/rappels" className="add-btn">
          + Ajouter un rappel
        </Link>
      </div>
      
      <div className="reminders-list">
        {reminders.length === 0 ? (
          <div className="empty-state">
            <p>🎯 Aucun rappel pour le moment</p>
            <Link to="/rappels" className="empty-add-btn">
              Créer mon premier rappel
            </Link>
          </div>
        ) : (
          reminders.map(reminder => (
            <div key={reminder.id} className={`reminder-card ${reminder.triggered ? 'triggered' : ''}`}>
              <div className="reminder-info">
                <h3>💊 {reminder.medicationName}</h3>
                <p className="dosage">Dosage: {reminder.dosage}</p>
                <p className="time">⏰ Heure: {reminder.time}</p>
                {reminder.instructions && (
                  <p className="instructions">📋 {reminder.instructions}</p>
                )}
                {reminder.triggered && (
                  <p className="warning">⚠️ Rappel en cours !</p>
                )}
              </div>
              <div className="reminder-actions">
                <button 
                  onClick={() => markAsTaken(reminder.id)}
                  className="take-btn"
                >
                  ✅ J'ai pris
                </button>
                <button 
                  onClick={() => deleteReminderHandler(reminder.id, reminder.medicationName)}
                  className="delete-btn"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
