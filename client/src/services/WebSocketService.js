import { WEB_SOCKET_SERVER } from '../utils/config';

class WebSocketService {
  constructor() {
    if (!WebSocketService.instance) {
      this.ws = null;
      WebSocketService.instance = this;
    }

    return WebSocketService.instance;
  }

  getWebSocket() {
    if (!this.ws) {
      this.ws = new WebSocket(WEB_SOCKET_SERVER);
    }

    return this.ws;
  }

  close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default new WebSocketService();
