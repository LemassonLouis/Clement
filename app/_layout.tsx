import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { createTables, deleteTables } from "@/database/db";
import { initializeNotifications } from "@/services/notifications";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  initializeNotifications();

  useEffect(() => {
    SplashScreen.hideAsync();
    // deleteTables();
    createTables();
    // console.log(new Date().toISOString());
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