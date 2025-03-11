import TimeTextInterface from "@/interfaces/TimeText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";


export default function TimeText({ value, icon }: TimeTextInterface) {
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
