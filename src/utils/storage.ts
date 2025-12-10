import {MMKV} from 'react-native-mmkv';
import {DataPoint} from '../types';

// Initialize MMKV storage
const storage = new MMKV();

const STORAGE_KEY = 'liveticks_data_cache';
const SETTINGS_KEY = 'liveticks_settings';

export const storageUtils = {
  async saveDataPoints(points: DataPoint[]): Promise<void> {
    try {
      storage.set(STORAGE_KEY, JSON.stringify(points));
    } catch (error) {
      console.error('Error saving data points to MMKV:', error);
    }
  },

  async loadDataPoints(): Promise<DataPoint[]> {
    try {
      const data = storage.getString(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading data points from MMKV:', error);
      return [];
    }
  },

  async clearDataPoints(): Promise<void> {
    try {
      storage.delete(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing data points from MMKV:', error);
    }
  },

  async saveSettings(settings: Record<string, any>): Promise<void> {
    try {
      storage.set(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings to MMKV:', error);
    }
  },

  async loadSettings(): Promise<Record<string, any>> {
    try {
      const data = storage.getString(SETTINGS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading settings from MMKV:', error);
      return {};
    }
  },
};
