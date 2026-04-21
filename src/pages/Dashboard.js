import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getReminders, deleteReminder } from '../services/reminderService';
import './Dashboard.css';

const Dashboard = () => {
  const [reminders, setReminders] = useState([]);
  const [takenIds, setTakenIds] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setReminders(getReminders());
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  const handleDelete = (id) => {
    deleteReminder(id);
    setReminders(getReminders());
  };

  const handleTaken = (id) => {
    setTakenIds(prev => [...prev, id]);
  };

  const getMoment = (heure) => {
    const h = parseInt(heure?.split(':')[0] || 0);
    if (h >= 5  && h < 12) return { label: '🌅 Matin',      color: '#fff8e1', border: '#f59e0b', text: '#b45309' };
    if (h >= 12 && h < 14) return { label: '☀️ Midi',        color: '#fff3e0', border: '#f97316', text: '#c2410c' };
    if (h >= 14 && h < 18) return { label: '🌤 Après-midi',  color: '#e8f5e9', border: '#22c55e', text: '#15803d' };
    if (h >= 18 && h < 21) return { label: '🌆 Soir',        color: '#e8eaf6', border: '#6366f1', text: '#3730a3' };
    return                         { label: '🌙 Nuit',        color: '#ede9fe', border: '#8b5cf6', text: '#5b21b6' };
  };

  const formatHeure = (heure) => {
    if (!heure) return '--:--';
    const [h, m] = heure.split(':');
    const hNum = parseInt(h);
    const suffix = hNum < 12 ? 'AM' : 'PM';
    const h12 = hNum === 0 ? 12 : hNum > 12 ? hNum - 12 : hNum;
    return `${h12}h${m}`;
  };

  const formatDate = (d) => d.toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const formatClock = (d) => d.toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit'
  });

  const pris = takenIds.length;
  const total = reminders.length;

  return (
    <div className="dv-root">

      {/* HORLOGE EN HAUT */}
      <div className="dv-top">
        <div className="dv-clock">{formatClock(currentTime)}</div>
        <div className="dv-date">{formatDate(currentTime)}</div>
      </div>

      {/* TITRE */}
      <div className="dv-title-row">
        <h1 className="dv-title">💊 Mes Médicaments</h1>
        <Link to="/rappels" className="dv-btn-add">＋ Ajouter</Link>
      </div>

      {/* RÉSUMÉ */}
      <div className="dv-summary">
        <div className="dv-summary-item dv-summary-blue">
          <div className="dv-summary-num">{total}</div>
          <div className="dv-summary-lbl">Médicaments<br/>programmés</div>
        </div>
        <div className="dv-summary-item dv-summary-green">
          <div className="dv-summary-num">{pris}</div>
          <div className="dv-summary-lbl">Déjà<br/>pris aujourd'hui</div>
        </div>
        <div className="dv-summary-item dv-summary-orange">
          <div className="dv-summary-num">{total - pris}</div>
          <div className="dv-summary-lbl">Encore<br/>à prendre</div>
        </div>
      </div>

      {/* LISTE */}
      {reminders.length === 0 ? (
        <div className="dv-empty">
          <div className="dv-empty-icon">💊</div>
          <p className="dv-empty-text">Vous n'avez pas encore de rappel.</p>
          <p className="dv-empty-sub">Appuyez sur le bouton vert pour en ajouter un.</p>
          <Link to="/rappels" className="dv-btn-big-add">＋ Ajouter un médicament</Link>
        </div>
      ) : (
        <div className="dv-cards">
          {reminders.map((reminder) => {
            const moment = getMoment(reminder.heure);
            const isTaken = takenIds.includes(reminder.id);
            return (
              <div
                key={reminder.id}
                className={`dv-card ${isTaken ? 'dv-card--taken' : ''}`}
                style={{ borderLeft: `8px solid ${moment.border}`, background: isTaken ? '#f0fdf4' : '#fff' }}
              >
                {/* MOMENT (Matin / Soir etc) */}
                <div className="dv-card-moment" style={{ background: moment.color, color: moment.text }}>
                  {moment.label}
                </div>

                {/* CONTENU */}
                <div className="dv-card-content">
                  <div className="dv-card-name">
                    {isTaken && <span className="dv-check">✅ </span>}
                    {reminder.medicament}
                  </div>

                  {reminder.dosage && (
                    <div className="dv-card-dosage">
                      💉 Dosage : <strong>{reminder.dosage}</strong>
                    </div>
                  )}

                  {reminder.frequence && (
                    <div className="dv-card-freq">
                      🔄 {reminder.frequence}
                    </div>
                  )}

                  <div className="dv-card-heure" style={{ color: moment.text }}>
                    ⏰ À prendre à <strong>{formatHeure(reminder.heure)}</strong>
                  </div>

                  {isTaken && (
                    <div className="dv-card-taken-msg">
                      ✅ Vous avez pris ce médicament aujourd'hui. Bravo !
                    </div>
                  )}
                </div>

                {/* BOUTONS */}
                <div className="dv-card-actions">
                  {!isTaken ? (
                    <button
                      className="dv-btn-taken"
                      onClick={() => handleTaken(reminder.id)}
                    >
                      ✅ J'ai pris ce médicament
                    </button>
                  ) : (
                    <div className="dv-btn-done">✅ Pris !</div>
                  )}
                  <button
                    className="dv-btn-delete"
                    onClick={() => handleDelete(reminder.id)}
                  >
                    🗑 Supprimer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;