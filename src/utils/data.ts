import {DataPoint} from '../types';

export const dataUtils = {
  formatValue: (value: number, decimals = 2): string => {
    return value.toFixed(decimals);
  },

  formatTime: (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  },

  calculateStats: (points: DataPoint[]) => {
    if (points.length === 0) {
      return {
        min: 0,
        max: 0,
        average: 0,
        latest: 0,
      };
    }

    const values = points.map((p) => p.value);
    const latest = values[values.length - 1];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const average = values.reduce((a, b) => a + b, 0) / values.length;

    return {
      min,
      max,
      average,
      latest,
    };
  },
};
