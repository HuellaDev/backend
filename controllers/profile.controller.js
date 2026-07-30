import { randomUUID } from "crypto";
import supabase from "../db/supabaseClient.js";
import { Profile } from "../models/index.js";
import { catchAsync } from "../helpers/catchAsync.js";
import { AppError } from "../helpers/AppError.js";

const BUCKET = "photos";

export const getMe = catchAsync(async (req, res) => {
  res.json({
    authUser: { id: req.user.id, email: req.user.email },
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

export const updateProfile = catchAsync(async (req, res) => {
  const { full_name, phone } = req.body;

  const profile = await Profile.findByPk(req.user.id);
  if (!profile) {
    throw new AppError("Profile not found", 404);
  }

  if (full_name !== undefined) profile.full_name = full_name;
  if (phone !== undefined) profile.phone = phone;

  await profile.save();

  res.json(profile);
});

export const uploadProfilePhoto = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError("No file provided", 400);
  }

  const profile = await Profile.findByPk(req.user.id);
  if (!profile) {
    throw new AppError("Profile not found", 404);
  }

  const extension = req.file.originalname.split(".").pop();
  const fileName = `${req.user.id}/avatar-${randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });

  if (uploadError) {
    console.error("Error uploading avatar", uploadError);
    throw new AppError("Could not upload photo", 500);
  }

  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

  profile.profile_photo = publicUrlData.publicUrl;
  await profile.save();

  res.json(profile);
});