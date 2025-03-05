import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CalendarIcon from "./CalendarIcon";
import { useNavigation } from "expo-router";
import { isDateCurrentDay } from "@/services/date";
import { getStatusFromTotalWearing, getTotalWearing } from "@/services/session";


export default function CalendarDay(day: DayInterface) { // FIXME : type day
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("dayDetail", day);
  };

  const totalWearing: number = getTotalWearing(day.sessions);
  const status: string = getStatusFromTotalWearing(totalWearing);
  const sexWithoutProtection: boolean = day.sessions.some(session => session?.sexWithoutProtection);

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.calendarLink, isDateCurrentDay(day.date) && styles.calendarDayCurrentDay]}>
      <View style={[styles.calendarDay, !day.isCurrentMonth && styles.calendarDayNonCurrentMonth]}>
        <Text style={styles.calendarDayText}>{day.date.getDate()}</Text>
        <View>
          <CalendarIcon status={status} sexWithoutProtection={sexWithoutProtection} />
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
  calendarDayCurrentDay: {
    backgroundColor: '#ddd',
  },
  calendarDayText: {
    marginBottom: 5
  },
})