import {create} from 'zustand';
import {ConnectionStatus, DataPoint, ChartType, AppSettings} from '../types';

export interface WebSocketStore {
  // Connection state
  connectionStatus: ConnectionStatus;
  setConnectionStatus: (status: ConnectionStatus) => void;

  // Data state
  dataPoints: DataPoint[];
  addDataPoint: (point: DataPoint) => void;
  addDataPoints: (points: DataPoint[]) => void;
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
  // Bulk insert points in a single atomic update to lower re-render frequency
  addDataPoints: (points: DataPoint[]) =>
    set((state) => {
      const max = state.settings?.maxDataPoints ?? 100;
      // take the tail of existing points to make room for new batch
      const tail = state.dataPoints.slice(-Math.max(0, max - points.length));
      return {dataPoints: [...tail, ...points].slice(-max)};
    }),
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

// Memoized selectors to prevent unnecessary re-renders
export const selectConnectionStatus = (state: WebSocketStore) => state.connectionStatus;
export const selectDataPoints = (state: WebSocketStore) => state.dataPoints;
export const selectIsPaused = (state: WebSocketStore) => state.isPaused;
export const selectSettings = (state: WebSocketStore) => state.settings;
export const selectError = (state: WebSocketStore) => state.error;
export const selectChartType = (state: WebSocketStore) => state.settings.chartType;

// Hook for getting only connection status (prevents re-render on data updates)
export const useConnectionStatus = () =>
  useWebSocketStore(selectConnectionStatus);

// Hook for getting only data points (prevents re-render on status/settings changes)
export const useDataPoints = () =>
  useWebSocketStore(selectDataPoints);

// Hook for getting only pause state
export const usePauseState = () =>
  useWebSocketStore(selectIsPaused);

// Hook for getting only settings
export const useSettings = () =>
  useWebSocketStore(selectSettings);

// Hook for getting only error
export const useError = () =>
  useWebSocketStore(selectError);

// Hook for getting only chart type
export const useChartType = () =>
  useWebSocketStore(selectChartType);
