import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { getTheme } from "@/services/appStyle";


export default function TabsLayout() {
  const { theme } = useContext(ThemeContext);
  const currentTheme = getTheme(theme.slug);

  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",
        tabBarShowLabel: true,
        headerStyle: { backgroundColor: currentTheme.background_1 },
        headerTitleStyle: { color: currentTheme.text_color },
        tabBarStyle: { backgroundColor: currentTheme.background_1 },
        sceneStyle: { backgroundColor: currentTheme.background_1 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Calendrier",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Paramètres",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}