import ContraceptionStartDateForm from "@/components/forms/ContraceptionStartDateForm";
import { ThemeContext } from "@/context/ThemeContext";
import { getTheme } from "@/services/appStyle";
import { useNavigation } from "expo-router";
import { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";


export default function ContraceptionStartDate() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const currentTheme = getTheme(theme.slug);

  useEffect(() => {
    navigation.setOptions({ title: "Date de début de contraception"});
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: currentTheme.text_color }]}>Modifier la date de début de contraception</Text>
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