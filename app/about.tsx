import { useNavigation } from "expo-router";
import { useContext, useEffect } from "react";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Constants from 'expo-constants';
import { ThemeContext } from "@/context/ThemeContext";
import { getTheme } from "@/services/appStyle";


export default function About() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const currentTheme = getTheme(theme.slug);

  useEffect(() => {
    navigation.setOptions({ title: "À propos"});
  }, [navigation]);

  const appVersion = Constants.expoConfig?.version;

  const handleSourceCodePress = () => {
    Linking.openURL('https://github.com/LemassonLouis/Clement');
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={[styles.textTitle, { color: currentTheme.text_color }]}>Version de l'application</Text>
        <Text style={{ color: currentTheme.text_color }}>{appVersion}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.textTitle, { color: currentTheme.text_color }]}>Application développé par</Text>
        <Text style={{ color: currentTheme.text_color }}>LEMASSON Louis</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.textTitle, { color: currentTheme.text_color }]}>Application designé par</Text>
        <Text style={{ color: currentTheme.text_color }}>LEMASSON Louis</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.textTitle, { color: currentTheme.text_color }]}>Code source de l'application</Text>
        <TouchableOpacity onPress={handleSourceCodePress}>
          <Text style={{ color: currentTheme.text_color }}>https://github.com/LemassonLouis/Clement</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    width: '80%',
    marginHorizontal: 'auto',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  textTitle: {
    fontWeight: 500,
  }
});