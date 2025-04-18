import EditContraceptionModal from "@/components/EditContraceptionModal";
import EditStartDateModal from "@/components/EditStartDateModal";
import { makeNotificationPush, scheduleNotificationPush } from "@/services/notifications";
import { getAllScheduledNotificationsAsync, NotificationRequest } from "expo-notifications";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function SettingsScreen() {
  const [editContraceptionModalVisible, setEditContraceptionModalVisible] = useState<boolean>(false);
  const [editStartDateModalVisible, setEditStartDateModalVisible] = useState<boolean>(false);

  // TEMP
  const [currentNotifications, setCurrentNotifications] = useState<NotificationRequest[]>([])
  useEffect(() => {
    const fetchData = async () => {
      let notifications = await getAllScheduledNotificationsAsync();
      console.log("get notifications")
      setCurrentNotifications(notifications);
    }
    fetchData();
  }, [])

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setEditContraceptionModalVisible(true)}>
        <Text>Modifier la méthode de contraception</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setEditStartDateModalVisible(true)}>
        <Text>Modifier la date de début de contraception</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => makeNotificationPush('Notif', "Maintenant")}>
        <Text>Notification now</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {
        const date = new Date();
        date.setTime(date.getTime() + 10 * 1000);
        scheduleNotificationPush('Notif', "10 sec + tard", date);
      }}>
        <Text>Notification in 10 sec</Text>
      </TouchableOpacity>

      <EditContraceptionModal
        visible={editContraceptionModalVisible}
        additionalActionTrue={() => setEditContraceptionModalVisible(false)}
      />

      <EditStartDateModal
        visible={editStartDateModalVisible}
        additionalActionTrue={() => setEditStartDateModalVisible(false)}
      />

      <View>
        {currentNotifications.sort((a,b) => a?.trigger?.value - b?.trigger?.value).map((notification, index) => {
          console.log("notification", notification.trigger);
          return <Text key={index}>Notification prévu le : {(new Date(notification?.trigger?.value)).toLocaleString()}</Text>
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});