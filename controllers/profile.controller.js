import { Profile } from "../models/index.js";
import { catchAsync } from "../helpers/catchAsync.js";
import { AppError } from "../helpers/AppError.js";

export const getMe = catchAsync(async (req, res) => {
  res.json({
    authUser: {
      id: req.user.id,
      email: req.user.email,
    },
    profile: req.profile,
  });
});

export const createProfile = catchAsync(async (req, res) => {
  const { full_name, phone, profile_photo } = req.body;

  if (!full_name) {
    throw new AppError("full_name is required", 400);
  }

  const existing = await Profile.findByPk(req.user.id);

  if (existing) {
    throw new AppError("Profile already exists for this user", 409);
  }

  const profile = await Profile.create({
    id: req.user.id,
    full_name,
    phone,
    profile_photo,
    role: "user",
    verified: false,
  });

  res.status(201).json(profile);
});