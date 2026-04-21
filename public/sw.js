// public/sw.js

let notificationInterval = null;

self.addEventListener('install', (event) => {
  console.log('Service Worker installé');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activé');
  event.waitUntil(clients.claim());
});

// Recevoir les messages depuis l'application
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_REMINDERS') {
    const reminders = event.data.reminders;
    scheduleReminders(reminders);
  }
});

// Planifier les rappels
function scheduleReminders(reminders) {
  // Nettoyer les anciens intervalles
  if (notificationInterval) {
    clearInterval(notificationInterval);
  }
  
  // Vérifier les rappels chaque minute
  notificationInterval = setInterval(() => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const today = now.toDateString();
    
    reminders.forEach(reminder => {
      if (!reminder.active) return;
      
      // Vérifier si c'est l'heure du rappel
      if (reminder.heure === currentTime) {
        const lastTrigger = reminder.lastTriggered;
        
        // Ne pas déclencher plusieurs fois le même jour
        if (!lastTrigger || new Date(lastTrigger).toDateString() !== today) {
          reminder.lastTriggered = now.toISOString();
          
          // Mettre à jour dans localStorage
          updateReminderInStorage(reminder);
          
          // Envoyer la notification
          sendNotification(reminder);
          
          // Envoyer un message à l'application pour jouer le son
          sendMessageToClients({
            type: 'TRIGGER_ALARM',
            reminder: reminder
          });
        }
      }
    });
    
    // Sauvegarder les modifications
    saveRemindersToStorage(reminders);
  }, 60000); // Vérifier chaque minute
}

// Envoyer une notification
function sendNotification(reminder) {
  self.registration.showNotification('💊 Rappel médicament', {
    body: `Il est temps de prendre ${reminder.medicament}${reminder.dosage ? ` - ${reminder.dosage}` : ''}`,
    icon: '/medication-icon.png',
    badge: '/medication-badge.png',
    vibrate: [200, 100, 200, 100, 300],
    requireInteraction: true,
    tag: `reminder-${reminder.id}`,
    data: {
      reminderId: reminder.id,
      url: '/'
    }
  });
}

// Envoyer un message à l'application
async function sendMessageToClients(message) {
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage(message);
  });
}

// Mettre à jour un rappel dans localStorage
function updateReminderInStorage(updatedReminder) {
  // Cette fonction sera appelée depuis l'application
  // Le Service Worker ne peut pas accéder directement à localStorage
  sendMessageToClients({
    type: 'UPDATE_REMINDER',
    reminder: updatedReminder
  });
}

// Sauvegarder tous les rappels
function saveRemindersToStorage(reminders) {
  sendMessageToClients({
    type: 'SAVE_REMINDERS',
    reminders: reminders
  });
}

// Gérer le clic sur notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});