import Section from "@/components/settings/Section";
import SectionOption from "@/components/settings/SectionOption";
import { getAllScheduledNotificationsAsync, NotificationRequest } from "expo-notifications";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SettingsScreen() {
  // TEMP
  const [currentNotifications, setCurrentNotifications] = useState<NotificationRequest[]>([])
  useEffect(() => {
    const fetchData = async () => {
      let notifications = await getAllScheduledNotificationsAsync();
      setCurrentNotifications(notifications);
    }
    fetchData();
  }, [currentNotifications])
  // TEMP

  return (
    <View style={styles.container}>
      <Section name="Contraception">
        <SectionOption name="Méthode de contraception" navigateTo="contraceptionMethod"/>
        <SectionOption name="Date de début de contraception" navigateTo="contraceptionStartDate"/>
      </Section>

      <Section name="Général">
        <SectionOption name="Notifications" navigateTo="notifications"/>
        <SectionOption name="Style de l'application" navigateTo="appStyle"/>
        <SectionOption name="À propos" navigateTo="about"/>
      </Section>

      {/* TEMP */}
      <View>
        {currentNotifications.sort((a,b) => a?.trigger?.value - b?.trigger?.value).map((notification, index) => {
          return <Text key={index}>Notification prévu le : {(new Date(notification?.trigger?.value)).toLocaleString()}</Text>
        })}
      </View>
      {/* TEMP */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});