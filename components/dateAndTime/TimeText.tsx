import { ThemeContext } from "@/context/ThemeContext";
import { TimeTextIcon } from "@/enums/TimeTextIcon";
import { getTheme } from "@/services/appStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";


type TimeTextProps = {
  value: string | null,
  icon: TimeTextIcon,
}


export default function TimeText({ value, icon }: TimeTextProps) {
  const { theme } = useContext(ThemeContext);
  const currentTheme = getTheme(theme.slug);

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon} size={25} color={currentTheme.text_color}/>
      <Text style={[ styles.text, { color: currentTheme.text_color }]}>{value ?? '- - -'}</Text>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 10,
  },
});
