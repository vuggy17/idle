export function uniqueId() {
  if (window.isSecureContext && typeof crypto.randomUUID === 'function') {
    // return crypto random uuid
    return crypto.randomUUID();
  } else return Date.now().toString();
}
