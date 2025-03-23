import { createSession, updateSession } from "@/database/session";
import { formatMilisecondsTime, formatTimefromDate, getDateDifference } from "@/services/date";
import { getSessionsStored, getSessionStore } from "@/store/SessionStore";
import { Ionicons } from "@expo/vector-icons";
import { Suspense, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import SexWithoutProtection from "./sexWithoutProtection";
import { getCurrentSessionStore, getCurrentSessionStored } from "@/store/CurrentSessionStore";
import TimeText from "./TimeText";
import { TimeTextIcon } from "@/enums/TimeTextIcon";
import CustomModal from "./CustomModal";
import { calculateTotalWearing, extractDateSessions, hasSessionsSexWithoutProtection, objectivMinRemainingTime } from "@/services/session";
import { getContraceptionMethod } from "@/services/contraception";
import { getUserStore } from "@/store/UserStore";
import { ContraceptionMethods } from "@/enums/ContraceptionMethod";

const today: Date = new Date();

export default function CurrentSession() {
  const currentSessionStore = getCurrentSessionStore();
  const currentSessionStored = getCurrentSessionStored();
  const sessionStore = getSessionStore();
  const sessionsStored = getSessionsStored();
  const currentSessions = extractDateSessions(sessionsStored, today);

  const [warningModalVisible, setWarningModalVisible] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<number>(0);


  // Load current session
  useEffect(() => {
    const fetchData = async () => {
      await currentSessionStore.loadCurrentSession();

      setElapsedTime(currentSessionStored.sessionStartTime ? getDateDifference(currentSessionStored.sessionStartTime, new Date()) : 0);
    };

    fetchData();
  }, []);


  // Calculate elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (currentSessionStored.sessionStartTime) {
      interval = setInterval(() => {
        const elapsedTime = currentSessionStored.sessionStartTime ? getDateDifference(currentSessionStored.sessionStartTime, new Date()) : 0;
        setElapsedTime(elapsedTime);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentSessionStored.sessionStartTime]);


  useEffect(() => {
    const now = new Date();

    // Manage midnight effect
    if (currentSessionStored.sessionStartTime && now.getHours() === 23 && now.getMinutes() === 59 && now.getSeconds() === 59) {
      const midnightReopenSession = async () => {
        await stopSession();
        setTimeout(() => {
          startSession();
        }, 1000);
      }

      midnightReopenSession();
    }

    // Refresh display when objectiv reached
    const totalWearing = calculateTotalWearing(currentSessions);
    const contraceptionMethod = getContraceptionMethod(getUserStore().getUser()?.method ?? ContraceptionMethods.ANDRO_SWITCH);

    if(totalWearing > contraceptionMethod.objective_min_extra && totalWearing < contraceptionMethod.objective_min_extra + 1_000
    || totalWearing > contraceptionMethod.objective_min && totalWearing < contraceptionMethod.objective_min + 1_000
    || totalWearing > contraceptionMethod.objective_max && totalWearing < contraceptionMethod.objective_max + 1_000
    || totalWearing > contraceptionMethod.objective_max_extra && totalWearing < contraceptionMethod.objective_max_extra + 1_000
    ) {
      sessionStore.forceNotifyListeners();
    }
  }, [elapsedTime]);



  const startSession = async () => {
    setElapsedTime(0);

    const startTime: Date = new Date();
    const sexWithoutProtection = hasSessionsSexWithoutProtection(currentSessions);
    const sessionId = await createSession(startTime.toISOString(), null, sexWithoutProtection);

    if(sessionId) {
      sessionStore.addSession({id: sessionId, dateTimeStart: startTime, dateTimeEnd: null, sexWithoutProtection: sexWithoutProtection});
      currentSessionStore.updateCurrentSession({ sessionId: sessionId, sessionStartTime: startTime });
    }
  };

  const stopSession = async (force: boolean = false) => {
    const endTime = new Date();
    const currentRemainingTime: number = objectivMinRemainingTime(endTime);

    if(!force && currentRemainingTime > 0 && currentRemainingTime < 7_700_000) { // 2h5m
      setRemainingTime(currentRemainingTime);
      setWarningModalVisible(true);
      return;
    }

    if(currentSessionStored.sessionStartTime && currentSessionStored.sessionId) {
      setElapsedTime(0);

      const sexWithoutProtection = hasSessionsSexWithoutProtection(currentSessions);

      // TODO : verify and split session if overlap 2 days or more

      await updateSession(currentSessionStored.sessionId, currentSessionStored.sessionStartTime.toISOString(), endTime.toISOString(), sexWithoutProtection);

      sessionStore.updateSessions([{
        id: currentSessionStored.sessionId,
        dateTimeStart: currentSessionStored.sessionStartTime,
        dateTimeEnd: endTime,
        sexWithoutProtection: sexWithoutProtection
      }]);
      currentSessionStore.updateCurrentSession({ sessionId: null, sessionStartTime: null });
    }
  };


  return (
    <View style={styles.container}>
      <Suspense fallback={<Text>Chargement...</Text>}>
        <View style={styles.main}>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.sessionButton} onPress={() => currentSessionStored.sessionId ? stopSession() : startSession()}>
              <Ionicons name={currentSessionStored.sessionId ? 'stop-outline' : 'play-outline'} size={30} color='#000'/>
            </TouchableOpacity>
          </View>

          <View style={styles.durations}>
            <TimeText icon={TimeTextIcon.CALENDAR_START} value={currentSessionStored.sessionStartTime ? formatTimefromDate(currentSessionStored.sessionStartTime) : null} />
            <TimeText icon={TimeTextIcon.CLOCK_FAST} value={currentSessionStored.sessionId ? formatMilisecondsTime(elapsedTime) : null} />
          </View>
        </View>

        <SexWithoutProtection date={today}/>
      </Suspense>

      <CustomModal
        title="Êtes-vous sûr de vouloir arrêter la session ?"
        visible={warningModalVisible}
        actionFalseText="Non"
        actionFalse={() => setWarningModalVisible(false)}
        actionTrueText="Oui"
        actionTrue={() => {
          stopSession(true);
          setWarningModalVisible(false);
        }}
      >
        <Text>Il ne vous reste plus que {formatMilisecondsTime(remainingTime)} avant de ne plus pouvoir réaliser l'objectif minimal</Text>
      </CustomModal>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginTop: 5,
  },
  main: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'column',
  },
  sessionButton: {
    padding: 12,
    borderRadius: 50,
    backgroundColor: '#e5e5e5',
  },
  durations: {
    flex: 3/7,
    justifyContent: 'space-evenly',
    gap: 10,
    marginLeft: 10,
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: '#777'
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchText: {
    marginTop: 2,
    fontSize: 16,
  },
  switch: {
    marginTop: 5,
    marginLeft: 2,
  }
})
