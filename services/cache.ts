import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeCacheData = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error('Error when trying to store cache data :', e);
  }
};

export const getCacheData = async (key: string): Promise<string | null | undefined> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    console.error('Error when trying to retrieve cache data :', e);
  }
};