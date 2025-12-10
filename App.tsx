/**
 * LiveTicks - Real-time Data Streaming Application
 * WebSocket integration with live chart visualization
 * 
 * Optimized for performance:
 * - Uses memoized selectors to prevent unnecessary re-renders
 * - Components memoized with React.memo
 * - useCallback for event handlers
 *
 * @format
 */

import React, {useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {useWebSocket, usePauseToggle, useAppSettings} from './src/hooks/useWebSocket';
import {useConnectionStatusOptimized, useDataPointsOptimized, useError} from './src/hooks/useWebSocket';
import {LiveChart} from './src/components/LiveChart';
import {StatusIndicator} from './src/components/StatusIndicator';
import {ControlPanel} from './src/components/ControlPanel';
import {ErrorBanner} from './src/components/ErrorBanner';

function App(): React.JSX.Element {
  // Use optimized hooks to prevent unnecessary re-renders
  useWebSocket(); // Initialize connection
  
  const connectionStatus = useConnectionStatusOptimized();
  const dataPoints = useDataPointsOptimized();
  const error = useError();
  
  const {isPaused, togglePause} = usePauseToggle();
  const {settings, updateSettings} = useAppSettings();

  // Memoized callbacks to prevent recreating on every render
  const handleChartTypeChange = useCallback((type: 'line' | 'bar') => {
    updateSettings({chartType: type});
  }, [updateSettings]);

  const handleUpdateFrequencyChange = useCallback((frequency: number) => {
    updateSettings({updateFrequency: frequency});
  }, [updateSettings]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1419" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
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
            <Text style={styles.infoUrl}>wss://stream.binance.com:9443/ws/btcusdt@trade</Text>
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
    backgroundColor: '#0F1419',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#8F96A8',
    fontWeight: '500',
  },
  statusContainer: {
    marginBottom: 12,
  },
  currentValueContainer: {
    backgroundColor: '#252B34',
    borderRadius: 12,
    padding: 20,
    marginVertical: 12,
    marginHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3B444F',
  },
  currentLabel: {
    fontSize: 13,
    color: '#8F96A8',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  currentValue: {
    fontSize: 40,
    fontWeight: '800',
    color: '#0ECB81',
    marginBottom: 8,
  },
  updateTimeLabel: {
    fontSize: 12,
    color: '#8F96A8',
    fontWeight: '500',
  },
  infoContainer: {
    backgroundColor: '#252B34',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
    marginHorizontal: 8,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#3B444F',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E8E8E8',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#BFC2C7',
    lineHeight: 20,
    marginBottom: 8,
  },
  infoUrl: {
    fontSize: 12,
    color: '#5B9DEF',
    fontFamily: 'Menlo',
  },
});

export default App;
