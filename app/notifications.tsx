import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { Text } from "react-native";

export default function Notifications() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: "Notifications"});
  }, [navigation]);

  return (
    <Text>Coucou</Text>
  )
}