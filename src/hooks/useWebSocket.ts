import {useEffect} from 'react';
import {useWebSocketStore} from '../stores/websocket.store';
import {getWebSocketService} from '../services/websocket.service';

export const useWebSocket = () => {
  const store = useWebSocketStore();

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
    connectionStatus: store.connectionStatus,
    dataPoints: store.dataPoints,
    error: store.error,
  };
};

export const useDataPoints = () => {
  const {dataPoints} = useWebSocketStore();
  return dataPoints;
};

export const useConnectionStatus = () => {
  const {connectionStatus} = useWebSocketStore();
  return connectionStatus;
};

export const usePauseToggle = () => {
  const {isPaused, togglePause} = useWebSocketStore();
  return {isPaused, togglePause};
};

export const useAppSettings = () => {
  const {settings, updateSettings} = useWebSocketStore();
  return {settings, updateSettings};
};
