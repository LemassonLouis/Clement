import { getSessionStore } from "@/store/SessionStore";
import { BackgroundFetchResult, BackgroundFetchStatus, getStatusAsync, registerTaskAsync } from "expo-background-fetch";
import { AndroidImportance, requestPermissionsAsync, SchedulableTriggerInputTypes, scheduleNotificationAsync, setNotificationChannelAsync, setNotificationHandler } from "expo-notifications";
import { defineTask, isTaskRegisteredAsync } from "expo-task-manager";
import { calculateTotalWearing, extractDateSessions, calculateTimeUntilUnreachableObjective } from "./session";
import { getContraceptionMethod } from "./contraception";
import { getUserStore } from "@/store/UserStore";
import { ContraceptionMethods } from "@/enums/ContraceptionMethod";
import { Platform } from "react-native";
import { toast, ToastPosition } from "@backpackapp-io/react-native-toast";


export const BACKGROUND_NOTIFICATIONS_TASK  = 'BACKGROUND_NOTIFICATIONS_TASK';


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

  await configureNotificationChannel();
  await registerBackgroundTask(BACKGROUND_NOTIFICATIONS_TASK, 15 * 60);
}


defineTask(BACKGROUND_NOTIFICATIONS_TASK, async () => {
  console.log("task triggered"); // TEMP
  toast.success("task tirggered", { position: ToastPosition.BOTTOM }); // TEMP

  try {
    const contraceptionMethod = getContraceptionMethod(getUserStore().getUser()?.method ?? ContraceptionMethods.ANDRO_SWITCH);
    const remainingTime = calculateTimeUntilUnreachableObjective(contraceptionMethod.objective_min, new Date());

    makeNotificationPush(
      "Cela fait 15 min",
      `remaining time : ${remainingTime}, ${remainingTime > 7_200_000 && remainingTime < 7_200_000 + 900_000}, ${remainingTime > 0 && remainingTime < 900_000}`
    );

    // between 2h and 2h15min
    if(remainingTime > 7_200_000 && remainingTime < 7_200_000 + 900_000) {
      makeNotificationPush(
        "Vous n'avez plus beaucoup de temps !",
        `Il ne vous reste plus que 5 minutes avant de ne plus pouvoir réaliser l'objetif de ${contraceptionMethod.objective_min / 3_600_000}h`
      );
      return BackgroundFetchResult.NewData;
    }

    // between 0 and 15min
    if(remainingTime > 0 && remainingTime < 900_000) {
      makeNotificationPush(
        "Vous n'avez plus beaucoup de temps !",
        `Il ne vous reste plus que 2 heures avant de ne plus pouvoir réaliser l'objetif de ${contraceptionMethod.objective_min / 3_600_000}h`
      );
      return BackgroundFetchResult.NewData;
    }

    const currentSessions = extractDateSessions(getSessionStore().getSessions(), new Date());
    const totalWearing =  calculateTotalWearing(currentSessions);

    // between objectif min and objectif min + 15 min
    if(totalWearing > contraceptionMethod.objective_min
    && totalWearing < contraceptionMethod.objective_min + 900_000) {
      makeNotificationPush(
        "Objectif atteint !",
        `Vous avez atteint l'objectif de ${contraceptionMethod.objective_min / 3_600_000}h`
      );
      return BackgroundFetchResult.NewData;
    }

    // if objectif min and max are different, between objectif max and objectif max + 15 min
    if(contraceptionMethod.objective_max !== contraceptionMethod.objective_min
    && totalWearing > contraceptionMethod.objective_max
    && totalWearing < contraceptionMethod.objective_max + 900_000) {
      makeNotificationPush(
        "Objectif atteint !",
        `Vous avez atteint l'objectif de ${contraceptionMethod.objective_max / 3_600_000}h, pensez à retirer votre dipositif`
      );
      return BackgroundFetchResult.NewData;
    }

    // between objectif max extra and objectif max extra + 15 min
    if(totalWearing > contraceptionMethod.objective_max_extra
    && totalWearing < contraceptionMethod.objective_max_extra + 900_000) {
      makeNotificationPush(
        "Objectif dépassé",
        `Cela fait maintenant ${contraceptionMethod.objective_max_extra / 3_600_000}h que vous portez votre dispositif, pensez à le retirer`
      );
      return BackgroundFetchResult.NewData;
    }

    return BackgroundFetchResult.NoData;
  }
  catch(error) {
    toast.error("Error while running the task : " + error, { position: ToastPosition.BOTTOM });
    return BackgroundFetchResult.Failed;
  }
});


/**
 * Register a background task.
 * @param name Name of the task to register
 * @param interval Interval in seconds
 */
async function registerBackgroundTask(name: string, interval: number): Promise<void> {
  const isRegistered = await isTaskRegisteredAsync(name);
  if(isRegistered) {
    toast.success("Background task already registered", { position: ToastPosition.BOTTOM }); // TEMP
    return;
  }

  try {
    await registerTaskAsync(name, {
      minimumInterval: interval,
      stopOnTerminate: false,
      startOnBoot: true,
    });
    toast.success("Background task registred", { position: ToastPosition.BOTTOM }); // TEMP
  } catch (error) {
    toast.error("Error while trying to register background task : " + error, { position: ToastPosition.BOTTOM });
  }
}


async function configureNotificationChannel(): Promise<void> {
  if (Platform.OS === 'android') {
    await setNotificationChannelAsync('default', {
      name: 'Notifications par défaut',
      importance: AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
}


export async function getBackgroundFetchStatus(name: string): Promise<{status: BackgroundFetchStatus|null, isRegistered: boolean}> {
  const status = await getStatusAsync();
  const isRegistered = await isTaskRegisteredAsync(name);

  return {
    status: status,
    isRegistered: isRegistered
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


export async function scheduleNotificationPush(title: string, content: string = "", date: Date): Promise<void> {
  await scheduleNotificationAsync({
    content: {
      title: title,
      body: content
    },
    trigger: {
      type: SchedulableTriggerInputTypes.DATE,
      date: date
    }
  })
}