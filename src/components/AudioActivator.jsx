// components/AudioActivator.jsx
import React, { useState, useEffect } from 'react';

const AudioActivator = () => {
  const [activated, setActivated] = useState(false);
  const [audioContext, setAudioContext] = useState(null);

  useEffect(() => {
    // Créer le contexte audio au chargement
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    setAudioContext(ctx);
    
    // Stocker globalement pour l'utiliser dans NotificationService
    window.audioContext = ctx;
    window.audioUnlocked = false;
    
    return () => {
      if (ctx.state !== 'closed') {
        ctx.close();
      }
    };
  }, []);

  const unlockAudio = async () => {
    if (audioContext && audioContext.state === 'suspended') {
      await audioContext.resume();
      window.audioUnlocked = true;
      
      // Jouer un son de confirmation
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);
      gain.gain.value = 0.3;
      osc.frequency.value = 880;
      osc.start();
      osc.stop(audioContext.currentTime + 0.3);
      
      setActivated(true);
      console.log('✅ Audio débloqué avec succès');
      
      // Optionnel : cacher le bouton après 3 secondes
      setTimeout(() => {
        const btn = document.querySelector('.audio-activator-btn');
        if (btn) btn.style.opacity = '0';
        setTimeout(() => setActivated(true), 500);
      }, 3000);
    }
  };

  if (activated && window.audioUnlocked) return null;

  return (
    <button
      className="audio-activator-btn"
      onClick={unlockAudio}
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 9999,
        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
        color: 'white',
        border: 'none',
        padding: '14px 24px',
        borderRadius: '50px',
        fontSize: '15px',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        animation: 'pulse 1.5s infinite',
        fontFamily: "'Nunito', sans-serif"
      }}
    >
      🔊 Activer le son pour les rappels
    </button>
  );
};

export default AudioActivator;