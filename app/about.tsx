import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Constants from 'expo-constants';


export default function About() {
  const navigation = useNavigation();

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
        <Text style={styles.textTitle}>Version de l'application</Text>
        <Text>{appVersion}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.textTitle}>Application développé par</Text>
        <Text>LEMASSON Louis</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.textTitle}>Application designé par</Text>
        <Text>LEMASSON Louis</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.textTitle}>Code source de l'application</Text>
        <TouchableOpacity onPress={handleSourceCodePress}>
          <Text>https://github.com/LemassonLouis/Clement</Text>
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