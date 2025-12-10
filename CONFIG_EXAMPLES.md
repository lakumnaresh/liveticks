/**
 * Configuration Examples
 * This file shows how to configure different aspects of LiveTicks
 */

// Example 1: Using different WebSocket servers
// File: src/services/websocket.service.ts

const WEBSOCKET_CONFIGS = {
  socketsBay: {
    url: 'wss://socketsbay.com/wss/v2/1/demo/',
    reconnectAttempts: 5,
    initialReconnectDelay: 1000,
    maxReconnectDelay: 30000,
    heartbeatInterval: 30000,
  },
  postmanEcho: {
    url: 'wss://ws.postman-echo.com/raw',
    reconnectAttempts: 5,
    initialReconnectDelay: 1000,
    maxReconnectDelay: 30000,
    heartbeatInterval: 30000,
  },
  binance: {
    url: 'wss://stream.binance.com:9443/ws/btcusdt@trade',
    reconnectAttempts: 5,
    initialReconnectDelay: 1000,
    maxReconnectDelay: 30000,
    heartbeatInterval: 30000,
  },
};

// Example 2: Custom initialization in App.tsx
/*
import {initWebSocket} from './src/services';

function App() {
  useEffect(() => {
    // Initialize with custom config
    initWebSocket({
      url: 'wss://your-custom-server.com',
      reconnectAttempts: 10,
      heartbeatInterval: 45000,
    });
  }, []);
  
  // ... rest of component
}
*/

// Example 3: Using different update frequencies
const UPDATE_FREQUENCIES = {
  FAST: 500,      // 500ms - Real-time, high battery usage
  NORMAL: 1000,   // 1000ms - Default, balanced
  SLOW: 2000,     // 2000ms - Low bandwidth, good battery life
  VERY_SLOW: 5000, // 5000ms - Minimal updates
};

// Example 4: Chart configuration
const CHART_CONFIGS = {
  line: {
    height: 300,
    colors: ['#6366F1'],
    strokeWidth: 2,
  },
  bar: {
    height: 300,
    colors: ['#6366F1'],
    layout: 'vertical',
  },
};

// Example 5: Data retention policies
const DATA_RETENTION = {
  SMALL: 50,      // Last 50 points (low memory)
  MEDIUM: 100,    // Last 100 points (default)
  LARGE: 200,     // Last 200 points (high memory)
};

// Example 6: Custom app settings
interface AppConfig {
  maxDataPoints: number;
  chartUpdateFrequency: number;
  defaultChartType: 'line' | 'bar';
  enableHeartbeat: boolean;
  enablePersistence: boolean;
  darkModeEnabled: boolean;
}

const DEFAULT_APP_CONFIG: AppConfig = {
  maxDataPoints: 100,
  chartUpdateFrequency: 1000,
  defaultChartType: 'line',
  enableHeartbeat: true,
  enablePersistence: true,
  darkModeEnabled: false,
};

export {
  WEBSOCKET_CONFIGS,
  UPDATE_FREQUENCIES,
  CHART_CONFIGS,
  DATA_RETENTION,
  DEFAULT_APP_CONFIG,
};
