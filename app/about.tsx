import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { Text } from "react-native";

export default function About() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: "À propos"});
  }, [navigation]);

  return (
    <Text>TODO</Text>
  )
}