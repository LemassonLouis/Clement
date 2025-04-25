import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { createTables, deleteTables } from "@/database/db";
import { initializeNotifications } from "@/services/notifications";
import { Toasts } from '@backpackapp-io/react-native-toast';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    const asyncTasks = async () => {
      // await deleteTables();
      await createTables();

      SplashScreen.hideAsync();

      await initializeNotifications();
    }

    asyncTasks();
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* <Stack.Screen name="+not-found" /> */}
        </Stack>
        <StatusBar style="auto" />
        <Toasts/>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}