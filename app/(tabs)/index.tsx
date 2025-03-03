import Calendar from "@/components/Calendar";
import SessionButtons from "@/components/SessionButtons";
import { Suspense } from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";

export default function Index() {
  const now = new Date();

  return (
    <SafeAreaView style={styles.container}>
      <Suspense fallback={<Text>Chargement...</Text>}>
        <Calendar/>
        <Text style={styles.text}>Accès rapide - {now.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</Text>
        <SessionButtons/>
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