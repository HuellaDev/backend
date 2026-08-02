import webpush from "web-push";
import { PushSubscription } from "../models/index.js";

webpush.setVapidDetails(
  "mailto:soporte@huella.dev",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export const sendPushToUser = async (userId, payload) => {
  const subscriptions = await PushSubscription.findAll({ where: { user_id: userId } });

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(payload)
        );
      } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          await sub.destroy();
        } else {
          console.error("Error sending push", err);
        }
      }
    })
  );
};