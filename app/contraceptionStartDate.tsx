import ContraceptionStartDateForm from "@/components/forms/ContraceptionStartDateForm";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ContraceptionStartDate() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: "Date de début de contraception"});
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier la date de début de contraception</Text>
      <ContraceptionStartDateForm autoValidate={true} />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    width: '80%',
    marginHorizontal: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginVertical: 10,
    fontSize: 16,
  }
});