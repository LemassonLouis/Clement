import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CalendarDay from "./CalendarDay";
import DayInterface from "@/interfaces/DayInterface";
import { DaysOfWeek } from "@/enums/DaysOfWeek";
import { MonthNames } from "@/enums/MonthNames";


const getCalendarDays = (year: number, month: number) => {
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayWeekday = (firstDayOfMonth.getDay() + 6) % 7;
  const numDaysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const lastDayOfPrevMonth = new Date(year, month, 0).getDate();

  // TEMP
  const states = ['none', 'failed', 'warning', 'successed', 'reached', 'exceeded'];
  const getRandomStatus = () => states[Math.floor(Math.random() * states.length)];
  const getRandomHadSex = () => Math.random() > 0.7;

  const days: Array<DayInterface> = [];

  // Start with days before current month
  for (let i = firstDayWeekday; i > 0; i--) {
    days.push({
      daytime: lastDayOfPrevMonth - i + 1,
      isCurrentMonth: false,
      status: getRandomStatus(),
      hadSex: getRandomHadSex()
    });
  }

  // Add days in current month
  for (let i = 1; i <= numDaysInCurrentMonth; i++) {
    days.push({
      daytime: i,
      isCurrentMonth: true,
      status: getRandomStatus(),
      hadSex: getRandomHadSex(),
    });
  }

  // Complete with days after current month
  while (days.length % 7 !== 0) {
    days.push({
      daytime: days.length - numDaysInCurrentMonth - firstDayWeekday + 1,
      isCurrentMonth: false,
      status: getRandomStatus(),
      hadSex: getRandomHadSex(),
    });
  }

  return days;
};


export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = getCalendarDays(year, month);

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


  return (
    <View style={styles.calendar}>
      <View style={styles.monthBar}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.monthButton}>
          <Text style={styles.monthButtonText}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.monthText}>
          {currentMonthName} {year}
        </Text>

        <TouchableOpacity onPress={goToNextMonth} style={styles.monthButton}>
          <Text style={styles.monthButtonText}>{'>'}</Text>
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
    paddingRight: 20,
    paddingLeft: 20,
    backgroundColor: '#e5e5e5',
    borderRadius: 5,
  },
  monthButtonText: {
    fontSize: 20,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
  },
  calendarDaysOfWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
    // paddingBottom: 5,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ddd'
  },
})