import { TimeTextIcon } from "@/enums/TimeTextIcon";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";


type TimeTextProps = {
  value: string | null,
  icon: TimeTextIcon,
}


export default function TimeText({ value, icon }: TimeTextProps) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon} size={25} color='#000'/>
      <Text style={styles.text}>{value ?? '- - -'}</Text>
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
