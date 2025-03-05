import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function dayDetail() {
  const day = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Détails du jour</Text>
      <Text>Jour : {day.date}</Text>
      <Text>Statut : {day.status}</Text>
      <Text>Had Sex : {day.sexWithoutProtection ? "Oui" : "Non"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});