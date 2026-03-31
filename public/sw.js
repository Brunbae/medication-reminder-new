self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('message', e => {
  if (e.data?.type === 'SCHEDULE_REMINDERS') {
    self.reminders = e.data.reminders;
  }
});

setInterval(() => {
  if (!self.reminders?.length) return;
  const now = new Date();
  const hhmm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  self.reminders.forEach(r => {
    if (r.heure === hhmm) {
      self.registration.showNotification('💊 Rappel Médicament', {
        body: `Il est l'heure de prendre : ${r.medicament} ${r.dosage || ''}`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        vibrate: [200, 100, 200],
        tag: r.medicament,
      });
    }
  });
}, 60000);