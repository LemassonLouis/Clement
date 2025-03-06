import { createSession, getCurrentSession, updateSessionDateTimeEnd } from "@/database/session";
import { getDateDifference } from "@/services/date";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Suspense, useEffect, useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native"

export default function CurrentSession() {
  const [sessionStarted, setSessionStarted] = useState<boolean>(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [sexWithoutProtection, setSexWithoutProtection] = useState<boolean>(false);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);


  // Load current session
  useEffect(() => {
    const fetchData = async () => {
      const currentSession: SessionInterface | null = await getCurrentSession();
      console.log("currentSession", currentSession);
      if(currentSession) {
        setSessionStarted(true);
        setSessionStartTime(currentSession.date_time_start);
        setElapsedTime(Math.floor(getDateDifference(currentSession.date_time_start, new Date()) / 1000));
        setCurrentSessionId(currentSession.id);
      }
    };

    fetchData();
  }, []);


  // Calculate elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (sessionStarted && sessionStartTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor(getDateDifference(sessionStartTime, new Date()) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [sessionStarted, sessionStartTime]);


  // Manage midnight effect
  useEffect(() => {
    const checkMidnight = setInterval(async () => {
      const now = new Date();
      if (sessionStarted && sessionStartTime && now.getHours() === 23 && now.getMinutes() === 59 && now.getSeconds() === 59) {
        await stopSession();
        setTimeout(() => {
          startSession();
        }, 1000);
      }
    }, 1000);

    return () => clearInterval(checkMidnight);
  }, [sessionStarted, sessionStartTime]);



  const startSession = async () => {
    const startTime: Date = new Date();
    const sessionId = await createSession(startTime.toISOString());

    console.log("sessionId", currentSessionId);

    setSessionStarted(true);
    setSessionStartTime(startTime);
    setCurrentSessionId(sessionId);
  };

  const stopSession = async () => {
    const endTime = new Date();

    await updateSessionDateTimeEnd(currentSessionId, endTime.toISOString());

    setSessionStarted(false);
    setSessionStartTime(null);
    setElapsedTime(0);
  };

  const toggleSexWithoutProtection = async (value: boolean) => {
    setSexWithoutProtection(value);
    
  };

  const formatElapsedTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };


  return (
    <View style={styles.container}>
      <Suspense fallback={<Text>Chargement...</Text>}>
        <View style={styles.main}>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.sessionButton} onPress={sessionStarted ? stopSession : startSession}>
              <Ionicons name={sessionStarted ? 'stop-outline' : 'play-outline'} size={30} color='#000'/>
            </TouchableOpacity>
          </View>

          <View style={styles.durations}>
            <View style={styles.duration}>
              <MaterialCommunityIcons name='calendar-start' size={25} color='#000'/>
              <Text style={styles.durationText}>{sessionStarted ? `${sessionStartTime?.getHours()}h ${sessionStartTime?.getMinutes()}m ${sessionStartTime?.getSeconds()}s` : '- - -'}</Text>
            </View>

            <View style={styles.duration}>
              <MaterialCommunityIcons name='clock-fast' size={25} color='#000'/>
              <Text style={styles.durationText}>{sessionStarted ? formatElapsedTime(elapsedTime) : '- - -'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>Rapport sexuel sans protection</Text>
          <Switch style={styles.switch} value={sexWithoutProtection} onValueChange={toggleSexWithoutProtection} />
        </View>
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
