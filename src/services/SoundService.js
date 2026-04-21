class SoundService {
  constructor() {
    this.audioContext = null;
  }

  initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.audioContext;
  }

  async playReminderSound() {
    const ctx = this.initAudioContext();
    
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    try {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const oscillator = ctx.createOscillator();
          const gainNode = ctx.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(ctx.destination);
          oscillator.frequency.value = 880;
          gainNode.gain.value = 0.3;
          oscillator.start();
          gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
          oscillator.stop(ctx.currentTime + 0.3);
        }, i * 400);
      }
    } catch (error) {
      console.error("Erreur son:", error);
    }
  }

  async playConseilSound() {
    const ctx = this.initAudioContext();
    
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.value = 523.25;
      gainNode.gain.value = 0.2;
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
      oscillator.stop(ctx.currentTime + 0.8);
    } catch (error) {
      console.error("Erreur son conseil:", error);
    }
  }

  startReminderLoop(reminderId, duration = 3) {
    let count = 0;
    const maxLoops = duration * 2;
    
    const interval = setInterval(() => {
      if (count >= maxLoops) {
        clearInterval(interval);
        return;
      }
      this.playReminderSound();
      count++;
    }, 30000);
    
    if (!window.activeReminderLoops) window.activeReminderLoops = {};
    window.activeReminderLoops[reminderId] = interval;
    
    return interval;
  }

  stopReminderLoop(reminderId) {
    if (window.activeReminderLoops && window.activeReminderLoops[reminderId]) {
      clearInterval(window.activeReminderLoops[reminderId]);
      delete window.activeReminderLoops[reminderId];
    }
  }
}

export default new SoundService();