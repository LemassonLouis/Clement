import ContraceptionMethodFrom from "@/components/forms/ContraceptionMethodForm";
import { ThemeContext } from "@/context/ThemeContext";
import { getTheme } from "@/services/appStyle";
import { useNavigation } from "expo-router";
import { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";


export default function ContraceptionMethod() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const currentTheme = getTheme(theme.slug);

  useEffect(() => {
    navigation.setOptions({ title: "Méthode de contraception"});
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: currentTheme.text_color }]}>Modifier la méthode de contraception</Text>
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