import React from 'react';
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

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isPaused,
  onPauseToggle,
  chartType,
  onChartTypeChange,
  updateFrequency,
  onUpdateFrequencyChange,
}) => {
  const frequencyOptions = [500, 1000, 2000];

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
          {(['line', 'bar'] as ChartType[]).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.toggleButton,
                chartType === type ? styles.activeToggle : styles.inactiveToggle,
              ]}
              onPress={() => onChartTypeChange(type)}
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
              onPress={() => onUpdateFrequencyChange(freq)}
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
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
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
    backgroundColor: '#EF4444',
  },
  pausedButton: {
    backgroundColor: '#10B981',
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
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
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
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  inactiveToggle: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  activeText: {
    color: '#FFFFFF',
  },
  inactiveText: {
    color: '#6B7280',
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
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  inactiveFrequency: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
  },
  frequencyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeFreqText: {
    color: '#FFFFFF',
  },
  inactiveFreqText: {
    color: '#6B7280',
  },
});
