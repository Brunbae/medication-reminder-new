/* public/sw.js - Service Worker pour alarmes */

const CACHE_NAME = 'rappel-medicaments-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Recevoir un message de l'app pour programmer une alarme
self.addEventListener('message', (event) => {
  if (event.data.type === 'SCHEDULE_ALARM') {
    const { reminder, delay } = event.data;
    
    setTimeout(() => {
      // Envoyer notification
      self.registration.showNotification('💊 HEURE DE PRISE !', {
        body: `Prenez ${reminder.medicament} maintenant${reminder.dosage ? ' — ' + reminder.dosage : ''}`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        vibrate: [300, 100, 300, 100, 300],
        requireInteraction: true, // reste affichée jusqu'à interaction
        tag: `alarm-${reminder.id}`,
        data: { reminder },
        actions: [
          { action: 'taken', title: '✅ Pris !' },
          { action: 'snooze', title: '⏰ Rappeler dans 5 min' }
        ]
      });
    }, delay);
  }
  
  if (event.data.type === 'SCHEDULE_ALL_ALARMS') {
    const { reminders } = event.data;
    reminders.forEach(reminder => {
      const now = new Date();
      const [hours, minutes] = reminder.heure.split(':');
      const alarmTime = new Date();
      alarmTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      if (alarmTime <= now) {
        alarmTime.setDate(alarmTime.getDate() + 1);
      }
      
      const delay = alarmTime.getTime() - now.getTime();
      
      setTimeout(() => {
        self.registration.showNotification('💊 HEURE DE PRISE !', {
          body: `Prenez ${reminder.medicament} maintenant${reminder.dosage ? ' — ' + reminder.dosage : ''}`,
          icon: '/favicon.ico',
          vibrate: [300, 100, 300, 100, 300],
          requireInteraction: true,
          tag: `alarm-${reminder.id}`,
          data: { reminder },
          actions: [
            { action: 'taken', title: '✅ Pris !' },
            { action: 'snooze', title: '⏰ Dans 5 min' }
          ]
        });
      }, delay);
    });
  }
});

// Clic sur la notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'snooze') {
    // Reprogrammer dans 5 minutes
    const reminder = event.notification.data.reminder;
    setTimeout(() => {
      self.registration.showNotification('💊 RAPPEL (5 min)', {
        body: `N'oubliez pas : ${reminder.medicament}`,
        icon: '/favicon.ico',
        requireInteraction: true,
        tag: `alarm-snooze-${reminder.id}`,
      });
    }, 5 * 60 * 1000);
    return;
  }
  
  // Ouvrir l'application
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      if (windowClients.length > 0) {
        windowClients[0].focus();
      } else {
        clients.openWindow('/dashboard');
      }
    })
  );
});