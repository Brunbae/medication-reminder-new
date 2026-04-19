import React, { useState, useEffect, useRef } from 'react';
import './NotificationConseils.css';

const tousLesConseils = [
  { emoji: '💊', categorie: 'Médicaments', texte: 'Prenez vos médicaments à la même heure chaque jour.' },
  { emoji: '💊', categorie: 'Médicaments', texte: 'Ne jamais arrêter un traitement sans avis médical.' },
  { emoji: '🥗', categorie: 'Alimentation', texte: 'Buvez au moins 8 verres d\'eau par jour.' },
  { emoji: '🥗', categorie: 'Alimentation', texte: 'Mangez des fruits et légumes à chaque repas.' },
  { emoji: '🚶', categorie: 'Exercice', texte: 'Marchez 30 minutes par jour à votre rythme.' },
  { emoji: '😴', categorie: 'Sommeil', texte: 'Couchez-vous à la même heure chaque soir.' },
  { emoji: '🧘', categorie: 'Bien-être', texte: 'Respirez profondément : inspirez 4s, expirez 6s.' },
  { emoji: '🌿', categorie: 'Hygiène', texte: 'Consultez votre médecin tous les 6 mois.' },
];

function NotificationConseils() {
  const [visible, setVisible] = useState(false);
  const [conseil, setConseil] = useState(tousLesConseils[0]);
  const audioCtxRef = useRef(null);
  const debloque = useRef(false);

  // Débloque l'audio au premier clic de l'utilisateur
  useEffect(() => {
    const debloquer = () => {
      if (!debloque.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        debloque.current = true;
      }
    };
    document.addEventListener('click', debloquer, { once: true });
    return () => document.removeEventListener('click', debloquer);
  }, []);

  const jouerSon = () => {
    if (!audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.setValueAtTime(660, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  };

  useEffect(() => {
    const afficher = () => {
      const idx = Math.floor(Math.random() * tousLesConseils.length);
      setConseil(tousLesConseils[idx]);
      setVisible(true);
      jouerSon();
      setTimeout(() => setVisible(false), 5000);
    };

    afficher();
    const interval = setInterval(afficher, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="notif-toast">
      <div className="notif-icon">{conseil.emoji}</div>
      <div className="notif-content">
        <span className="notif-categorie">{conseil.categorie}</span>
        <p className="notif-texte">{conseil.texte}</p>
      </div>
      <button className="notif-close" onClick={() => setVisible(false)}>✕</button>
    </div>
  );
}

export default NotificationConseils;