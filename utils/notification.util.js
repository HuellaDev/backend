import { Notification } from "../models/index.js";

export const createNotification = async ({ user_id, type, title, message }) => {
  try {
    return await Notification.create({ user_id, type, title, message, is_read: false });
  } catch (err) {
    console.error("Error creating notification", err);
    return null;
  }
};