export function sanitizeSystemSettingsValue(value) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
