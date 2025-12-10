import React from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import {LineChart, BarChart} from 'react-native-chart-kit';
import {DataPoint, ChartType} from '../types';
import {dataUtils} from '../utils/data';

interface LiveChartProps {
  data: DataPoint[];
  type?: ChartType;
  height?: number;
}

export const LiveChart: React.FC<LiveChartProps> = ({
  data,
  type = 'line',
  height = 250,
}) => {
  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, {height}]}>
        <Text style={styles.emptyText}>Waiting for data...</Text>
      </View>
    );
  }

  const stats = dataUtils.calculateStats(data);
  const chartWidth = Dimensions.get('window').width - 32;

  // Prepare data for react-native-chart-kit
  // Keep only last 10 points for better visualization
  const displayData = data.slice(-10);
  const labels = displayData.map((_, idx) => `${idx}`);
  const values = displayData.map(point => point.value);

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: values,
        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorIos: true,
    propsForDots: {
      r: '4',
      strokeWidth: '1',
      stroke: '#6366F1',
    },
    propsForBackgroundLines: {
      strokeDasharray: '0',
      stroke: '#E5E7EB',
      strokeWidth: 1,
    },
    decimalPlaces: 2,
  };

  const renderChart = () => {
    if (type === 'bar') {
      return (
        <BarChart
          data={chartData}
          width={chartWidth}
          height={height}
          chartConfig={chartConfig}
          verticalLabelRotation={0}
          showValuesOnTopOfBars={false}
          style={styles.chart}
        />
      );
    }

    // Default to line chart
    return (
      <LineChart
        data={chartData}
        width={chartWidth}
        height={height}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Latest</Text>
          <Text style={styles.statValue}>{dataUtils.formatValue(stats.latest)}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>High</Text>
          <Text style={styles.statValue}>{dataUtils.formatValue(stats.max)}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Low</Text>
          <Text style={styles.statValue}>{dataUtils.formatValue(stats.min)}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Avg</Text>
          <Text style={styles.statValue}>{dataUtils.formatValue(stats.average)}</Text>
        </View>
      </View>

      <View style={styles.chartWrapper}>
        {renderChart()}
      </View>

      <Text style={styles.dataPointsInfo}>
        {data.length} data point{data.length !== 1 ? 's' : ''} displayed (last 10 shown)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  chartWrapper: {
    marginVertical: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  chart: {
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 100,
  },
  dataPointsInfo: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
  },
});
