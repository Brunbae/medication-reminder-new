// Ici tu peux gérer la logique des rappels
// Plus tard tu pourras connecter à une API ou utiliser localStorage

export const getReminders = () => {
  return JSON.parse(localStorage.getItem('reminders')) || [];
};

export const addReminder = (reminder) => {
  const reminders = getReminders();
  reminders.push(reminder);
  localStorage.setItem('reminders', JSON.stringify(reminders));
};
