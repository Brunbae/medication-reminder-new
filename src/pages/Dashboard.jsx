import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getReminders, deleteReminder } from '../services/reminderService';
import styles from './Dashboard.module.css';

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
    <div className={styles.dvRoot}>

      <div className={styles.dvTop}>
        <div className={styles.dvClock}>{formatClock(currentTime)}</div>
        <div className={styles.dvDate}>{formatDate(currentTime)}</div>
      </div>

      <div className={styles.dvTitleRow}>
        <h1 className={styles.dvTitle}>💊 Mes Médicaments</h1>
        <Link to="/rappels" className={styles.dvBtnAdd}>＋ Ajouter</Link>
      </div>

      <div className={styles.dvSummary}>
        <div className={`${styles.dvSummaryItem} ${styles.dvSummaryBlue}`}>
          <div className={styles.dvSummaryNum}>{total}</div>
          <div className={styles.dvSummaryLbl}>Médicaments<br/>programmés</div>
        </div>
        <div className={`${styles.dvSummaryItem} ${styles.dvSummaryGreen}`}>
          <div className={styles.dvSummaryNum}>{pris}</div>
          <div className={styles.dvSummaryLbl}>Déjà<br/>pris aujourd'hui</div>
        </div>
        <div className={`${styles.dvSummaryItem} ${styles.dvSummaryOrange}`}>
          <div className={styles.dvSummaryNum}>{total - pris}</div>
          <div className={styles.dvSummaryLbl}>Encore<br/>à prendre</div>
        </div>
      </div>

      {reminders.length === 0 ? (
        <div className={styles.dvEmpty}>
          <div className={styles.dvEmptyIcon}>💊</div>
          <p className={styles.dvEmptyText}>Vous n'avez pas encore de rappel.</p>
          <p className={styles.dvEmptySub}>Appuyez sur le bouton vert pour en ajouter un.</p>
          <Link to="/rappels" className={styles.dvBtnBigAdd}>＋ Ajouter un médicament</Link>
        </div>
      ) : (
        <div className={styles.dvCards}>
          {reminders.map((reminder) => {
            const moment = getMoment(reminder.heure);
            const isTaken = takenIds.includes(reminder.id);
            return (
              <div
                key={reminder.id}
                className={`${styles.dvCard} ${isTaken ? styles.dvCardTaken : ''}`}
                style={{ borderLeft: `8px solid ${moment.border}`, background: isTaken ? '#f0fdf4' : '#fff' }}
              >
                <div className={styles.dvCardMoment} style={{ background: moment.color, color: moment.text }}>
                  {moment.label}
                </div>

                <div className={styles.dvCardContent}>
                  <div className={styles.dvCardName}>
                    {isTaken && <span className={styles.dvCheck}>✅ </span>}
                    {reminder.medicament}
                  </div>
                  {reminder.dosage && (
                    <div className={styles.dvCardDosage}>💉 Dosage : <strong>{reminder.dosage}</strong></div>
                  )}
                  {reminder.frequence && (
                    <div className={styles.dvCardFreq}>🔄 {reminder.frequence}</div>
                  )}
                  <div className={styles.dvCardHeure} style={{ color: moment.text }}>
                    ⏰ À prendre à <strong>{formatHeure(reminder.heure)}</strong>
                  </div>
                  {isTaken && (
                    <div className={styles.dvCardTakenMsg}>✅ Vous avez pris ce médicament aujourd'hui. Bravo !</div>
                  )}
                </div>

                <div className={styles.dvCardActions}>
                  {!isTaken ? (
                    <button className={styles.dvBtnTaken} onClick={() => handleTaken(reminder.id)}>
                      ✅ J'ai pris ce médicament
                    </button>
                  ) : (
                    <div className={styles.dvBtnDone}>✅ Pris !</div>
                  )}
                  <button className={styles.dvBtnDelete} onClick={() => handleDelete(reminder.id)}>
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
