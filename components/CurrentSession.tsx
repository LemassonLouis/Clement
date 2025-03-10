import { createSession, updateSessionDateTimeEnd } from "@/database/session";
import { formatElapsedTime, getDateDifference } from "@/services/date";
import { getSessionStore } from "@/store/SessionStore";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Suspense, useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import SexWithoutProtection from "./sexWithoutProtection";
import { getCurrentSessionStore } from "@/store/CurrentSessionStore";

export default function CurrentSession() {
  const currentSessionStore = getCurrentSessionStore();
  const currentSessionStored = useSyncExternalStore(
    useCallback((callback) => currentSessionStore.subscribe(callback), [currentSessionStore]),
    useCallback(() => currentSessionStore.getCurrentSession(), [currentSessionStore])
  );

  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [sexWithoutProtection, setSexWithoutProtection] = useState<boolean>(false);
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
        setElapsedTime(currentSessionStored.sessionStartTime ? getDateDifference(currentSessionStored.sessionStartTime, new Date()) : 0);
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
      sessionStore.addSession({id: sessionId, date_time_start: startTime, date_time_end: null, sexWithoutProtection: sexWithoutProtection});
      currentSessionStore.updateCurrentSession({ sessionId: sessionId, sessionStartTime: startTime });
    }
  };

  const stopSession = async () => {
    const endTime = new Date();

    if(currentSessionStored.sessionStartTime && currentSessionStored.sessionId) {
      setElapsedTime(0);

      sessionStore.updateSession({
        id: currentSessionStored.sessionId,
        date_time_start: currentSessionStored.sessionStartTime,
        date_time_end: endTime,
        sexWithoutProtection: sexWithoutProtection
      });
      currentSessionStore.updateCurrentSession({ sessionId: null, sessionStartTime: null });

      await updateSessionDateTimeEnd(currentSessionStored.sessionId, endTime.toISOString());
    }
  };


  const formatTime = (time: Date) => {
    return `${time.getHours()}h ${time.getMinutes()}m ${time.getSeconds()}s`
  }


  return (
    <View style={styles.container}>
      <Suspense fallback={<Text>Chargement...</Text>}>
        <View style={styles.main}>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.sessionButton} onPress={currentSessionStored.sessionId ? stopSession : startSession}>
              <Ionicons name={currentSessionStored.sessionId ? 'stop-outline' : 'play-outline'} size={30} color='#000'/>
            </TouchableOpacity>
          </View>

          <View style={styles.durations}>
            <View style={styles.duration}>
              <MaterialCommunityIcons name='calendar-start' size={25} color='#000'/>
              <Text style={styles.durationText}>{currentSessionStored.sessionStartTime ? formatTime(currentSessionStored.sessionStartTime) : '- - -'}</Text>
            </View>

            <View style={styles.duration}>
              <MaterialCommunityIcons name='clock-fast' size={25} color='#000'/>
              <Text style={styles.durationText}>{currentSessionStored.sessionId ? formatElapsedTime(elapsedTime) : '- - -'}</Text>
            </View>
          </View>
        </View>

        <SexWithoutProtection
          date={date}
          sexWithoutProtection={sexWithoutProtection}
          setSexWithoutProtection={setSexWithoutProtection}
        />
      </Suspense>
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
