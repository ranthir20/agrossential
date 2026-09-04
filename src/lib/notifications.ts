export const ALERTS_STORAGE_KEY = "agrossential-alerts";
export const INBOX_STORAGE_KEY = "agrossential-inbox";

export function hasUnreadAlerts(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const alerts = JSON.parse(
      localStorage.getItem(ALERTS_STORAGE_KEY) || "[]"
    );

    return alerts.some((alert: { read?: boolean }) => alert.read !== true);
  } catch {
    return false;
  }
}

export function hasUnreadInbox(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const messages = JSON.parse(
      localStorage.getItem(INBOX_STORAGE_KEY) || "[]"
    );

    return messages.some(
      (message: { unread?: boolean; read?: boolean }) =>
        message.unread === true || message.read === false
    );
  } catch {
    return false;
  }
}

export function notifyHeaderUpdate() {
  window.dispatchEvent(new Event("agrossential-notifications-updated"));
}
