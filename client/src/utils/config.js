export const SERVER_DOMAIN = window.location.hostname;

export let PORT;
let wsProtocol;
if (process.env.NODE_ENV === 'production') {
  PORT = '';
  wsProtocol = 'wss';
} else {
  PORT = '5000';
  wsProtocol = 'ws';
}

export const API_SERVER = window.location.origin;
export const WEB_SOCKET_SERVER = `${wsProtocol}://${SERVER_DOMAIN}:${PORT}`;
