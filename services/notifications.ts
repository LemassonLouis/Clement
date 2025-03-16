import { getSessionStore } from "@/store/SessionStore";
import { registerTaskAsync } from "expo-background-fetch";
import { requestPermissionsAsync, scheduleNotificationAsync, setNotificationHandler } from "expo-notifications";
import { defineTask, isTaskRegisteredAsync } from "expo-task-manager";
import { calculateTotalWearing, extractDateSessions, objectivMinRemainingTime } from "./session";
import { AndroSwitch } from "@/enums/AndroSwitch";


const BACKGROUND_NOTIFICATIONS_TASK  = 'BACKGROUND_NOTIFICATIONS_TASK';


/**
 * Initialize the notification système.
 */
export async function initializeNotifications(): Promise<void> {
  await requestPermissionsAsync();
  setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    })
  });

  await registerBackgroundTask(BACKGROUND_NOTIFICATIONS_TASK, 5 * 60);
}


defineTask(BACKGROUND_NOTIFICATIONS_TASK, async () => {
  console.log("task triggered"); // TEMP

  const remainingTime = objectivMinRemainingTime(new Date());

  // between 2h and 2h10min
  if(remainingTime > 7_200_000 && remainingTime < 7_800_000) {
    makeNotificationPush("Vous n'avez plus beaucoup de temps !", `Il ne vous reste plus que 5 minutes avant de ne plus pouvoir réaliser l'objetif de ${AndroSwitch.OBJECTIVE_MIN / 3_600_000}`);
  }

  // between 0 and 10min
  if(remainingTime > 0 && remainingTime < 600_000) {
    makeNotificationPush("Vous n'avez plus beaucoup de temps !", `Il ne vous reste plus que 2 heures avant de ne plus pouvoir réaliser l'objetif de ${AndroSwitch.OBJECTIVE_MIN / 3_600_000}`);
  }

  const currentSessions = extractDateSessions(getSessionStore().getSessions(), new Date());
  const totalWearing =  calculateTotalWearing(currentSessions);

  // between objectif min and objectif min + 10 min
  if(totalWearing > AndroSwitch.OBJECTIVE_MIN && totalWearing < AndroSwitch.OBJECTIVE_MIN + 600_000) {
    makeNotificationPush("Objectif atteint !", `Vous avez atteint l'objectif de ${AndroSwitch.OBJECTIVE_MIN / 3_600_000}`);
  }

  // if objectif min and max are different, between objectif max and objectif max + 10 min
  if(AndroSwitch.OBJECTIVE_MAX !== AndroSwitch.OBJECTIVE_MIN && totalWearing > AndroSwitch.OBJECTIVE_MAX && totalWearing < AndroSwitch.OBJECTIVE_MAX + 600_000) {
    makeNotificationPush("Objectif atteint !", `Vous avez atteint l'objectif de ${AndroSwitch.OBJECTIVE_MAX / 3_600_000}, pensez à retirer votre dipositif`);
  }

  if(totalWearing > AndroSwitch.OBJECTIVE_MAX_EXTRA && totalWearing < AndroSwitch.OBJECTIVE_MAX_EXTRA + 600_000) {
    makeNotificationPush("Objectif dépassé", "Cela fait maintenant 18h que vous portez votre dispositif, pensez à le retirer");
  }
});


/**
 * Register a background task.
 * @param name Name of the task to register
 * @param interval Interval in seconds
 */
async function registerBackgroundTask(name: string, interval: number): Promise<void> {
  const isRegistered = await isTaskRegisteredAsync(name);
  if(isRegistered) return console.log("Background task already registered");

  try {
    await registerTaskAsync(name, {
      minimumInterval: interval,
      stopOnTerminate: false,
      startOnBoot: true,
    });
    console.log('Background task registred');
  } catch (error) {
    console.error('Error when trying to register background task:', error);
  }
}


/**
 * Make a notification push.
 * @param title Title of the notification push.
 * @param content Content og the notification push.
 */
export async function makeNotificationPush(title: string, content: string): Promise<void> {
  await scheduleNotificationAsync({
    content: {
      title: title,
      body: content
    },
    trigger: null
  });
}