import React, { useState, useEffect } from 'react';
import styles from './NotificationConseils.module.css';

const tousLesConseils = [
  { emoji: '💊', categorie: 'Médicaments', texte: 'Prenez vos médicaments à la même heure chaque jour.' },
  { emoji: '💊', categorie: 'Médicaments', texte: 'Ne jamais arrêter un traitement sans avis médical.' },
  { emoji: '🥗', categorie: 'Alimentation', texte: "Buvez au moins 8 verres d'eau par jour." },
  { emoji: '🥗', categorie: 'Alimentation', texte: 'Mangez des fruits et légumes à chaque repas.' },
  { emoji: '🚶', categorie: 'Exercice', texte: 'Marchez 30 minutes par jour à votre rythme.' },
  { emoji: '😴', categorie: 'Sommeil', texte: 'Couchez-vous à la même heure chaque soir.' },
  { emoji: '🧘', categorie: 'Bien-être', texte: 'Respirez profondément : inspirez 4s, expirez 6s.' },
  { emoji: '🌿', categorie: 'Hygiène', texte: 'Consultez votre médecin tous les 6 mois.' },
];

function NotificationConseils() {
  const [visible, setVisible] = useState(false);
  const [conseil, setConseil] = useState(tousLesConseils[0]);

  useEffect(() => {
    const afficher = () => {
      const idx = Math.floor(Math.random() * tousLesConseils.length);
      setConseil(tousLesConseils[idx]);
      setVisible(true);
      setTimeout(() => setVisible(false), 6000);
    };

    const premier = setTimeout(afficher, 3000);
    const interval = setInterval(afficher, 30000);

    return () => {
      clearTimeout(premier);
      clearInterval(interval);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={styles.notifToast}>
      <div className={styles.notifIcon}>{conseil.emoji}</div>
      <div className={styles.notifContent}>
        <span className={styles.notifCategorie}>{conseil.categorie}</span>
        <p className={styles.notifTexte}>{conseil.texte}</p>
      </div>
      <button className={styles.notifClose} onClick={() => setVisible(false)}>✕</button>
    </div>
  );
}

export default NotificationConseils;