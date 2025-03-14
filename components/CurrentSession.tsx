import { createSession, updateSession } from "@/database/session";
import { formatMilisecondsTime, formatTimefromDate, getDateDifference } from "@/services/date";
import { getSessionStore } from "@/store/SessionStore";
import { Ionicons } from "@expo/vector-icons";
import { Suspense, useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import SexWithoutProtection from "./sexWithoutProtection";
import { getCurrentSessionStore } from "@/store/CurrentSessionStore";
import TimeText from "./TimeText";
import { TimeTextIcon } from "@/enums/TimeTextIcon";
import CustomModal from "./CustomModal";
import { objectivMinRemainingTime } from "@/services/session";
import { makeNotificationPush } from "@/services/notifications";

export default function CurrentSession() {
  const currentSessionStore = getCurrentSessionStore();
  const currentSessionStored = useSyncExternalStore(
    useCallback((callback) => currentSessionStore.subscribe(callback), [currentSessionStore]),
    useCallback(() => currentSessionStore.getCurrentSession(), [currentSessionStore])
  );

  const [warningModalVisible, setWarningModalVisible] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [sexWithoutProtection, setSexWithoutProtection] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const sessionStore = getSessionStore();
  const date = new Date();


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
        // console.log(elapsedTime, elapsedTime % 5000 < 1000);
        // if(elapsedTime % 5000 < 1000) makeNotificationPush('Timer', "Cela fait 5 seconds !");
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentSessionStored.sessionStartTime]);


  // Manage midnight effect
  useEffect(() => {
    const now = new Date();
    if (currentSessionStored.sessionStartTime && now.getHours() === 23 && now.getMinutes() === 59 && now.getSeconds() === 59) {
      const midnightReopenSession = async () => {
        await stopSession();
        setTimeout(() => {
          startSession();
        }, 1000);
      }

      midnightReopenSession();
    }
  }, [elapsedTime]);



  const startSession = async () => {
    setElapsedTime(0);

    const startTime: Date = new Date();
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

      sessionStore.updateSession({
        id: currentSessionStored.sessionId,
        dateTimeStart: currentSessionStored.sessionStartTime,
        dateTimeEnd: endTime,
        sexWithoutProtection: sexWithoutProtection
      });
      currentSessionStore.updateCurrentSession({ sessionId: null, sessionStartTime: null });

      await updateSession(currentSessionStored.sessionId, currentSessionStored.sessionStartTime.toISOString(), endTime.toISOString(), sexWithoutProtection);
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

        <SexWithoutProtection
          date={date}
          sexWithoutProtection={sexWithoutProtection}
          setSexWithoutProtection={setSexWithoutProtection}
        />
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
