import { AsyncStorage } from 'react-native';

export const JsonStorageHelper = {
  async getItem(key: string, defaultValue = null): Promise<any> {
    const value = await AsyncStorage.getItem(key);
    if (value === null) {
      return defaultValue;
    }
    return JSON.parse(value);
  },
  setItem(key: string, value: any): Promise<void> {
    value = JSON.stringify(value);
    return AsyncStorage.setItem(key, value);
  },
  removeItem(key: string): Promise<void> {
    return AsyncStorage.removeItem(key);
  },
};
