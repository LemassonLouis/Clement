import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CalendarDay from "./CalendarDay";
import DayInterface from "@/interfaces/DayInterface";
import { DaysOfWeek } from "@/enums/DaysOfWeek";
import { MonthNames } from "@/enums/MonthNames";
import { getSessionByDate } from "@/database/session";
import { getStatusFromTotalWearing, getTotalWearing } from "@/services/session";
import { Feather } from "@expo/vector-icons";

const getDaySessions = async (date: Date) => {
  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  const dateEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

  return await getSessionByDate(dateStart.toISOString(), dateEnd.toISOString());
}

const getCalendarDays = async (year: number, month: number) => {
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayWeekday = (firstDayOfMonth.getDay() + 6) % 7;
  const numDaysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const lastDayOfPrevMonth = new Date(year, month, 0).getDate();

  const getRandomSexWithoutProtection = () => Math.random() > 0.7; // TEMP

  const days: Array<DayInterface> = [];

  // Start with days before current month
  for (let i = firstDayWeekday; i > 0; i--) {
    const date = new Date(year, ((month-1 % 12) + 12) % 12, lastDayOfPrevMonth - i + 1);
    console.log("date", date);
    const daySessions = await getDaySessions(date);
    const totalWearing = getTotalWearing(daySessions);

    days.push({
      date: date,
      isCurrentMonth: false,
      status: getStatusFromTotalWearing(totalWearing),
      sexWithoutProtection: getRandomSexWithoutProtection()
    });
  }

  // Add days in current month
  for (let i = 1; i <= numDaysInCurrentMonth; i++) {
    const date = new Date(year, month, i);
    const daySessions = await getDaySessions(date);
    const totalWearing = getTotalWearing(daySessions);

    days.push({
      date: date,
      isCurrentMonth: true,
      status: getStatusFromTotalWearing(totalWearing),
      sexWithoutProtection: getRandomSexWithoutProtection(),
    });
  }

  // Complete with days after current month
  while (days.length % 7 !== 0) {
    const date = new Date(year, month + 1, days.length - numDaysInCurrentMonth - firstDayWeekday + 1);
    console.log("date", date);
    const daySessions = await getDaySessions(date);
    const totalWearing = getTotalWearing(daySessions);

    days.push({
      date: date,
      isCurrentMonth: false,
      status: getStatusFromTotalWearing(totalWearing),
      sexWithoutProtection: getRandomSexWithoutProtection(),
    });
  }

  return days;
};


export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState<Array<DayInterface>>([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysOfWeek = Object.values(DaysOfWeek);
  const monthNames = Object.values(MonthNames);
  const currentMonthName = monthNames[month];

  // Navigate to previous month
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    setCurrentDate(newDate);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    setCurrentDate(newDate);
  };


  useEffect(() => {
      const fetchData = async () => {
        const calendarDays = await getCalendarDays(year, month);
        setDays(calendarDays);
      };

      fetchData();
  }, [currentDate]);


  return (
    <View style={styles.calendar}>
      <View style={styles.monthBar}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.monthButton}>
          <Feather name="chevron-left" size={25} color='#000'/>
        </TouchableOpacity>

        <Text style={styles.monthText}>
          {currentMonthName} {year}
        </Text>

        <TouchableOpacity onPress={goToNextMonth} style={styles.monthButton}>
        <Feather name="chevron-right" size={25} color='#000'/>
        </TouchableOpacity>
      </View>

      <View style={styles.calendarDaysOfWeek}>
        {daysOfWeek.map((dayOfWeek, index) => (
          <Text key={index}>{dayOfWeek}</Text>
        ))}
      </View>

      <FlatList
        numColumns={7}
        data={days}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item}) => <CalendarDay {...item}/>}
      />
    </View>
  )
}


const styles = StyleSheet.create({
  calendar: {
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: '#f9f9f9'
  },
  monthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  monthButton: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 12,
    paddingLeft: 12,
    backgroundColor: '#e5e5e5',
    borderRadius: 5,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
  },
  calendarDaysOfWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
})