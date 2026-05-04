// services/alarmService.js

class AlarmService {
  constructor() {
    this.audioContext = null;
    this.isReady = false;
    this.alarmInterval = null;
    this.activeAlarm = null;
    this.pendingTimeouts = [];
    this.swRegistration = null;
    
    // Enregistrer le Service Worker au démarrage
    this.registerServiceWorker();
  }

  // Enregistrer le Service Worker
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log('✅ Service Worker enregistré');
      } catch (error) {
        console.log('❌ Erreur Service Worker:', error);
      }
    }
  }

  // Activer l'audio (doit être appelé après un clic utilisateur)
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

  // Jouer un bip
  async playBeep(frequency = 880, duration = 0.2, volume = 0.4) {
    if (!this.isReady || !this.audioContext) return false;
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
      return false;
    }
  }

  // Tester le son
  async testSound() {
    const success = await this.playBeep(880, 0.2, 0.5);
    if (success) setTimeout(() => this.playBeep(660, 0.2, 0.5), 200);
    return success;
  }

  // Son de confirmation
  async playConfirmation() {
    await this.playBeep(660, 0.15, 0.3);
    setTimeout(() => this.playBeep(880, 0.15, 0.3), 150);
  }

  // Jouer alarme (son répété)
  async playAlarm() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => this.playBeep(880, 0.3, 0.7), i * 400);
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

  // Afficher popup dans l'app
  showPopup(reminder, onStop) {
    const existing = document.querySelector('.medication-alarm-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'medication-alarm-overlay';
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.85); z-index: 99999;
      display: flex; align-items: center; justify-content: center;
    `;
    overlay.innerHTML = `
      <div style="
        background: white; border-radius: 24px; padding: 40px 32px;
        max-width: 400px; width: 90%; text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        animation: pulse 1s infinite alternate;
      ">
        <div style="font-size: 60px; margin-bottom: 16px;">🔔</div>
        <h2 style="font-size: 28px; font-weight: 900; color: #0f2744; margin-bottom: 12px;">
          HEURE DE PRISE !
        </h2>
        <p style="font-size: 24px; font-weight: 800; color: #0d9488; margin-bottom: 8px;">
          💊 ${reminder.medicament}
        </p>
        ${reminder.dosage ? `<p style="font-size: 18px; color: #475569; margin-bottom: 8px;">💉 ${reminder.dosage}</p>` : ''}
        <p style="font-size: 18px; color: #475569; margin-bottom: 24px;">⏰ ${reminder.heure}</p>
        <button id="alarm-stop-btn" style="
          width: 100%; padding: 18px; background: linear-gradient(135deg, #10b981, #059669);
          color: white; border: none; border-radius: 16px; font-size: 20px;
          font-weight: 900; cursor: pointer; font-family: 'Nunito', sans-serif;
        ">✅ J'ai pris mon médicament</button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.getElementById('alarm-stop-btn').onclick = () => {
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

  // Planifier une alarme (dans l'app ET via Service Worker)
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

    // Timeout dans l'app (si l'app est ouverte)
    const timeoutId = setTimeout(() => {
      onTrigger(reminder);
    }, delay);
    this.pendingTimeouts.push(timeoutId);

    // Notification via Service Worker (si l'app est fermée)
    if (this.swRegistration && Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(sw => {
        sw.active.postMessage({
          type: 'SCHEDULE_ALARM',
          reminder,
          delay
        });
      });
    }

    return timeoutId;
  }

  // Planifier toutes les alarmes via Service Worker
  scheduleAllViaServiceWorker(reminders) {
    if (!this.swRegistration || Notification.permission !== 'granted') return;
    navigator.serviceWorker.ready.then(sw => {
      sw.active.postMessage({
        type: 'SCHEDULE_ALL_ALARMS',
        reminders: reminders.filter(r => r.active)
      });
    });
  }
}

const alarmService = new AlarmService();
export default alarmService;