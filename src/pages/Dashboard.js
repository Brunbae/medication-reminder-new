import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getReminders } from '../services/reminderService';
import './Dashboard.css';

const Dashboard = () => {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    setReminders(getReminders());
  }, []);

  const handleDelete = (index) => {
    const updated = reminders.filter((_, i) => i !== index);
    localStorage.setItem('reminders', JSON.stringify(updated));
    setReminders(updated);
  };

  const getBadge = (heure) => {
    const h = parseInt(heure?.split(':')[0] || 0);
    if (h < 12) return { label: 'Matin', cls: 'badge-blue' };
    if (h < 18) return { label: 'Après-midi', cls: 'badge-orange' };
    return { label: 'Soir', cls: 'badge-green' };
  };

  const colors = ['#1d4ed8', '#15803d', '#c2410c', '#7c3aed', '#be185d'];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Mes Rappels</h1>
          <p>Suivez vos prises du jour</p>
        </div>
        <Link to="/rappels" className="add-btn">+ Nouveau rappel</Link>
      </div>

      <div className="stats-row">
        <div className="stat-card blue">
          <div className="stat-value">{reminders.length}</div>
          <div className="stat-label">Rappels actifs</div>
        </div>
        <div className="stat-card green">
          <div className="stat-value">{reminders.length}/jour</div>
          <div className="stat-label">Prises programmées</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-value">100%</div>
          <div className="stat-label">Taux de suivi</div>
        </div>
      </div>

      <div className="reminder-list">
        {reminders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💊</div>
            <p>Aucun rappel programmé.</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>
              Appuyez sur "+ Nouveau rappel" pour commencer.
            </p>
          </div>
        ) : (
          reminders.map((reminder, index) => {
            const badge = getBadge(reminder.heure);
            return (
              <div key={index} className="reminder-item">
                <div
                  className="color-bar"
                  style={{ background: colors[index % colors.length] }}
                />
                <div className="reminder-info">
                  <div className="reminder-name">{reminder.medicament}</div>
                  <div className="reminder-detail">
                    {reminder.frequence} · {reminder.heure}
                  </div>
                </div>
                <div className="reminder-right">
                  <div className="reminder-time">{reminder.heure}</div>
                  <span className={`badge ${badge.cls}`}>{badge.label}</span>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(index)}
                  title="Supprimer"
                >
                  🗑
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Dashboard;
