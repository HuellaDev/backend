import { Notification } from "../models/index.js";
import { catchAsync } from "../helpers/catchAsync.js";
import { AppError } from "../helpers/AppError.js";

export const getMyNotifications = catchAsync(async (req, res) => {
  const notifications = await Notification.findAll({
    where: { user_id: req.user.id },
    order: [["created_at", "DESC"]],
  });

  res.json(notifications);
});

export const markAsRead = catchAsync(async (req, res) => {
  const notification = await Notification.findByPk(req.params.id);

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  if (notification.user_id !== req.user.id) {
    throw new AppError("You do not own this notification", 403);
  }

  notification.is_read = true;
  await notification.save();

  res.json(notification);
});

export const deleteNotification = catchAsync(async (req, res) => {
  const notification = await Notification.findByPk(req.params.id);

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  if (notification.user_id !== req.user.id) {
    throw new AppError("You do not own this notification", 403);
  }

  await notification.destroy();

  res.json({ message: "Notification deleted" });
});