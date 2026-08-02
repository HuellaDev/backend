import { PushSubscription } from "../models/index.js";
import { catchAsync } from "../helpers/catchAsync.js";
import { AppError } from "../helpers/AppError.js";

export const subscribe = catchAsync(async (req, res) => {
  const { endpoint, keys } = req.body;

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    throw new AppError("Invalid subscription payload", 400);
  }

  const [subscription] = await PushSubscription.findOrCreate({
    where: { endpoint },
    defaults: {
      user_id: req.user.id,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    },
  });

  res.status(201).json(subscription);
});

export const unsubscribe = catchAsync(async (req, res) => {
  const { endpoint } = req.body;

  await PushSubscription.destroy({ where: { endpoint, user_id: req.user.id } });

  res.json({ message: "Unsubscribed" });
});