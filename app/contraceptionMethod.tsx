import ContraceptionMethodFrom from "@/components/forms/ContraceptionMethodForm";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";


export default function ContraceptionMethod() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: "Méthode de contraception"});
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier la méthode de contraception</Text>
      <ContraceptionMethodFrom autoValidate={true} />
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
    marginTop: 10,
    fontSize: 16,
  }
});