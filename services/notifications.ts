import { AndroidImportance, AndroidNotificationVisibility, cancelAllScheduledNotificationsAsync, requestPermissionsAsync, SchedulableTriggerInputTypes, scheduleNotificationAsync, setNotificationChannelAsync, setNotificationHandler } from "expo-notifications";
import { calculateTotalWearing, calculateTimeUntilUnreachableObjective } from "./session";
import { getContraceptionMethod } from "./contraception";
import { getUserStore } from "@/store/UserStore";
import { ContraceptionMethods } from "@/enums/ContraceptionMethod";
import { toast, ToastPosition } from "@backpackapp-io/react-native-toast";
import { getCurrentSessionStore } from "@/store/CurrentSessionStore";
import { getAllSessionsBetweenDates } from "@/database/session";
import { getNextDay, getStartAndEndDate } from "./date";
import { Platform } from "react-native";


/**
 * Initialize the notification système.
 */
export async function initializeNotifications(): Promise<void> {
  await requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });

  setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    })
  });

  await configureNotificationChannel();
  await reScheduleNotifications();
}


async function configureNotificationChannel(): Promise<void> {
  if (Platform.OS === 'android') {
    await setNotificationChannelAsync('default', {
      name: 'Notifications par défaut',
      importance: AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
    });
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


async function scheduleNotifications(date: Date): Promise<void> {
  const { dateStart, dateEnd } = getStartAndEndDate(date);

  const sessions = await getAllSessionsBetweenDates(dateStart.toISOString(), dateEnd.toISOString());
  const totalWearing = calculateTotalWearing(sessions);

  const contraceptionMethod = getContraceptionMethod(getUserStore().getUser()?.method ?? ContraceptionMethods.ANDRO_SWITCH);
  const currentSessionStored = getCurrentSessionStore().getCurrentSession();

  const availableTime = calculateTimeUntilUnreachableObjective(contraceptionMethod.objective_min, date);
  const availableTimeForMinExtraObjective = calculateTimeUntilUnreachableObjective(contraceptionMethod.objective_min_extra, date);

  if (availableTimeForMinExtraObjective === 0) {
    await scheduleNotifications(getStartAndEndDate(getNextDay(getNextDay(date))).dateStart);
  }
  else if(currentSessionStored.sessionStartTime) {
    const objectiveMinExtraRemaining = contraceptionMethod.objective_min_extra - totalWearing;
    const objectiveMinRemaining = contraceptionMethod.objective_min - totalWearing;
    const objectiveMaxRemaining = contraceptionMethod.objective_max - totalWearing;
    const objectiveMaxExtraRemaining = contraceptionMethod.objective_max_extra - totalWearing;

    if(objectiveMinExtraRemaining > 0) {
      scheduleNotificationPush(
        "Vous y êtes presque",
        `Vous avez atteint l'objectif de ${contraceptionMethod.objective_min_extra / 3_600_000}h, encore un petit effort`,
        new Date(date.getTime() + objectiveMinExtraRemaining)
      )
    }

    if(objectiveMinRemaining > 0) {
      scheduleNotificationPush(
        "Objectif atteint",
        `Vous avez atteint l'objectif de ${contraceptionMethod.objective_min / 3_600_000}h`,
        new Date(date.getTime() + objectiveMinRemaining)
      )
    }

    if(objectiveMaxRemaining > 0) {
      scheduleNotificationPush(
        "Objectif atteint",
        `Vous avez atteint l'objectif de ${contraceptionMethod.objective_max / 3_600_000}h, penser à retirer votre dispositif`,
        new Date(date.getTime() + objectiveMaxRemaining)
      )
    }

    if(objectiveMaxExtraRemaining > 0) {
      scheduleNotificationPush(
        "Objectif dépassé",
        `Cela fait maintenant ${contraceptionMethod.objective_max_extra / 3_600_000}h que vous portez votre dispositif, pensez à le retirer`,
        new Date(date.getTime() + objectiveMaxExtraRemaining)
      )
    }
  }
  else if(contraceptionMethod.objective_min - totalWearing > 0 && availableTime > 0) {
    scheduleNotificationPush(
      "Plus que 5min !",
      `Il ne vous reste plus que 5 minutes avant de ne plus pouvoir réaliser l'objetif de ${contraceptionMethod.objective_min / 3_600_000}h`,
      new Date(date.getTime() + (availableTime - 300_000))
    )

    scheduleNotificationPush(
      "Vous n'avez plus beaucoup de temps !",
      `Il ne vous reste plus que 2 heures avant de ne plus pouvoir réaliser l'objetif de ${contraceptionMethod.objective_min / 3_600_000}h`,
      new Date(date.getTime() + (availableTime - 7_200_000 - 300_000))
    )
  }
  else {
    await scheduleNotifications(getStartAndEndDate(getNextDay(getNextDay(date))).dateStart);
  }
}


/**
 * Re schedule all notifications.
 */
export async function reScheduleNotifications(): Promise<void> {
  toast.success("reschedule notifications", { position: ToastPosition.BOTTOM }); // TEMP

  cancelAllScheduledNotificationsAsync();

  const today = new Date();
  const tomorrow = getStartAndEndDate(getNextDay(today)).dateStart;

  await scheduleNotifications(today);
  await scheduleNotifications(tomorrow);
}