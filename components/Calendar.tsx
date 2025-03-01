import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const getCalendarDays = (year: number, month: number) => {
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayWeekday = (firstDayOfMonth.getDay() + 6) % 7;
  const numDaysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const lastDayOfPrevMonth = new Date(year, month, 0).getDate();

  // TEMP
  const states = ['none', 'failed', 'warning', 'successed', 'reached', 'exceeded'];
  const getRandomStatus = () => states[Math.floor(Math.random() * states.length)];

  const days = [];

  // Jours du mois précédent
  for (let i = firstDayWeekday; i > 0; i--) {
    days.push({
      day: lastDayOfPrevMonth - i + 1,
      isCurrentMonth: false,
      status: getRandomStatus(),
    });
  }

  // Jours du mois en cours
  for (let i = 1; i <= numDaysInCurrentMonth; i++) {
    days.push({
      day: i,
      isCurrentMonth: true,
      status: getRandomStatus(),
    });
  }

  // Compléter avec les jours du mois suivant pour avoir une grille complète
  while (days.length % 7 !== 0) {
    days.push({
      day: days.length - numDaysInCurrentMonth - firstDayWeekday + 1,
      isCurrentMonth: false,
      status: getRandomStatus(),
    });
  }

  return days;
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = getCalendarDays(year, month);

  const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const currentMonthName = monthNames[month];

  // Fonction pour naviguer vers le mois précédent
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    setCurrentDate(newDate);
  };

  // Fonction pour naviguer vers le mois suivant
  const goToNextMonth = () => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    setCurrentDate(newDate);
  };

  const getIconForStatus = (status: string) => {
    switch (status) {
      case 'failed':
        return <Feather name="x-circle" size={25} color="#FF5656" />;
      case 'warning':
        return <Feather name="alert-circle" size={25} color="#FFC249" />;
      case 'successed':
        return <Feather name="check-circle" size={25} color="#49B24E" />;
      case 'reached':
        return <Feather name="check-circle" size={25} color="#6DDAFF" />;
      case 'exceeded':
        return <Feather name="check-circle" size={25} color="#D67FFF" />;
      default:
        return <Feather name="help-circle" size={25} color="#B5B5B5" />;
    }
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
        {daysOfWeek.map(day => (
          <Text>{day}</Text>
        ))}
      </View>

      <FlatList
        style={styles.calendarDays}
        numColumns={7}
        data={days}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item}) => (
          <View style={[styles.calendarDay, !item.isCurrentMonth && styles.calendarDayNonCurrentMonth]}>
            <Text style={styles.calendarDayText}>{item.day}</Text>
            {getIconForStatus(item.status)}
          </View>
        )
      }/>
    </View>
  )
}

const styles = StyleSheet.create({
  calendar: {

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
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
  },
  monthButtonText: {
    fontSize: 20,
    color: '#333',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  calendarDaysOfWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  calendarDays: {

  },
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