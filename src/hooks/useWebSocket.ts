import {useEffect} from 'react';
import {
  useWebSocketStore,
  selectConnectionStatus,
  selectDataPoints,
  selectError,
  selectIsPaused,
  selectSettings,
} from '../stores/websocket.store';
import {getWebSocketService} from '../services/websocket.service';

/**
 * Main hook - initiates WebSocket connection and provides core state
 */
export const useWebSocket = () => {
  const connectionStatus = useWebSocketStore(selectConnectionStatus);
  const dataPoints = useWebSocketStore(selectDataPoints);
  const error = useWebSocketStore(selectError);

  useEffect(() => {
    const wsService = getWebSocketService();

    const connectWebSocket = async () => {
      try {
        await wsService.connect();
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
      }
    };

    connectWebSocket();

    return () => {
      wsService.disconnect();
    };
  }, []);

  return {
    connectionStatus,
    dataPoints,
    error,
  };
};

/**
 * Optimized hook - returns only data points (prevents re-render on other state changes)
 */
export const useDataPointsOptimized = () => {
  return useWebSocketStore(selectDataPoints);
};

/**
 * Optimized hook - returns only connection status
 */
export const useConnectionStatusOptimized = () => {
  return useWebSocketStore(selectConnectionStatus);
};

/**
 * Pause/Resume toggle hook
 */
export const usePauseToggle = () => {
  const isPaused = useWebSocketStore(selectIsPaused);
  const togglePause = useWebSocketStore((state) => state.togglePause);
  return {isPaused, togglePause};
};

/**
 * Error hook - returns only error state
 */
export const useError = () => {
  return useWebSocketStore(selectError);
};

/**
 * Settings hook for chart configuration
 */
export const useAppSettings = () => {
  const settings = useWebSocketStore(selectSettings);
  const updateSettings = useWebSocketStore((state) => state.updateSettings);
  return {settings, updateSettings};
};
