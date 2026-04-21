// services/alarmService.js

class AlarmService {
  constructor() {
    this.audioContext = null;
    this.isReady = false;
    this.alarmInterval = null;
    this.activeAlarm = null;
    this.pendingTimeouts = [];
  }

  // Activer l'audio (doit être appelé après un clic)
  async enableAudio() {
    if (this.isReady) return true;
    
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      this.isReady = true;
      console.log('✅ Audio alarme activé');
      return true;
    } catch (error) {
      console.log('❌ Erreur activation audio:', error);
      return false;
    }
  }

  // Jouer un bip (version simple et fiable)
  async playBeep(frequency = 880, duration = 0.2, volume = 0.4) {
    if (!this.isReady) {
      console.log('Audio non activé, appel enableAudio d\'abord');
      return false;
    }
    
    try {
      const now = this.audioContext.currentTime;
      const gain = this.audioContext.createGain();
      gain.connect(this.audioContext.destination);
      gain.gain.value = volume;
      
      const osc = this.audioContext.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = frequency;
      osc.connect(gain);
      
      osc.start(now);
      osc.stop(now + duration);
      
      return true;
    } catch (error) {
      console.log('Erreur beep:', error);
      return false;
    }
  }

  // Tester le son
  async testSound() {
    const success = await this.playBeep(880, 0.2, 0.5);
    if (success) {
      setTimeout(() => this.playBeep(660, 0.2, 0.5), 200);
    }
    return success;
  }

  // Son de confirmation
  async playConfirmation() {
    await this.playBeep(660, 0.15, 0.3);
    setTimeout(() => this.playBeep(880, 0.15, 0.3), 150);
  }

  // Alarme
  async playAlarm() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.playBeep(880, 0.2, 0.6);
      }, i * 350);
    }
    
    if (window.navigator?.vibrate) {
      window.navigator.vibrate([300, 100, 300, 100, 300]);
    }
  }

  // Arrêter l'alarme
  stopAlarm() {
    if (this.alarmInterval) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
    
    const overlay = document.querySelector('.medication-alarm-overlay');
    if (overlay) overlay.remove();
    this.activeAlarm = null;
    console.log('⏹️ Alarme arrêtée');
  }

  // Afficher popup
  showPopup(reminder, onStop) {
    const existing = document.querySelector('.medication-alarm-overlay');
    if (existing) existing.remove();
    
    const overlay = document.createElement('div');
    overlay.className = 'medication-alarm-overlay';
    overlay.innerHTML = `
      <div class="medication-alarm-modal">
        <div class="alarm-bell">🔔🔔🔔</div>
        <h2>⏰ HEURE DE PRISE !</h2>
        <p style="font-size:24px;font-weight:800;margin:15px 0">💊 ${reminder.medicament}</p>
        ${reminder.dosage ? `<p style="font-size:18px">💉 ${reminder.dosage}</p>` : ''}
        <p style="font-size:18px">⏰ ${reminder.heure}</p>
        <button class="alarm-stop-btn">✓ J'ai pris mon médicament</button>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    const btn = overlay.querySelector('.alarm-stop-btn');
    btn.onclick = () => {
      this.stopAlarm();
      if (onStop) onStop(reminder.id);
      overlay.remove();
    };
  }

  // Déclencher l'alarme
  async triggerAlarm(reminder, onStop) {
    if (this.activeAlarm) return;
    
    console.log('🔔 ALARME DÉCLENCHÉE pour:', reminder.medicament);
    this.activeAlarm = reminder;
    
    await this.playAlarm();
    
    let count = 0;
    this.alarmInterval = setInterval(async () => {
      if (count < 12 && this.activeAlarm) {
        await this.playAlarm();
        count++;
      } else {
        this.stopAlarm();
      }
    }, 5000);
    
    this.showPopup(reminder, onStop);
    
    if (Notification.permission === 'granted') {
      new Notification('💊 RAPPEL MÉDICAMENT', {
        body: `Prenez ${reminder.medicament} maintenant`,
        requireInteraction: true
      });
    }
  }

  // Nettoyer les timeouts
  clearAllTimeouts() {
    this.pendingTimeouts.forEach(timeout => clearTimeout(timeout));
    this.pendingTimeouts = [];
  }

  // Planifier une alarme
  scheduleAlarm(reminder, onTrigger) {
    const now = new Date();
    const [hours, minutes] = reminder.heure.split(':');
    const alarmTime = new Date();
    alarmTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    if (alarmTime <= now) {
      alarmTime.setDate(alarmTime.getDate() + 1);
    }
    
    const delay = alarmTime.getTime() - now.getTime();
    console.log(`⏰ Alarme programmée: ${reminder.medicament} à ${reminder.heure} (dans ${Math.round(delay / 60000)} min)`);
    
    const timeoutId = setTimeout(() => {
      onTrigger(reminder);
    }, delay);
    
    this.pendingTimeouts.push(timeoutId);
    return timeoutId;
  }
}

export default new AlarmService();