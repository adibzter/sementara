const serverDomain = window.location.hostname;
const port = '5000';

export const API_SERVER = `http://${serverDomain}:${port}`;
export const WEB_SOCKET_SERVER = `ws://${serverDomain}:${port}`;
