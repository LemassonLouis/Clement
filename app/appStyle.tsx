import UserStyleForm from "@/components/forms/UserStyleForm";
import { ThemeContext } from "@/context/ThemeContext";
import { getTheme } from "@/services/appStyle";
import { useNavigation } from "expo-router";
import { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";


export default function AppStyle() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const currentTheme = getTheme(theme.slug);

  useEffect(() => {
    navigation.setOptions({ title: "Style de l'application"});
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: currentTheme.text_color }]}>Modifier le style de l'application</Text>
      <UserStyleForm autoValidate={true} />
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