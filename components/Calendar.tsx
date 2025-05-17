import { Suspense, useCallback, useContext, useEffect, useState, useSyncExternalStore } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CalendarDay from "./CalendarDay";
import { DaysOfWeek } from "@/enums/DaysOfWeek";
import { MonthNames } from "@/enums/MonthNames";
import { getCalendarStartMonday, getCalendarLastSunday, getStartAndEndDate, isDateBetween } from "@/services/date";
import { getSessionStore } from "@/store/SessionStore";
import { UserContext } from "@/context/UserContext";
import { Session } from "@/types/SessionType";
import { Day } from "@/types/DayType";
import CustomModal from "./modals/CustomModal";
import MonthSelectorCalendar from 'react-native-month-selector';
import PreviousIcon from "./Icons/PreviousIcon";
import NextIcon from "./Icons/NextIcon";
import moment, { Moment } from "moment";
import 'moment/locale/fr';


const getCalendarDays = (year: number, month: number, sessions: Session[]): Day[] => {
  const firstDayOfMonth: Date = new Date(year, month, 1);
  const calendarFirstMonday: Date = getStartAndEndDate(getCalendarStartMonday(firstDayOfMonth)).dateStart;
  const calendarLastSunday: Date = getStartAndEndDate(getCalendarLastSunday(firstDayOfMonth)).dateEnd;

  const days: Day[] = [];

  let currentDate: Date = new Date(calendarFirstMonday);
  while (currentDate <= calendarLastSunday) {
    const { dateStart, dateEnd } = getStartAndEndDate(currentDate);
    const daySessions = sessions.filter(session => isDateBetween(session.dateTimeStart, dateStart, dateEnd));

    days.push({
      date: new Date(currentDate),
      sessions: daySessions,
      isCurrentMonth: currentDate.getMonth() === month,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
};


export default function Calendar() {
  const { user } = useContext(UserContext);

  const sessionStore = getSessionStore();
  const sessionsStored = useSyncExternalStore(
    useCallback((callback) => sessionStore.subscribe(callback), [sessionStore]),
    useCallback(() => sessionStore.getSessions(), [sessionStore])
  );

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [monthYearPickerModalVisible, setMonthYearPickerModalVisible] = useState<boolean>(false);
  const [monthYearPickerValue, setMonthYearPickerValue] = useState<Moment>(moment());

  const year: number = currentDate.getFullYear();
  const month: number = currentDate.getMonth();

  const daysOfWeek: DaysOfWeek[] = Object.values(DaysOfWeek);
  const monthNames: MonthNames[] = Object.values(MonthNames);
  const currentMonthName: MonthNames = monthNames[month];

  // Navigate to previous month
  const goToPreviousMonth = () => {
    const newDate: Date = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    setCurrentDate(newDate);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const newDate: Date = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    setCurrentDate(newDate);
  };

  useEffect(() => {
    const fetchData = async () => {
      await sessionStore.refreshSessions(year, month);
    }

    fetchData();
  }, [sessionsStored, user]);

  const days = getCalendarDays(year, month, sessionsStored);

  return (
    <View style={styles.calendar}>
      <View style={styles.monthBar}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.monthButton}>
          <PreviousIcon/>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMonthYearPickerModalVisible(true)}>
          <Text style={styles.monthText}>
            {currentMonthName} {year}
          </Text>
        </TouchableOpacity>

        <CustomModal
          title="Changer le mois affiché"
          visible={monthYearPickerModalVisible}
          actionFalseText="Annuler"
          actionFalse={() => {
            setMonthYearPickerValue(moment());
            setMonthYearPickerModalVisible(false);
          }}
          actionTrueText="Modifier"
          actionTrue={() => {
            const newDate: Date = new Date(monthYearPickerValue.year(), monthYearPickerValue.month());
            setCurrentDate(newDate);
            setMonthYearPickerModalVisible(false);
          }}
        >
          <MonthSelectorCalendar
            selectedDate={monthYearPickerValue}
            prevIcon={<PreviousIcon/>}
            nextIcon={<NextIcon/>}
            maxDate={moment(`${currentDate.getFullYear() + 10}-12-31`)}
            localeLanguage="fr"
            onMonthTapped={date => setMonthYearPickerValue(date)}
          />
        </CustomModal>

        <TouchableOpacity onPress={goToNextMonth} style={styles.monthButton}>
          <NextIcon/>
        </TouchableOpacity>
      </View>

      <View style={styles.calendarDaysOfWeek}>
        {daysOfWeek.map((dayOfWeek, index) => (
          <Text key={index}>{dayOfWeek}</Text>
        ))}
      </View>

      <Suspense fallback={<Text>Chargement...</Text>}>
        <FlatList
          numColumns={7}
          data={days}
          keyExtractor={day => day.date.toISOString()}
          renderItem={({item}) => <CalendarDay {...item}/>}
        />
      </Suspense>
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