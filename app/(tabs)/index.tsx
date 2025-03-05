import Calendar from "@/components/Calendar";
import CurrentSession from "@/components/CurrentSession";
import { Suspense } from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";

export default function Index() {
  const now: Date = new Date();

  return (
    <SafeAreaView style={styles.container}>
      <Suspense fallback={<Text>Chargement...</Text>}>
        <Calendar/>
        <Text style={styles.text}>Accès rapide - {now.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</Text>
        <CurrentSession/>
      </Suspense>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  text: {
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold'
  }
})