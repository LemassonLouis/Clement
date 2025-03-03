import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CalendarIcon from "./CalendarIcon";
import { useNavigation } from "expo-router";
import DayInterface from "@/interfaces/DayInterface";


export default function CalendarDay(day: DayInterface) { // FIXME : type day
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("dayDetail", day);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.calendarLink}>
      <View style={[styles.calendarDay, !day.isCurrentMonth && styles.calendarDayNonCurrentMonth]}>
        <Text style={styles.calendarDayText}>{day.daytime}</Text>
        <View>
          <CalendarIcon status={day.status} hadSex={day.hadSex} />
        </View>
      </View>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  calendarLink: {
    flex: 1/7,
    flexShrink: 0,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 7,
    paddingTop: 7,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderRightColor: '#ddd',
    borderTopColor: '#ddd',
  },
  calendarDay: {
    alignItems: 'center',
    width: '100%',
  },
  calendarDayNonCurrentMonth: {
    opacity: 0.3
  },
  calendarDayText: {
    marginBottom: 5
  },
})