import React, {useCallback, useMemo} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
} from 'react-native';
import {ChartType} from '../types';

interface ControlPanelProps {
  isPaused: boolean;
  onPauseToggle: () => void;
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
  updateFrequency: number;
  onUpdateFrequencyChange: (frequency: number) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = React.memo(({
  isPaused,
  onPauseToggle,
  chartType,
  onChartTypeChange,
  updateFrequency,
  onUpdateFrequencyChange,
}) => {
  const frequencyOptions = useMemo(() => [500, 1000, 2000], []);

  // Memoized callbacks
  const handleChartTypeChange = useCallback((type: ChartType) => {
    onChartTypeChange(type);
  }, [onChartTypeChange]);

  const handleFrequencyChange = useCallback((freq: number) => {
    onUpdateFrequencyChange(freq);
  }, [onUpdateFrequencyChange]);

  const chartTypes = useMemo(() => ['line', 'bar'] as ChartType[], []);

  return (
    <View style={styles.container}>
      {/* Pause/Resume Button */}
      <TouchableOpacity
        style={[styles.button, isPaused ? styles.pausedButton : styles.activeButton]}
        onPress={onPauseToggle}
      >
        <Text style={styles.buttonText}>
          {isPaused ? '▶ Resume' : '⏸ Pause'}
        </Text>
      </TouchableOpacity>

      {/* Chart Type Toggle */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chart Type</Text>
        <View style={styles.buttonGroup}>
          {chartTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.toggleButton,
                chartType === type ? styles.activeToggle : styles.inactiveToggle,
              ]}
              onPress={() => handleChartTypeChange(type)}
            >
              <Text
                style={[
                  styles.toggleText,
                  chartType === type ? styles.activeText : styles.inactiveText,
                ]}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Update Frequency */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Update Frequency</Text>
        <View style={styles.frequencyContainer}>
          {frequencyOptions.map((freq) => (
            <TouchableOpacity
              key={freq}
              style={[
                styles.frequencyButton,
                updateFrequency === freq ? styles.activeFrequency : styles.inactiveFrequency,
              ]}
              onPress={() => handleFrequencyChange(freq)}
            >
              <Text
                style={[
                  styles.frequencyText,
                  updateFrequency === freq ? styles.activeFreqText : styles.inactiveFreqText,
                ]}
              >
                {freq}ms
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
});

ControlPanel.displayName = 'ControlPanel';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#252B34',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#3B444F',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  activeButton: {
    backgroundColor: '#F6465D',
  },
  pausedButton: {
    backgroundColor: '#0ECB81',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8F96A8',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 2,
  },
  activeToggle: {
    backgroundColor: '#5B9DEF',
    borderColor: '#5B9DEF',
  },
  inactiveToggle: {
    backgroundColor: '#3B444F',
    borderColor: '#5B6B7A',
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  activeText: {
    color: '#FFFFFF',
  },
  inactiveText: {
    color: '#8F96A8',
  },
  frequencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  frequencyButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  activeFrequency: {
    backgroundColor: '#5B9DEF',
    borderColor: '#5B9DEF',
  },
  inactiveFrequency: {
    backgroundColor: '#3B444F',
    borderColor: '#5B6B7A',
  },
  frequencyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeFreqText: {
    color: '#FFFFFF',
  },
  inactiveFreqText: {
    color: '#8F96A8',
  },
});
