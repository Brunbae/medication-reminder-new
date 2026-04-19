import SoundService from "./SoundService";

class NotificationService {
  constructor() {
    this.permissionGranted = false;
  }

  async requestPermission() {
    if (!("Notification" in window)) return false;
    try {
      const permission = await Notification.requestPermission();
      this.permissionGranted = permission === "granted";
      return this.permissionGranted;
    } catch (error) {
      console.error("Erreur permission:", error);
      return false;
    }
  }

  showNotification(title, options = {}) {
    if (!this.permissionGranted) return null;
    try {
      const notification = new Notification(title, {
        icon: "/logo192.png",
        requireInteraction: true,
        vibrate: [200, 100, 200],
        ...options
      });
      SoundService.playReminderSound();
      notification.onclick = () => { window.focus(); notification.close(); };
      return notification;
    } catch (error) {
      console.error("Erreur notification:", error);
      return null;
    }
  }

  showMedicationReminder(medicationName, dosage, instructions, reminderId) {
    SoundService.playReminderSound();
    SoundService.startReminderLoop(reminderId, 3);
    return this.showNotification(`Rappel : ${medicationName}`, {
      body: `${dosage ? dosage + "\n" : ""}${instructions || "Prenez vos medicaments"}`,
      requireInteraction: true,
    });
  }

  markReminderAsTaken(reminderId) {
    SoundService.stopReminderLoop(reminderId);
    SoundService.playConseilSound();
    if (this.permissionGranted) {
      const notification = new Notification("Medicament pris", {
        body: "Bravo ! Continuez a bien prendre soin de vous.",
        requireInteraction: false
      });
      setTimeout(() => notification.close(), 3000);
    }
  }

  showConseil(title, message) {
    SoundService.playConseilSound();
    return this.showNotification(`Conseil : ${title}`, { body: message, requireInteraction: false });
  }
}

export default new NotificationService();
