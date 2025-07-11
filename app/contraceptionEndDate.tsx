import ContraceptionEndDateForm from "@/components/forms/ContraceptionEndDateForm";
import { ThemeContext } from "@/context/ThemeContext";
import { getTheme } from "@/services/appStyle";
import { useNavigation } from "expo-router";
import { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";


export default function ContraceptionEndDate() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const currentTheme = getTheme(theme.slug);

  useEffect(() => {
    navigation.setOptions({ title: "Date de fin de contraception"});
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: currentTheme.text_color }]}>Modifier la date de fin de contraception</Text>
      <ContraceptionEndDateForm autoValidate={true} />
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