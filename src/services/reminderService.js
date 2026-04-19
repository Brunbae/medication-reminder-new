export const getReminders = () => {
  return JSON.parse(localStorage.getItem("reminders")) || [];
};

export const addReminder = (reminder) => {
  const reminders = getReminders();
  const newReminder = {
    ...reminder,
    id: Date.now(),
    active: true,
    triggered: false,
    createdAt: new Date().toISOString()
  };
  reminders.push(newReminder);
  localStorage.setItem("reminders", JSON.stringify(reminders));
  return newReminder;
};

export const updateReminder = (id, updates) => {
  const reminders = getReminders();
  const index = reminders.findIndex(r => r.id === id);
  if (index !== -1) {
    reminders[index] = { ...reminders[index], ...updates };
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }
  return reminders;
};

export const deleteReminder = (id) => {
  const reminders = getReminders();
  const filtered = reminders.filter(r => r.id !== id);
  localStorage.setItem("reminders", JSON.stringify(filtered));
  return filtered;
};

export const getActiveReminders = () => {
  return getReminders().filter(r => r.active === true);
};
