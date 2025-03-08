import CalendarIcon from "@/components/CalendarIcon";
import CurrentSession from "@/components/CurrentSession";
import ProgressIndicator from "@/components/ProgressIndicator";
import Session from "@/components/Session";
import { deserializeSession } from "@/database/session";
import { isDateCurrentDay } from "@/services/date";
import { calculateTotalWearing, getColorFromStatus, getStatusFromTotalWearing } from "@/services/session";
import { useLocalSearchParams } from "expo-router";
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

  const totalWearing = calculateTotalWearing(day.sessions);
  const status = getStatusFromTotalWearing(totalWearing);
  const sexWithoutProtection = day.sessions.some(session => session.sexWithoutProtection);

  const progressBarWidth: number = Dimensions.get('window').width * 0.8;

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

        {isDateCurrentDay(day.date) ? <View style={styles.currentSession}><CurrentSession/></View> : ''}

        <FlatList
          style={styles.sessions}
          numColumns={1}
          scrollEnabled={false}
          data={day.sessions}
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
    marginTop: 40,
  }
});