import { ThemeContext } from "@/context/ThemeContext";
import { getTheme } from "@/services/appStyle";
import { Feather } from "@expo/vector-icons"
import { useNavigation } from "expo-router";
import { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native"

type SectionOptionProps = {
  name: string,
  navigateTo: string,
  navigateProps?: Object
}

export default function SectionOption({ name, navigateTo, navigateProps }: SectionOptionProps) {
  const navigation = useNavigation<any>();
  const { theme } = useContext(ThemeContext);
  const currentTheme = getTheme(theme.slug);

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: currentTheme.background_3, borderColor: currentTheme.text_color_2 }]} onPress={() => navigation.navigate(navigateTo, navigateProps)}>
      <Text style={[styles.title, { color: currentTheme.text_color }]}>{name}</Text>
      <Feather name="chevron-right" size={25} color={currentTheme.text_color}/>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 16,
  }
})