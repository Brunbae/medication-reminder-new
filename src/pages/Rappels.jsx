import React, { useState, useEffect, useCallback } from 'react';
import { addReminder, getReminders, updateReminder } from '../services/reminderService';
import alarmService from '../services/alarmService';
import styles from './Rappels.module.css';

const Rappels = () => {
  const [medicament, setMedicament] = useState('');
  const [heure, setHeure] = useState('');
  const [frequence, setFrequence] = useState('');
  const [dosage, setDosage] = useState('');
  const [success, setSuccess] = useState(false);
  const [remindersList, setRemindersList] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [message, setMessage] = useState('');

  const enableAudioAndTest = async () => {
    const ok = await alarmService.enableAudio();
    if (ok) {
      setAudioEnabled(true);
      await alarmService.testSound();
      setMessage('✅ Son activé ! Vous recevrez les alarmes');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleAlarmTrigger = useCallback((reminder) => {
    alarmService.triggerAlarm(reminder, async (reminderId) => {
      await updateReminder(reminderId, { triggered: false });
      loadReminders();
    });
  }, []);

  const loadReminders = () => {
    const reminders = getReminders();
    setRemindersList(reminders);
    return reminders;
  };

  const scheduleAllAlarms = useCallback(() => {
    alarmService.clearAllTimeouts();
    remindersList.filter(r => r.active).forEach(reminder => {
      alarmService.scheduleAlarm(reminder, handleAlarmTrigger);
    });
  }, [remindersList, handleAlarmTrigger]);

  useEffect(() => {
    if (Notification.permission === 'default') Notification.requestPermission();
    loadReminders();
    return () => { alarmService.clearAllTimeouts(); alarmService.stopAlarm(); };
  }, []);

  useEffect(() => { scheduleAllAlarms(); }, [scheduleAllAlarms]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newReminder = {
      medicament, heure, frequence, dosage,
      active: true, triggered: false,
      lastTriggered: null, createdAt: new Date().toISOString()
    };
    addReminder(newReminder);
    if (audioEnabled) await alarmService.playConfirmation();
    loadReminders();
    setMessage(`✅ Rappel ajouté pour ${medicament} à ${heure}`);
    setMedicament(''); setHeure(''); setFrequence(''); setDosage('');
    setSuccess(true);
    setTimeout(() => { setSuccess(false); setMessage(''); }, 3000);
  };

  return (
    <div className={styles.rappelsContainer}>
      <div className={styles.rappelsCard}>
        <div className={styles.rappelsHeader}>
          <div className={styles.rappelsIcon}>💊</div>
          <h1>Programmer un rappel</h1>
          <p>Ajoutez un médicament et son horaire de prise</p>
        </div>

        {!audioEnabled ? (
          <button onClick={enableAudioAndTest} className={styles.enableAudioBtn}>
            🔔 ACTIVER LE SON DES ALARMES (cliquez ici d'abord)
          </button>
        ) : (
          <div className={styles.audioEnabledBadge}>
            ✅ Son activé - Les alarmes fonctionneront
          </div>
        )}

        {message && <div className={styles.infoMessage}>{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Nom du médicament</label>
            <input
              type="text"
              value={medicament}
              onChange={(e) => setMedicament(e.target.value)}
              placeholder="Exemple : Doliprane 500mg"
              required
            />
          </div>

          <div className={styles.formRow2}>
            <div className={styles.formGroup}>
              <label>Heure de prise</label>
              <input
                type="time"
                value={heure}
                onChange={(e) => setHeure(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Fréquence</label>
              <select
                value={frequence}
                onChange={(e) => setFrequence(e.target.value)}
                required
              >
                <option value="">Choisir...</option>
                <option value="quotidien">Quotidien</option>
                <option value="hebdomadaire">Hebdomadaire</option>
                <option value="mensuel">Mensuel</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Dosage (optionnel)</label>
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="Exemple : 1 comprimé"
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={!audioEnabled}>
            Ajouter le rappel
          </button>

          {success && <div className={styles.successBanner}>✅ Rappel ajouté !</div>}
        </form>

        {remindersList.length > 0 && (
          <div className={styles.remindersList}>
            <h3>📋 Vos rappels :</h3>
            {remindersList.map(reminder => (
              <div key={reminder.id} className={styles.reminderItem}>
                <strong>{reminder.medicament}</strong>
                <span>⏰ {reminder.heure}</span>
                <span>🔄 {reminder.frequence}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rappels;
