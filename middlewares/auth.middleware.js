import supabase from "../db/supabaseClient.js";
import { Profile } from "../models/index.js";

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  req.user = data.user;
  next();
};

export const attachProfile = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "requireAuth must run before attachProfile" });
  }

  const profile = await Profile.findByPk(req.user.id);

  if (!profile) {
    return res.status(404).json({ error: "Profile not found for this user" });
  }

  req.profile = profile;
  next();
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.profile) {
      return res.status(401).json({ error: "attachProfile must run before requireRole" });
    }

    if (!roles.includes(req.profile.role)) {
      return res.status(403).json({ error: "You do not have permission for this action" });
    }

    next();
  };
};