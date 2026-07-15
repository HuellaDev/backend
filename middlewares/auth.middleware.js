import supabase from "../db/supabaseClient.js";
import { Profile } from "../models/index.js";
import { AppError } from "../helpers/AppError.js";
import { catchAsync } from "../helpers/catchAsync.js";

export const requireAuth = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("No token provided", 401);
  }

  const token = authHeader.split(" ")[1];
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw new AppError("Invalid or expired token", 401);
  }

  req.user = data.user;
  next();
});

export const attachProfile = catchAsync(async (req, res, next) => {
  if (!req.user) {
    throw new AppError("requireAuth must run before attachProfile", 401);
  }

  const profile = await Profile.findByPk(req.user.id);

  if (!profile) {
    throw new AppError("Profile not found for this user", 404);
  }

  req.profile = profile;
  next();
});

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.profile) {
      throw new AppError("attachProfile must run before requireRole", 401);
    }

    if (!roles.includes(req.profile.role)) {
      throw new AppError("You do not have permission for this action", 403);
    }

    next();
  };
};