// components/AudioActivator.jsx avec bouton visible
import React, { useState } from 'react';

const AudioActivator = () => {
  const [activated, setActivated] = useState(false);

  const unlockAudio = async () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    await audioCtx.resume();
    
    // Jouer un petit son de confirmation
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    gain.gain.value = 0.3;
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
    
    setActivated(true);
    console.log('✅ Audio activé');
  };

  if (activated) return null;

  return (
    <button
      onClick={unlockAudio}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
        color: 'white',
        border: 'none',
        padding: '12px 20px',
        borderRadius: '50px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        animation: 'pulse 1s infinite'
      }}
    >
      🔓 Activer le son
    </button>
  );
};

export default AudioActivator;