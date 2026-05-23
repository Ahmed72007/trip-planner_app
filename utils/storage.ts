import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_PREFIX = 'travelapp_';

export const StorageKeys = {
  TRIPS: `${STORAGE_PREFIX}trips`,
  USER_PROFILE: `${STORAGE_PREFIX}user_profile`,
  MISSIONS: `${STORAGE_PREFIX}missions`,
  CHECKLISTS: `${STORAGE_PREFIX}checklists`,
  SETTINGS: `${STORAGE_PREFIX}settings`,
} as const;

export async function saveData<T>(key: string, data: T): Promise<void> {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
  }
}

export async function loadData<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error loading data for key ${key}:`, error);
    return null;
  }
}

export async function removeData(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error);
  }
}

export async function clearAll(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const appKeys = keys.filter(k => k.startsWith(STORAGE_PREFIX));
    await AsyncStorage.multiRemove(appKeys);
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
}
