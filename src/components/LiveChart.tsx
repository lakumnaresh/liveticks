import React, {useMemo, useCallback} from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import {LineChart, BarChart} from 'react-native-chart-kit';
import {DataPoint, ChartType} from '../types';
import {dataUtils} from '../utils/data';

interface LiveChartProps {
  data: DataPoint[];
  type?: ChartType;
  height?: number;
}

/**
 * Optimized LiveChart component with memoization and efficient re-renders
 * - Uses React.memo to prevent re-renders from parent updates
 * - Memoizes expensive calculations (stats, chart data preparation)
 * - Uses useCallback for render functions
 */
export const LiveChart: React.FC<LiveChartProps> = React.memo(({
  data,
  type = 'line',
  height = 280,
}) => {
  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, {minHeight: height}]}>
        <Text style={styles.emptyText}>Waiting for data...</Text>
      </View>
    );
  }

  // Memoize statistics calculation
  const stats = useMemo(() => dataUtils.calculateStats(data), [data]);
  
  const chartWidth = Dimensions.get('window').width - 40;

  // Memoize chart data preparation to prevent recreating on every render
  const {displayData, labels, values, isUp, lineColor} = useMemo(() => {
    // Keep last 12 points for better visibility
    const display = data.slice(-12);
    
    // X-axis labels show price values (actual data values)
    const lbls = display.map((point, idx) => {
      if (idx % 2 === 0) {
        return `${point.value.toFixed(0)}`;
      }
      return '';
    });

    const vals = display.map(point => point.value);
    const upTrend = vals[vals.length - 1] >= (vals.reduce((a, b) => a + b, 0) / vals.length);
    const color = upTrend ? '#0ECB81' : '#F6465D';
    
    return {
      displayData: display,
      labels: lbls,
      values: vals,
      isUp: upTrend,
      lineColor: color,
    };
  }, [data]);

  // Memoize chart data object
  const chartData = useMemo(() => ({
    labels: labels,
    datasets: [
      {
        data: values,
        color: () => lineColor,
        strokeWidth: 2.5,
        fill: true,
      },
    ],
  }), [labels, values, lineColor]);

  // Memoize chart configuration
  const chartConfig = useMemo(() => ({
    backgroundGradientFrom: '#0F1419',
    backgroundGradientTo: '#0F1419',
    color: (opacity = 1) => `rgba(191, 194, 199, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.6,
    useShadowColorIos: true,
    propsForDots: {
      r: '3.5',
      strokeWidth: '1.5',
      stroke: lineColor,
      fill: lineColor,
    },
    propsForBackgroundLines: {
      stroke: 'rgba(191, 194, 199, 0.1)',
      strokeWidth: 0.5,
    },
    decimalPlaces: 2,
    labelColor: (opacity = 1) => `rgba(191, 194, 199, ${opacity})`,
  }), [lineColor]);

  // Memoized bar chart render
  const renderBarChart = useCallback(() => (
    <BarChart
      data={chartData}
      width={chartWidth}
      height={height}
      chartConfig={chartConfig}
      verticalLabelRotation={0}
      showValuesOnTopOfBars={false}
      withVerticalLabels={true}
      withHorizontalLabels={true}
      yAxisLabel=""
      yAxisSuffix=""
      style={styles.chart}
    />
  ), [chartData, chartWidth, height, chartConfig]);

  // Memoized line chart render
  const renderLineChart = useCallback(() => (
    <LineChart
      data={chartData}
      width={chartWidth}
      height={height}
      chartConfig={chartConfig}
      bezier={true}
      style={styles.chart}
      withDots={true}
      withVerticalLabels={true}
      withHorizontalLabels={true}
      yAxisLabel=""
      yAxisSuffix=""
    />
  ), [chartData, chartWidth, height, chartConfig]);

  // Memoized chart selection logic
  const renderChart = useCallback(() => {
    return type === 'bar' ? renderBarChart() : renderLineChart();
  }, [type, renderBarChart, renderLineChart]);

  return (
    <View style={styles.container}>
      {/* Header with title and trend indicator */}
      <View style={styles.headerRow}>
        <Text style={styles.chartTitle}>BTCUSDT Price</Text>
        <View style={[styles.trendBadge, {backgroundColor: isUp ? '#0ECB81' : '#F6465D'}]}>
          <Text style={styles.trendText}>{isUp ? '📈' : '📉'}</Text>
        </View>
      </View>

      {/* Key Stats Row */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Latest</Text>
          <Text style={[styles.statValue, {color: isUp ? '#0ECB81' : '#F6465D'}]}>
            {dataUtils.formatValue(stats.latest)}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>High</Text>
          <Text style={styles.statValue}>{dataUtils.formatValue(stats.max)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Low</Text>
          <Text style={styles.statValue}>{dataUtils.formatValue(stats.min)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Avg</Text>
          <Text style={styles.statValue}>{dataUtils.formatValue(stats.average)}</Text>
        </View>
      </View>

      {/* Chart */}
      <View style={styles.chartWrapper}>
        {renderChart()}
      </View>

      {/* Footer Info */}
      <Text style={styles.dataPointsInfo}>
        {data.length} updates • Last 12 shown
      </Text>
    </View>
  );
});

LiveChart.displayName = 'LiveChart';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F1419',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#252B34',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  trendBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#252B34',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#252B34',
    marginHorizontal: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#8F96A8',
    marginBottom: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E8E8E8',
  },
  chartWrapper: {
    marginVertical: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#0F1419',
  },
  chart: {
    borderRadius: 8,
    alignSelf: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8F96A8',
    textAlign: 'center',
    marginTop: 100,
  },
  dataPointsInfo: {
    fontSize: 11,
    color: '#8F96A8',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 0.3,
  },
});
