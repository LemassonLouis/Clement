import { createSession, updateSession } from "@/database/session";
import { formatMilisecondsTime, getDateDifference } from "@/services/date";
import { getSessionsStored, getSessionStore } from "@/store/SessionStore";
import { Ionicons } from "@expo/vector-icons";
import { Suspense, useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { getCurrentSessionStore, getCurrentSessionStored } from "@/store/CurrentSessionStore";
import { TimeTextIcon } from "@/enums/TimeTextIcon";
import { calculateTotalWearing, extractDateSessions, hasSessionsSexWithoutProtection, splitSessionsByDay, calculateTimeUntilUnreachableObjective, timeVerifications } from "@/services/session";
import { getContraceptionMethod } from "@/services/contraception";
import { reScheduleNotifications } from "@/services/notifications";
import TimeText from "../dateAndTime/TimeText";
import CustomModal from "../modals/CustomModal";
import TimeEditor from "../dateAndTime/TimeEditor";
import SexWithoutProtection from "./SexWithoutProtection";
import { UserContext } from "@/context/UserContext";
import { Session } from "@/types/SessionType";
import SessionNote from "./SessionNote";
import { ThemeContext } from "@/context/ThemeContext";
import { getTheme } from "@/services/appStyle";


const today: Date = new Date();


export default function CurrentSession() {
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const currentTheme = getTheme(theme.slug);


  const currentSessionStore = getCurrentSessionStore();
  const currentSessionStored = getCurrentSessionStored();
  const sessionStore = getSessionStore();
  const sessionsStored = getSessionsStored();
  const currentSessions = extractDateSessions(sessionsStored, today);

  const [warningModalVisible, setWarningModalVisible] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  const contraceptionMethod = getContraceptionMethod(user.method);


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

    if(totalWearing > contraceptionMethod.objective_min_extra && totalWearing < contraceptionMethod.objective_min_extra + 1_000
    || totalWearing > contraceptionMethod.objective_min && totalWearing < contraceptionMethod.objective_min + 1_000
    || totalWearing > contraceptionMethod.objective_max && totalWearing < contraceptionMethod.objective_max + 1_000
    || totalWearing > contraceptionMethod.objective_max_extra && totalWearing < contraceptionMethod.objective_max_extra + 1_000
    ) {
      sessionStore.forceNotifyListeners();
    }

    // Check if need to split sessions
    if(currentSessionStored.sessionId && currentSessionStored.sessionStartTime) {
      const splitedSession = splitSessionsByDay({
        id: currentSessionStored.sessionId,
        dateTimeStart: currentSessionStored.sessionStartTime,
        dateTimeEnd: null,
        sexWithoutProtection: hasSessionsSexWithoutProtection(currentSessions),
        note: getCurrentSessionRelativeSession()?.note ?? null,
      });

      if(splitedSession.length > 1) {
        splitedSession.forEach(async session => {
          if(session.id !== 0) {
            await updateSession(session);

            sessionStore.updateSessions([session]);
          }
          else {
            const sessionId = await createSession(session);

            if(sessionId) {
              sessionStore.addSession({
                ...session,
                id: sessionId
              });

              if(session.dateTimeEnd === null) currentSessionStore.updateCurrentSession({ sessionId: sessionId, sessionStartTime: session.dateTimeStart });
            }
          }
        });
      }
    }
  }, [elapsedTime]);


  const getCurrentSessionRelativeSession = (): Session|null => {
    return currentSessions.find(session => session.id === currentSessionStored.sessionId) ?? null;
  }

  const startSession = async () => {
    setElapsedTime(0);

    const startTime: Date = new Date();
    const sexWithoutProtection = hasSessionsSexWithoutProtection(currentSessions);
    const sessionId = await createSession({
      id: 0,
      dateTimeStart: startTime,
      dateTimeEnd: null,
      sexWithoutProtection: sexWithoutProtection,
      note: getCurrentSessionRelativeSession()?.note ?? null,
    });

    if(sessionId) {
      sessionStore.addSession({
        id: sessionId,
        dateTimeStart: startTime,
        dateTimeEnd: null,
        sexWithoutProtection: sexWithoutProtection,
        note: getCurrentSessionRelativeSession()?.note ?? null,
      });
      currentSessionStore.updateCurrentSession({ sessionId: sessionId, sessionStartTime: startTime });
    }

    await reScheduleNotifications(user);
  };

  const stopSession = async (force: boolean = false) => {
    const endTime = new Date();
    const currentRemainingTime: number = calculateTimeUntilUnreachableObjective(contraceptionMethod.objective_min, endTime);

    if(!force && currentRemainingTime > 0 && currentRemainingTime < 7_700_000) { // 2h5m
      setRemainingTime(currentRemainingTime);
      setWarningModalVisible(true);
      return;
    }

    if(currentSessionStored.sessionStartTime && currentSessionStored.sessionId) {
      setElapsedTime(0);

      const splitedSessions = splitSessionsByDay({
        id: currentSessionStored.sessionId,
        dateTimeStart: currentSessionStored.sessionStartTime,
        dateTimeEnd: endTime,
        sexWithoutProtection: hasSessionsSexWithoutProtection(currentSessions),
        note: getCurrentSessionRelativeSession()?.note ?? null,
      });

      splitedSessions.forEach(async session => {
        if(session.id !== 0) {
          await updateSession(session);

          sessionStore.updateSessions([session]);
        }
        else {
          const sessionId = await createSession(session);

          if(sessionId) {
            sessionStore.addSession({
              ...session,
              id: sessionId
            });
          }
        }
      });

      currentSessionStore.updateCurrentSession({ sessionId: null, sessionStartTime: null });

      await reScheduleNotifications(user);
    }
  };


  return (
    <View style={styles.container}>
      <Suspense fallback={<Text>Chargement...</Text>}>
        <View style={styles.main}>
          <View style={styles.buttons}>
            <TouchableOpacity style={[styles.sessionButton, { backgroundColor: currentTheme.background_2 }]} onPress={() => currentSessionStored.sessionId ? stopSession() : startSession()}>
              <Ionicons name={currentSessionStored.sessionId ? 'stop-outline' : 'play-outline'} size={30} color={currentTheme.text_color}/>
            </TouchableOpacity>
          </View>

          <View style={[styles.durations, { borderLeftColor: currentTheme.background_3 }]}>
            <View style={{marginLeft: -10}}>
              <TimeEditor
                icon={TimeTextIcon.CALENDAR_START}
                date={currentSessionStored.sessionStartTime}
                setDate={async (date) => {
                  const ok = timeVerifications({
                    id: currentSessionStored.sessionId ?? 0,
                    dateTimeStart: date,
                    dateTimeEnd: new Date(),
                    sexWithoutProtection: false,
                    note: null,
                  }, date, new Date());

                  if(ok) {
                    const newSession: Session = {
                      id: currentSessionStored.sessionId!,
                      dateTimeStart: date,
                      dateTimeEnd: null,
                      sexWithoutProtection: currentSessions.some(session => session.sexWithoutProtection === true),
                      note: getCurrentSessionRelativeSession()?.note ?? null,
                    };

                    await updateSession(newSession);
                    currentSessionStored.sessionStartTime = date;
                    sessionStore.updateSessions([newSession]);

                    await reScheduleNotifications(user);
                  }
                }}
              />
            </View>
            <TimeText icon={TimeTextIcon.CLOCK_FAST} value={currentSessionStored.sessionId ? formatMilisecondsTime(elapsedTime) : null} />
          </View>

          <View>
            <SessionNote session={getCurrentSessionRelativeSession()} disabled={getCurrentSessionRelativeSession() === null} />
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
        <Text style={{textAlign: "center", color: currentTheme.text_color}}>Il ne vous reste plus que {formatMilisecondsTime(remainingTime)} avant de ne plus pouvoir réaliser l'objectif minimal</Text>
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
  },
  durations: {
    flex: 4/7,
    justifyContent: 'space-evenly',
    gap: 10,
    marginLeft: 10,
    paddingLeft: 10,
    borderLeftWidth: 1,
  },
})
