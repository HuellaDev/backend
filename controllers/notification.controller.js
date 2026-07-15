import { Notification } from "../models/index.js";

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      order: [["created_at", "DESC"]],
    });

    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications", err);
    res.status(500).json({ error: "Could not fetch notifications" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (notification.user_id !== req.user.id) {
      return res.status(403).json({ error: "You do not own this notification" });
    }

    notification.is_read = true;
    await notification.save();

    res.json(notification);
  } catch (err) {
    console.error("Error updating notification", err);
    res.status(500).json({ error: "Could not update notification" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (notification.user_id !== req.user.id) {
      return res.status(403).json({ error: "You do not own this notification" });
    }

    await notification.destroy();

    res.json({ message: "Notification deleted" });
  } catch (err) {
    console.error("Error deleting notification", err);
    res.status(500).json({ error: "Could not delete notification" });
  }
};