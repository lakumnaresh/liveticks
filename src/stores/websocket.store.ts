import {create} from 'zustand';
import {ConnectionStatus, DataPoint, ChartType, AppSettings} from '../types';

export interface WebSocketStore {
  // Connection state
  connectionStatus: ConnectionStatus;
  setConnectionStatus: (status: ConnectionStatus) => void;

  // Data state
  dataPoints: DataPoint[];
  addDataPoint: (point: DataPoint) => void;
  clearDataPoints: () => void;

  // Control state
  isPaused: boolean;
  togglePause: () => void;

  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;

  // Error handling
  error: string | null;
  setError: (error: string | null) => void;
}

export const useWebSocketStore = create<WebSocketStore>((set) => ({
  // Connection state
  connectionStatus: 'disconnected',
  setConnectionStatus: (status: ConnectionStatus) => set({connectionStatus: status}),

  // Data state
  dataPoints: [],
  addDataPoint: (point: DataPoint) =>
    set((state) => ({
      dataPoints: [...state.dataPoints.slice(-99), point], // Keep last 100 points
    })),
  clearDataPoints: () => set({dataPoints: []}),

  // Control state
  isPaused: false,
  togglePause: () => set((state) => ({isPaused: !state.isPaused})),

  // Settings
  settings: {
    updateFrequency: 1000, // 1 second
    chartType: 'line',
    maxDataPoints: 100,
  },
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: {...state.settings, ...newSettings},
    })),

  // Error handling
  error: null,
  setError: (error: string | null) => set({error}),
}));
