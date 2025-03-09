import CalendarIcon from "@/components/CalendarIcon";
import CurrentSession from "@/components/CurrentSession";
import ProgressIndicator from "@/components/ProgressIndicator";
import Session from "@/components/Session";
import SexWithoutProtection from "@/components/sexWithoutProtection";
import { deserializeSession } from "@/database/session";
import { getStartAndEndDate, isDateBetween, isDateCurrentDay } from "@/services/date";
import { calculateTotalWearing, getColorFromStatus, getStatusFromTotalWearing } from "@/services/session";
import { getSessionStore } from "@/store/SessionStore";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList, ScrollView } from "react-native";
import * as Progress from 'react-native-progress';

const deserializeDay = (day: DayInterface): DayInterface => {
  return {
    date: new Date(day.date),
    isCurrentMonth: day.isCurrentMonth,
    sessions: day.sessions.map(session => deserializeSession(session))
  }
}

export default function dayDetail() {
  const params = useLocalSearchParams();
  const day = deserializeDay(JSON.parse(String(params.day)));

  const sessionStore = getSessionStore();
  const sessionsStored = useSyncExternalStore(
    useCallback((callback) => sessionStore.subscribe(callback), [sessionStore]),
    useCallback(() => sessionStore.getSessions(), [sessionStore])
  );

  const getCurrentSessions = (sessions: SessionInterface[], date: Date) => {
    return sessions.filter(session => {
      const { dateStart, dateEnd } = getStartAndEndDate(day.date);
      return isDateBetween(session.date_time_end, dateStart, dateEnd);
    });
  }

  const currentSessions = getCurrentSessions(sessionsStored, day.date);

  const [totalWearing, setTotalWearing] = useState(calculateTotalWearing(currentSessions));
  const [status, setStatus] = useState(getStatusFromTotalWearing(totalWearing));
  const [sexWithoutProtection, setSexWithoutProtection] = useState(currentSessions.some(session => session.sexWithoutProtection));

  const progressBarWidth: number = Dimensions.get('window').width * 0.8;

  useEffect(() => {
    const fetchData = async () => {
      await sessionStore.refreshSessions(day.date.getFullYear(), day.date.getMonth());
      const currentSessions = getCurrentSessions(sessionsStored, day.date);

      setTotalWearing(calculateTotalWearing(currentSessions));
      setStatus(getStatusFromTotalWearing(totalWearing));
      setSexWithoutProtection(currentSessions.some(session => session.sexWithoutProtection));
    }

    fetchData();
  }, [sessionsStored]);


  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}> {day.date.toLocaleDateString('fr-FR', { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</Text>

        <View style={styles.iconContainer}>
          <CalendarIcon status={status} sexWithoutProtection={sexWithoutProtection} size={100} />
        </View>

        <View style={styles.progressContainer}>
          <Progress.Bar style={styles.progressBar} progress={totalWearing / 86_400_000} width={progressBarWidth} height={10} color={getColorFromStatus(status)}/>
          <ProgressIndicator hour={12} progressBarWidth={progressBarWidth} isTop={false} />
          <ProgressIndicator hour={14} progressBarWidth={progressBarWidth} isTop={true} />
          <ProgressIndicator hour={16} progressBarWidth={progressBarWidth} isTop={false} />
          <ProgressIndicator hour={18} progressBarWidth={progressBarWidth} isTop={true} />
        </View>

        <View style={styles.currentSession}>
          {isDateCurrentDay(day.date) ?
            <CurrentSession/>
          :
            <SexWithoutProtection
              date={day.date}
              sexWithoutProtection={sexWithoutProtection}
              setSexWithoutProtection={setSexWithoutProtection}
            />
          }
        </View>

        <FlatList
          style={styles.sessions}
          numColumns={1}
          scrollEnabled={false}
          data={currentSessions}
          keyExtractor={session => session.id.toString()}
          renderItem={({item}) => <Session {...item}/>}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  title: {
    marginBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
    textTransform: 'capitalize',
  },
  iconContainer: {
    marginBottom: 20,
  },
  progressContainer: {
    position: 'relative',
    marginTop: 15,
  },
  progressBar: {
    // flex: 1
  },
  currentSession: {
    width: '100%',
    marginTop: 50,
  },
  sessions: {
    width: '80%',
    marginTop: 10,
  }
});