import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function scheduleTaskSessionEndNotification(
  expectedEndAt?: string | null,
  serverClockOffsetMs = 0,
) {
  if (!expectedEndAt) {
    return null;
  }

  const triggerDate = new Date(
    new Date(expectedEndAt).getTime() - serverClockOffsetMs,
  );

  if (Number.isNaN(triggerDate.getTime()) || triggerDate.getTime() <= Date.now()) {
    return null;
  }

  const permission = await Notifications.requestPermissionsAsync() as {
    granted?: boolean;
    ios?: { status?: Notifications.IosAuthorizationStatus };
  };

  if (
    !permission.granted &&
    permission.ios?.status !== Notifications.IosAuthorizationStatus.PROVISIONAL
  ) {
    return null;
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: "الجلسة خلصت",
      body: "يلا بينا علي الجلسة اللي بعدها",
      sound: "default",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });
}

export async function cancelTaskSessionEndNotification(
  notificationId?: string | null,
) {
  if (!notificationId) {
    return;
  }

  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
