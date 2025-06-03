import { ThemeContext } from "@/context/ThemeContext";
import { getTheme } from "@/services/appStyle";
import { ReactNode, useContext } from "react"
import { StyleSheet, Text, View } from "react-native"

type SectionProps = {
  name: string,
  children?: ReactNode
}

export default function Section({ name, children }: SectionProps) {
  const { theme } = useContext(ThemeContext);
  const currentTheme = getTheme(theme.slug);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { backgroundColor: currentTheme.background_2, borderColor: currentTheme.text_color_2, color: currentTheme.text_color }]}>{name}</Text>
      {children}
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 18,
    borderBottomWidth: 1,
  }
});