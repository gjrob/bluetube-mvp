// lib/urls.js
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_URL ||
  '';

export const route = (path = '') =>
  path.startsWith('http')
    ? path
    : `${APP_URL}${path.startsWith('/') ? '' : '/'}${path}`;
