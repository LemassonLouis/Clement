import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CalendarIcon from "./CalendarIcon";
import { useNavigation } from "expo-router";
import { isDateToday, isDateInUserContraceptionRange } from "@/services/date";
import { getStatusFromTotalWearing, calculateTotalWearing } from "@/services/session";
import React, { useContext } from "react";
import { NavigationProp } from "@react-navigation/native";
import { Status } from "@/enums/Status";
import { UserContext } from "@/context/UserContext";
import { Day } from "@/types/DayType";
import { ThemeContext } from "@/context/ThemeContext";
import { getTheme } from "@/services/appStyle";


type NavigationType = NavigationProp<RootStackParamList, 'dayDetail'>;


function CalendarDay(day: Day) {
  const navigation = useNavigation<NavigationType>();
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const currentTheme = getTheme(theme.slug);

  const handlePress = () => {
    navigation.navigate("dayDetail", { day: JSON.stringify(day) });
  };

  const totalWearing = calculateTotalWearing(day.sessions);
  const status = totalWearing > 0 || isDateInUserContraceptionRange(user, day.date) ? getStatusFromTotalWearing(user, totalWearing) : Status.NONE;
  const sexWithoutProtection: boolean = day.sessions.some(session => session?.sexWithoutProtection);

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.calendarLink, { borderRightColor: currentTheme.text_color_2, borderTopColor: currentTheme.text_color_2 }, isDateToday(day.date) && { backgroundColor: currentTheme.background_3 }]}>
      <View style={[styles.calendarDay, !day.isCurrentMonth && styles.calendarDayNonCurrentMonth]}>
        <Text style={[styles.calendarDayText, { color: currentTheme.text_color }]}>{day.date.getDate()}</Text>
        <View>
          <CalendarIcon status={status} sexWithoutProtection={sexWithoutProtection} size={25} />
        </View>
      </View>
    </TouchableOpacity>
  )
}


export default React.memo(CalendarDay);


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