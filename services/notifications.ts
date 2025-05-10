import { AndroidImportance, AndroidNotificationVisibility, cancelAllScheduledNotificationsAsync, requestPermissionsAsync, SchedulableTriggerInputTypes, scheduleNotificationAsync, setNotificationChannelAsync, setNotificationHandler } from "expo-notifications";
import { calculateTotalWearing, calculateTimeUntilUnreachableObjective } from "./session";
import { getContraceptionMethod } from "./contraception";
import { getCurrentSessionStore } from "@/store/CurrentSessionStore";
import { getAllSessionsBetweenDates } from "@/database/session";
import { getNextDay, getStartAndEndDate } from "./date";
import { Platform } from "react-native";
import { User } from "@/types/UserType";


/**
 * Initialize the notification système.
 */
export async function initializeNotifications(user: User): Promise<void> {
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
  await reScheduleNotifications(user);
}


async function configureNotificationChannel(): Promise<void> {
  if (Platform.OS === 'android') {
    await setNotificationChannelAsync('default', {
      name: 'Notifications par défaut',
      importance: AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
      sound: 'clement_notification.mp3'
      // sound: 'assets/sounds/clement_notification.mp3',
      // sound: '../assets/sounds/clement_notification.mp3',
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
      body: content,
      sound: 'clement_notification.mp3',
      // sound: 'assets/sounds/clement_notification.mp3',
      // sound: '../assets/sounds/clement_notification.mp3',
    },
    trigger: null
  });
}


export async function scheduleNotificationPush(title: string, content: string = "", date: Date): Promise<void> {
  await scheduleNotificationAsync({
    content: {
      title: title,
      body: content,
      sound: 'clement_notification.mp3',
    },
    trigger: {
      type: SchedulableTriggerInputTypes.DATE,
      date: date
    }
  })
}


async function scheduleNotifications(user: User, date: Date): Promise<void> {
  const { dateStart, dateEnd } = getStartAndEndDate(date);

  const sessions = await getAllSessionsBetweenDates(dateStart.toISOString(), dateEnd.toISOString());
  const totalWearing = calculateTotalWearing(sessions);

  const contraceptionMethod = getContraceptionMethod(user.method);
  const currentSessionStored = getCurrentSessionStore().getCurrentSession();

  const minExtraObjectiveAvailableTime = calculateTimeUntilUnreachableObjective(contraceptionMethod.objective_min_extra, date);
  const minObjectiveAvailableTime = calculateTimeUntilUnreachableObjective(contraceptionMethod.objective_min, date);
  const maxObjectiveAvailableTime = calculateTimeUntilUnreachableObjective(contraceptionMethod.objective_max, date);
  const maxExtraObjectiveAvailableTime = calculateTimeUntilUnreachableObjective(contraceptionMethod.objective_max_extra, date);

  if (minExtraObjectiveAvailableTime === 0) {
    await scheduleNotifications(user, getStartAndEndDate(getNextDay(getNextDay(date))).dateStart);
  }
  else if(currentSessionStored.sessionStartTime) {
    const minExtraObjectiveRemaining = contraceptionMethod.objective_min_extra - totalWearing;
    const minObjectiveRemaining = contraceptionMethod.objective_min - totalWearing;
    const maxObjectiveRemaining = contraceptionMethod.objective_max - totalWearing;
    const maxExtraObjectiveRemaining = contraceptionMethod.objective_max_extra - totalWearing;

    if(minExtraObjectiveRemaining > 0 && minExtraObjectiveAvailableTime > 0 && user.wantObjectiveMinExtraReachedNotification) {
      scheduleNotificationPush(
        "Vous y êtes presque",
        `Vous avez atteint l'objectif de ${contraceptionMethod.objective_min_extra / 3_600_000}h, encore un petit effort`,
        new Date(date.getTime() + minExtraObjectiveRemaining)
      )
    }

    if(minObjectiveRemaining > 0 && minObjectiveRemaining > 0 && user.wantObjectiveMinReachedNotification && contraceptionMethod.objective_min !== contraceptionMethod.objective_max) {
      scheduleNotificationPush(
        "Objectif atteint",
        `Vous avez atteint l'objectif de ${contraceptionMethod.objective_min / 3_600_000}h`,
        new Date(date.getTime() + minObjectiveRemaining)
      )
    }

    if(maxObjectiveRemaining > 0 && maxObjectiveAvailableTime > 0 && user.wantObjectiveMaxReachedNotification) {
      scheduleNotificationPush(
        "Objectif atteint",
        `Vous avez atteint l'objectif de ${contraceptionMethod.objective_max / 3_600_000}h, penser à retirer votre dispositif`,
        new Date(date.getTime() + maxObjectiveRemaining)
      )
    }

    if(maxExtraObjectiveRemaining > 0 && maxExtraObjectiveAvailableTime > 0 && user.wantObjectiveMaxExtraReachedNotification) {
      scheduleNotificationPush(
        "Objectif dépassé",
        `Cela fait maintenant ${contraceptionMethod.objective_max_extra / 3_600_000}h que vous portez votre dispositif, pensez à le retirer`,
        new Date(date.getTime() + maxExtraObjectiveRemaining)
      )
    }
  }
  else if(contraceptionMethod.objective_min - totalWearing > 0 && minObjectiveAvailableTime > 0) {
    if(user.wantFiveMinutesRemainingNotification) {
      scheduleNotificationPush(
        "Plus que 5 min !",
        `Il ne vous reste plus que 5 minutes avant de ne plus pouvoir réaliser l'objetif de ${contraceptionMethod.objective_min / 3_600_000}h`,
        new Date(date.getTime() + (minObjectiveAvailableTime - 300_000))
      )
    }

    if(user.wantOneHourRemainingNotification) {
      scheduleNotificationPush(
        "Plus que 1h",
        `Il ne vous reste plus que 1 heure avant de ne plus pouvoir réaliser l'objetif de ${contraceptionMethod.objective_min / 3_600_000}h`,
        new Date(date.getTime() + (minObjectiveAvailableTime - 3_600_000 - 300_000))
      )
    }

    if(user.wantTwoHoursRemainingNotification) {
      scheduleNotificationPush(
        "Plus que 2h",
        `Il ne vous reste plus que 2 heures avant de ne plus pouvoir réaliser l'objetif de ${contraceptionMethod.objective_min / 3_600_000}h`,
        new Date(date.getTime() + (minObjectiveAvailableTime - 7_200_000 - 300_000))
      )
    }
  }
  else {
    await scheduleNotifications(user, getStartAndEndDate(getNextDay(getNextDay(date))).dateStart);
  }
}


/**
 * Re schedule all notifications.
 */
export async function reScheduleNotifications(user: User): Promise<void> {
  cancelAllScheduledNotificationsAsync();

  const today = new Date();
  const tomorrow = getStartAndEndDate(getNextDay(today)).dateStart;

  await scheduleNotifications(user, today);
  await scheduleNotifications(user, tomorrow);
}