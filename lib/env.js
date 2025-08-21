// Universal, lightweight getter with warning + optional fallback.
export function getEnv(name, fallback = null) {
  const v = process.env[name];
  if (v == null || v === '') {
    if (fallback !== null) {
      if (typeof window === 'undefined') {
        console.warn(`[ENV WARNING] ${name} is missing. Using fallback.`);
      }
      return fallback;
    }
    if (typeof window === 'undefined') {
      console.warn(`[ENV WARNING] ${name} is missing and no fallback provided.`);
    }
    return null;
  }
  return v;
}
