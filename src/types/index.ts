export type ConnectionStatus = 'connected' | 'reconnecting' | 'disconnected';
export type ChartType = 'line' | 'bar';

export interface DataPoint {
  timestamp: number;
  value: number;
}

export interface WebSocketConfig {
  url: string;
  reconnectAttempts: number;
  initialReconnectDelay: number;
  maxReconnectDelay: number;
  heartbeatInterval: number;
}

export interface AppSettings {
  updateFrequency: number; // in milliseconds
  chartType: ChartType;
  maxDataPoints: number;
}
