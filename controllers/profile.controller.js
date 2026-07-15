import { catchAsync } from "../helpers/catchAsync.js";

export const getMe = catchAsync(async (req, res) => {
  res.json({
    authUser: {
      id: req.user.id,
      email: req.user.email,
    },
    profile: req.profile,
  });
});