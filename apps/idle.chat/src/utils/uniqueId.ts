export default function uniqueId() {
  if (window.isSecureContext && typeof crypto.randomUUID === 'function') {
    // return crypto random uuid
    return crypto.randomUUID();
  }
  return Date.now().toString();
}
