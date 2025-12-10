/**
 * LiveTicks - Real-time Data Streaming Application
 * WebSocket integration with live chart visualization
 *
 * @format
 */

import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {useWebSocket, usePauseToggle, useAppSettings} from './src/hooks/useWebSocket';
import {useWebSocketStore} from './src/stores/websocket.store';
import {LiveChart} from './src/components/LiveChart';
import {StatusIndicator} from './src/components/StatusIndicator';
import {ControlPanel} from './src/components/ControlPanel';
import {ErrorBanner} from './src/components/ErrorBanner';

function App(): React.JSX.Element {
  // Hooks
  const {connectionStatus, dataPoints, error} = useWebSocket();
  const {isPaused, togglePause} = usePauseToggle();
  const {settings, updateSettings} = useAppSettings();

  // Handle pause/resume through settings
  useEffect(() => {
    // This ensures data points respect pause state
    // Already handled in WebSocket service via store
  }, [isPaused]);

  const handleChartTypeChange = (type: 'line' | 'bar') => {
    updateSettings({chartType: type});
  };

  const handleUpdateFrequencyChange = (frequency: number) => {
    updateSettings({updateFrequency: frequency});
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📊 LiveTicks</Text>
          <Text style={styles.subtitle}>Real-time Data Streaming</Text>
        </View>

        {/* Connection Status */}
        <View style={styles.statusContainer}>
          <StatusIndicator status={connectionStatus} />
        </View>

        {/* Error Banner */}
        <ErrorBanner message={error} />

        {/* Live Chart */}
        <LiveChart
          data={dataPoints}
          type={settings.chartType}
          height={300}
        />

        {/* Current Value Display */}
        {dataPoints.length > 0 && (
          <View style={styles.currentValueContainer}>
            <Text style={styles.currentLabel}>Current Value</Text>
            <Text style={styles.currentValue}>
              {dataPoints[dataPoints.length - 1].value.toFixed(2)}
            </Text>
            <Text style={styles.updateTimeLabel}>
              Last updated: {new Date(
                dataPoints[dataPoints.length - 1].timestamp,
              ).toLocaleTimeString()}
            </Text>
          </View>
        )}

        {/* Control Panel */}
        <ControlPanel
          isPaused={isPaused}
          onPauseToggle={togglePause}
          chartType={settings.chartType}
          onChartTypeChange={handleChartTypeChange}
          updateFrequency={settings.updateFrequency}
          onUpdateFrequencyChange={handleUpdateFrequencyChange}
        />

        {/* Info Section */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>About</Text>
          <Text style={styles.infoText}>
            Connected to WebSocket server: {'\n'}
            <Text style={styles.infoUrl}>wss://socketsbay.com/wss/v2/1/demo/</Text>
          </Text>
          <Text style={styles.infoText}>
            {'\n'}Data points maintained: {dataPoints.length}/100
          </Text>
          <Text style={styles.infoText}>
            Status: <Text style={{fontWeight: '600'}}>{connectionStatus}</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 38,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  statusContainer: {
    marginBottom: 12,
  },
  currentValueContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 20,
    marginVertical: 12,
    alignItems: 'center',
  },
  currentLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  currentValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#6366F1',
    marginBottom: 8,
  },
  updateTimeLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  infoContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginVertical: 24,
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  infoUrl: {
    fontSize: 12,
    color: '#6366F1',
    fontFamily: 'Menlo',
  },
});

export default App;
