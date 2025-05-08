import { EventEmitter } from 'events';

interface WebSocketMessage {
  type: 'emotion' | 'voice' | 'session_state';
  payload: any;
}

class WebSocketClient extends EventEmitter {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;

  constructor(private url: string) {
    super();
    this.connect();
  }

  private connect() {
    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.emit('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.emit(message.type, message.payload);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        this.handleDisconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.handleDisconnect();
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.handleDisconnect();
    }
  }

  private handleDisconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), this.reconnectTimeout * this.reconnectAttempts);
    } else {
      this.emit('disconnected');
    }
  }

  public send(type: WebSocketMessage['type'], payload: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  public close() {
    this.ws?.close();
  }
}

export const createWebSocketClient = (url: string) => new WebSocketClient(url);