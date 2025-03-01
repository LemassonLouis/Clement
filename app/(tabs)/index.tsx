import Calendar from "@/components/Calendar";
import { SafeAreaView, StyleSheet, Text } from "react-native";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <Calendar/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
})