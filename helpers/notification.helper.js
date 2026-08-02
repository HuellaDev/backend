import { Notification } from "../models/index.js";
import { sendPushToUser } from "./webPush.js";

export const createNotification = async ({ user_id, type, title, message }) => {
  try {
    const notification = await Notification.create({ user_id, type, title, message, is_read: false });

    sendPushToUser(user_id, { title, message, url: "/" }).catch((err) =>
      console.error("Push failed", err)
    );

    return notification;
  } catch (err) {
    console.error("Error creating notification", err);
    return null;
  }
};