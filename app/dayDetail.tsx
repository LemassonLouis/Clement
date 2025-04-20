import CalendarIcon from "@/components/CalendarIcon";
import CreateSessionModal from "@/components/CreateSessionModal";
import CurrentSession from "@/components/CurrentSession";
import ProgressBarDetails from "@/components/ProgressBarDetails";
import ProgressIndicator from "@/components/ProgressIndicator";
import Session from "@/components/Session";
import SexWithoutProtection from "@/components/SexWithoutProtection";
import { deserializeSession } from "@/database/session";
import { ContraceptionMethods } from "@/enums/ContraceptionMethod";
import { Status } from "@/enums/Status";
import { getContraceptionMethod } from "@/services/contraception";
import { isDateToday, isDateInUserContraceptionRange, formatMilisecondsTime } from "@/services/date";
import { calculateTotalWearing, extractDateSessions, getColorFromStatus, getStatusFromTotalWearing } from "@/services/session";
import { getCurrentSessionStored } from "@/store/CurrentSessionStore";
import { getSessionsStored } from "@/store/SessionStore";
import { getUserStore } from "@/store/UserStore";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList, ScrollView, TouchableOpacity } from "react-native";
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
  const navigation = useNavigation();
  const day = deserializeDay(JSON.parse(String(params.day)));
  const sessionsStored = getSessionsStored();
  const currentSessionStored = getCurrentSessionStored();

  const [currentSessions, setCurrentSessions] = useState<SessionInterface[]>(extractDateSessions(sessionsStored, day.date));
  const [totalWearing, setTotalWearing] = useState<number>(calculateTotalWearing(currentSessions));
  const [status, setStatus] = useState<string>(totalWearing > 0 || isDateInUserContraceptionRange(day.date) ? getStatusFromTotalWearing(totalWearing) : Status.NONE);
  const [sexWithoutProtection, setSexWithoutProtection] = useState<boolean>(currentSessions.some(session => session.sexWithoutProtection));
  const [createSessionModalVisible, setCreateSessionModalVisible] = useState<boolean>(false);
  const [showProgressBars, setShowProgessBars] = useState<boolean>(false);

  const contraceptionMethod = getContraceptionMethod(getUserStore().getUser()?.method ?? ContraceptionMethods.ANDRO_SWITCH);
  const notSameObjectiveMinMax = contraceptionMethod.objective_min !== contraceptionMethod.objective_max;

  const progressBarWidth: number = Dimensions.get('window').width * 0.8;

  useEffect(() => {
    navigation.setOptions({ title: "Détails du jour"});
  }, [navigation]);

  useEffect(() => {
    const newCurrentSessions = extractDateSessions(sessionsStored, day.date);
    const newTotalWearing = calculateTotalWearing(newCurrentSessions);
    const newStatus = newTotalWearing > 0 || isDateInUserContraceptionRange(day.date) ? getStatusFromTotalWearing(newTotalWearing) : Status.NONE;
    const newSexWithoutProtection = newCurrentSessions.some(session => session.sexWithoutProtection);

    setCurrentSessions(newCurrentSessions);
    setTotalWearing(newTotalWearing);
    setStatus(newStatus);
    setSexWithoutProtection(newSexWithoutProtection);
  }, [sessionsStored]);


  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (currentSessionStored.sessionStartTime) {
      interval = setInterval(() => {
        const newCurrentSessions = extractDateSessions(sessionsStored, day.date);
        const newTotalWearing = calculateTotalWearing(newCurrentSessions);

        setTotalWearing(newTotalWearing);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentSessionStored.sessionStartTime, sessionsStored]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}> {day.date.toLocaleDateString('fr-FR', { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</Text>

        <View style={styles.iconContainer}>
          <CalendarIcon status={status} sexWithoutProtection={sexWithoutProtection} size={100} />
        </View>

        <TouchableOpacity onPress={() => setShowProgessBars(!showProgressBars)}>
          <View style={[styles.progressBarContainer, showProgressBars && styles.progressBarDetailsContainer]}>
            {!showProgressBars ?
              <>
                <Progress.Bar progress={totalWearing / 86_400_000} width={progressBarWidth} height={10} color={getColorFromStatus(status)}/>
                <ProgressIndicator hour={contraceptionMethod.objective_min_extra / 3_600_000} progressBarWidth={progressBarWidth} isTop={false} />
                <ProgressIndicator hour={contraceptionMethod.objective_min / 3_600_000} progressBarWidth={progressBarWidth} isTop={true} />
                {notSameObjectiveMinMax && <ProgressIndicator hour={contraceptionMethod.objective_max / 3_600_000} progressBarWidth={progressBarWidth} isTop={false} />}
                <ProgressIndicator hour={contraceptionMethod.objective_max_extra / 3_600_000} progressBarWidth={progressBarWidth} isTop={notSameObjectiveMinMax} />
              </>
            :
              <>
                <ProgressBarDetails
                  progressBarWidth={progressBarWidth}
                  date={day.date}
                  objective={contraceptionMethod.objective_min_extra}
                  totalWearing={totalWearing}
                />
                <ProgressBarDetails
                  progressBarWidth={progressBarWidth}
                  date={day.date}
                  objective={contraceptionMethod.objective_min}
                  totalWearing={totalWearing}
                />
                {notSameObjectiveMinMax && <ProgressBarDetails
                  progressBarWidth={progressBarWidth}
                  date={day.date}
                  objective={contraceptionMethod.objective_max}
                  totalWearing={totalWearing}
                />}
                <ProgressBarDetails
                  progressBarWidth={progressBarWidth}
                  date={day.date}
                  objective={contraceptionMethod.objective_max_extra}
                  totalWearing={totalWearing}
                />
              </>
            }
          </View>
        </TouchableOpacity>
        
        <View style={styles.total}>
          <Text>Temps de port total : {formatMilisecondsTime(totalWearing)}</Text>
        </View>

        <View style={styles.currentSession}>
          {isDateToday(day.date) ? <CurrentSession/> : <SexWithoutProtection date={day.date}/>}
        </View>

        <FlatList
          style={styles.sessions}
          numColumns={1}
          scrollEnabled={false}
          data={currentSessions.sort((a,b) => {
            return a.dateTimeStart < b.dateTimeStart ? -1
              : a.dateTimeStart > b.dateTimeStart ? 1
              : 0;
          })}
          keyExtractor={session => session.id.toString()}
          renderItem={({item}) => <Session {...item}/>}
        />

        {(totalWearing > 0 || isDateInUserContraceptionRange(day.date)) && <>
          <TouchableOpacity style={styles.plusButton} onPress={() => setCreateSessionModalVisible(true)}>
            <Feather name='plus' size={35} color='#000'/>
          </TouchableOpacity>

          <CreateSessionModal
            date={day.date}
            sexWithoutProtection={sexWithoutProtection}
            visible={createSessionModalVisible}
            setVisible={setCreateSessionModalVisible}
          />
        </>}
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
  progressBarContainer: {
    position: 'relative',
    marginTop: 15,
  },
  progressBarDetailsContainer: {
    marginBottom: -15,
  },
  total: {
    marginTop: 30,
    textAlign: 'center',
  },
  currentSession: {
    width: '100%',
    marginTop: 20,
  },
  sessions: {
    width: '80%',
    marginTop: 10,
  },
  plusButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 50,
  }
});