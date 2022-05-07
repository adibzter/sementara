export const SERVER_DOMAIN = window.location.hostname;

export let PORT;
if (process.env.NODE_ENV === 'production') {
  PORT = '';
} else {
  PORT = '5000';
}

export const API_SERVER = `http://${SERVER_DOMAIN}:${PORT}`;
export const WEB_SOCKET_SERVER = `ws://${SERVER_DOMAIN}:${PORT}`;
