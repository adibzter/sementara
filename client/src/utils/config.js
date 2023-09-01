// Default to dev environment
export let QR_URL_ORIGIN = window.location.origin.replace(
  'localhost',
  '192.168.1.12'
);
export let PORT = '5000';
let wsProtocol = 'ws';

if (process.env.NODE_ENV === 'production') {
  QR_URL_ORIGIN = window.location.origin;
  PORT = '';
  wsProtocol = 'wss';
}

export const SERVER_DOMAIN = window.location.hostname;
export const API_SERVER = window.location.origin;
export const WEB_SOCKET_SERVER = `${wsProtocol}://${SERVER_DOMAIN}:${PORT}`;
