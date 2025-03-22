import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { createTables, deleteTables } from "@/database/db";
import { initializeNotifications } from "@/services/notifications";

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
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="+not-found" /> */}
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}