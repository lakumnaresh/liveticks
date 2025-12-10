import {useWebSocketStore} from '../stores/websocket.store';
import {DataPoint, WebSocketConfig, ConnectionStatus} from '../types';

const DEFAULT_CONFIG: WebSocketConfig = {
  url: 'wss://stream.binance.com:9443/ws/btcusdt@trade',
  reconnectAttempts: 5,
  initialReconnectDelay: 1000,
  maxReconnectDelay: 30000,
  heartbeatInterval: 30000,
};

class WebSocketService {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private reconnectDelay = DEFAULT_CONFIG.initialReconnectDelay;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private lastMessageTime: number = Date.now();
  private messageBuffer: string[] = [];
  // Buffer parsed DataPoints and flush in batches to the store
  private pointBuffer: DataPoint[] = [];
  private flushIntervalMs = 100; // flush every 100ms (tuneable)
  private flushTimer: NodeJS.Timeout | null = null;
  private isIntentionallyClosed = false;

  constructor(config: Partial<WebSocketConfig> = {}) {
    this.config = {...DEFAULT_CONFIG, ...config};
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.isIntentionallyClosed = false;
        useWebSocketStore.getState().setConnectionStatus('reconnecting');

        this.ws = new WebSocket(this.config.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          useWebSocketStore.getState().setConnectionStatus('connected');
          useWebSocketStore.getState().setError(null);
          this.reconnectAttempts = 0;
          this.reconnectDelay = this.config.initialReconnectDelay;
          this.lastMessageTime = Date.now();

          // Send any buffered messages
          this.messageBuffer.forEach((msg) => this.ws?.send(msg));
          this.messageBuffer = [];

          // Start heartbeat
          this.startHeartbeat();
          // Start flush timer for buffered points
          this.startBufferFlush();
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.lastMessageTime = Date.now();

          try {
            // Parse incoming data. Binance trade stream messages are JSON
            // where the price is provided as a string in the `p` field and
            // the trade timestamp commonly in `T` (or event time in `E`).
            let value: number = NaN;
            let timestamp = Date.now();

            if (typeof event.data === 'string') {
              try {
                const parsed = JSON.parse(event.data);

                // Try common Binance trade fields first
                if (parsed && typeof parsed === 'object') {
                  if (parsed.p) {
                    value = parseFloat(parsed.p);
                  } else if (parsed.price) {
                    value = parseFloat(parsed.price);
                  } else if (parsed.value) {
                    value = parseFloat(parsed.value);
                  } else if (parsed.data && (parsed.data.p || parsed.data.price || parsed.data.value)) {
                    value = parseFloat(parsed.data.p || parsed.data.price || parsed.data.value);
                  }

                  // Prefer trade timestamp fields when available
                  if (parsed.T) timestamp = Number(parsed.T);
                  else if (parsed.E) timestamp = Number(parsed.E);
                  else if (parsed.data && parsed.data.T) timestamp = Number(parsed.data.T);
                }
              } catch (e) {
                // Not JSON or unexpected format: try parse as plain number
                value = parseFloat(event.data);
              }
            } else {
              value = parseFloat(String(event.data));
            }

            // Validate the value and push to local buffer (batch later)
            if (!isNaN(value)) {
              const dataPoint: DataPoint = {
                timestamp: timestamp || Date.now(),
                value,
              };

              const store = useWebSocketStore.getState();
              if (!store.isPaused) {
                // buffer locally; flush timer will commit batches to store
                this.pointBuffer.push(dataPoint);
                // safety: if buffer grows too large, flush immediately
                if (this.pointBuffer.length >= (store.settings?.maxDataPoints || 100)) {
                  const buffer = this.pointBuffer.splice(0, this.pointBuffer.length);
                  useWebSocketStore.getState().addDataPoints(buffer);
                }
              }
            }
          } catch (err) {
            console.warn('Error processing message:', err);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          useWebSocketStore
            .getState()
            .setError('WebSocket connection error occurred');
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket closed');
          this.stopHeartbeat();
          // Ensure any buffered points are flushed when the socket closes
          this.stopBufferFlush();

          if (!this.isIntentionallyClosed) {
            this.handleReconnect();
          } else {
            useWebSocketStore.getState().setConnectionStatus('disconnected');
          }
        };
      } catch (error) {
        console.error('Error creating WebSocket:', error);
        useWebSocketStore.getState().setError('Failed to create WebSocket');
        reject(error);
      }
    });
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.config.reconnectAttempts) {
      this.reconnectAttempts++;
      useWebSocketStore.getState().setConnectionStatus('reconnecting');

      console.log(
        `Attempting to reconnect... (${this.reconnectAttempts}/${this.config.reconnectAttempts})`,
      );

      this.reconnectTimer = setTimeout(() => {
        this.connect().catch((error) => {
          console.error('Reconnection failed:', error);
        });
      }, this.reconnectDelay);

      // Exponential backoff
      this.reconnectDelay = Math.min(
        this.reconnectDelay * 2,
        this.config.maxReconnectDelay,
      );
    } else {
      console.error('Max reconnection attempts reached');
      useWebSocketStore.getState().setError('Connection failed after max retries');
      useWebSocketStore.getState().setConnectionStatus('disconnected');
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();

    this.heartbeatTimer = setInterval(() => {
      const timeSinceLastMessage = Date.now() - this.lastMessageTime;

      if (timeSinceLastMessage > this.config.heartbeatInterval) {
        console.log('Heartbeat: No message received, checking connection...');

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          try {
            this.ws.send('ping');
          } catch (err) {
            console.warn('Failed to send heartbeat ping:', err);
          }
        }
      }
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // Start periodic flush of buffered DataPoints to the store
  private startBufferFlush(): void {
    if (this.flushTimer) return;
    this.flushTimer = setInterval(() => {
      if (this.pointBuffer.length === 0) return;
      const buffer = this.pointBuffer.splice(0, this.pointBuffer.length);
      try {
        useWebSocketStore.getState().addDataPoints(buffer);
      } catch (err) {
        console.warn('Failed to flush point buffer:', err);
      }
    }, this.flushIntervalMs);
  }

  private stopBufferFlush(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    // flush remaining points synchronously
    if (this.pointBuffer.length > 0) {
      const buffer = this.pointBuffer.splice(0, this.pointBuffer.length);
      try {
        useWebSocketStore.getState().addDataPoints(buffer);
      } catch (err) {
        console.warn('Failed to flush point buffer on stop:', err);
      }
    }
  }

  disconnect(): void {
    this.isIntentionallyClosed = true;
    this.stopHeartbeat();
    // Flush and stop the buffer flush timer when intentionally disconnecting
    this.stopBufferFlush();

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    useWebSocketStore.getState().setConnectionStatus('disconnected');
  }

  send(message: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      this.messageBuffer.push(message);
      console.warn('WebSocket not open, buffering message');
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
let wsService: WebSocketService | null = null;

export const getWebSocketService = (): WebSocketService => {
  if (!wsService) {
    wsService = new WebSocketService();
  }
  return wsService;
};

export const initWebSocket = (config?: Partial<WebSocketConfig>): WebSocketService => {
  wsService = new WebSocketService(config);
  return wsService;
};
