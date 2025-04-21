import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { Text } from "react-native";

export default function AppStyle() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: "Style de l'application"});
  }, [navigation]);

  return (
    <Text>TODO</Text>
  )
}