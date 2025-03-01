import { StyleSheet, Text, View } from "react-native";
import CalendarIcon from "./CalendarIcon";


export default function CalendarDay(day: any) { // FIXME : type day
  return (
    <View style={[styles.calendarDay, !day.isCurrentMonth && styles.calendarDayNonCurrentMonth]}>
      <Text style={styles.calendarDayText}>{day.number}</Text>
      <View>
        <CalendarIcon status={day.status} hadSex={day.hadSex} />
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  calendarDay: {
    flex: 1/7,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  calendarDayNonCurrentMonth: {
    opacity: 0.25
  },
  calendarDayText: {
    marginBottom: 5
  },
})