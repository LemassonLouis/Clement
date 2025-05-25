import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { createTables, deleteTables } from "@/database/db";
import { migrateTables } from "@/database/migrations";
import { initializeNotifications } from "@/services/notifications";
import { Toasts } from '@backpackapp-io/react-native-toast';
import { createUser, getUser } from "@/database/user";
import { defaultUser, UserContext } from "@/context/UserContext";
import { User } from "@/types/UserType";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [user, setUser] = useState<User>(defaultUser);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const asyncTasks = async () => {
      // await deleteTables(); // TEMP
      await createTables();
      await migrateTables();

      // Get or create the user
      let currentUser = await getUser();
      if(!currentUser) {
        await createUser(user);
        currentUser = await getUser();
      }
      setUser(currentUser!); // Im sure that i have a user here

      await initializeNotifications(currentUser!);

      setIsReady(true);
      SplashScreen.hideAsync();
    }

    asyncTasks();
  }, []);

  if(!isReady) return;

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <UserContext.Provider value={{user, setUser}}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/* <Stack.Screen name="+not-found" /> */}
          </Stack>
          <StatusBar style="auto" />
          <Toasts/>
        </UserContext.Provider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}