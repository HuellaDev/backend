import { randomUUID } from "crypto";
import supabase from "../db/supabaseClient.js";
import {
  sequelize,
  Profile,
  LostReport,
  SightingReport,
  Photo,
  AiMatch,
  Comment,
  Notification,
  Organization,
  PushSubscription,
  StatusHistory,
} from "../models/index.js";
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

export const deleteMe = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const profile = await Profile.findByPk(userId);
  if (!profile) {
    throw new AppError("Profile not found", 404);
  }

  const t = await sequelize.transaction();

  try {
    const lostReports = await LostReport.findAll({
      where: { user_id: userId },
      attributes: ["id"],
      transaction: t,
    });
    const sightingReports = await SightingReport.findAll({
      where: { user_id: userId },
      attributes: ["id"],
      transaction: t,
    });
    const lostReportIds = lostReports.map((r) => r.id);
    const sightingReportIds = sightingReports.map((r) => r.id);

    const { Op } = sequelize.Sequelize;

    // 1. AI matches tied to the user's own reports (NOT NULL FK, must go first).
    if (lostReportIds.length || sightingReportIds.length) {
      await AiMatch.destroy({
        where: {
          [Op.or]: [
            { lost_report_id: { [Op.in]: lostReportIds } },
            { sighting_report_id: { [Op.in]: sightingReportIds } },
          ],
        },
        transaction: t,
      });
    }

    // 2. AI matches this user reviewed as staff — unset instead of deleting.
    await AiMatch.update(
      { reviewed_by: null },
      { where: { reviewed_by: userId }, transaction: t }
    );

    // 3. Photos attached to the user's reports (even if uploaded by someone
    //    else) plus any photo this user uploaded elsewhere.
    if (lostReportIds.length || sightingReportIds.length) {
      await Photo.destroy({
        where: {
          [Op.or]: [
            { lost_report_id: { [Op.in]: lostReportIds } },
            { sighting_report_id: { [Op.in]: sightingReportIds } },
            { uploaded_by: userId },
          ],
        },
        transaction: t,
      });
    } else {
      await Photo.destroy({ where: { uploaded_by: userId }, transaction: t });
    }

    // 4. Comments, notifications, push subscriptions, status history.
    await Comment.destroy({ where: { user_id: userId }, transaction: t });
    await Notification.destroy({ where: { user_id: userId }, transaction: t });
    await PushSubscription.destroy({ where: { user_id: userId }, transaction: t });
    await StatusHistory.destroy({ where: { user_id: userId }, transaction: t });

    // 5. Organization owned by the user (photos.organization_id has no
    //    cascade either, so detach first).
    const organization = await Organization.findOne({
      where: { user_id: userId },
      transaction: t,
    });
    if (organization) {
      await Photo.update(
        { organization_id: null },
        { where: { organization_id: organization.id }, transaction: t }
      );
      await organization.destroy({ transaction: t });
    }

    // 6. The user's own reports, then the profile.
    await LostReport.destroy({ where: { user_id: userId }, transaction: t });
    await SightingReport.destroy({ where: { user_id: userId }, transaction: t });
    await profile.destroy({ transaction: t });

    await t.commit();
  } catch (err) {
    await t.rollback();
    console.error("Error deleting account data", err);
    throw new AppError("Could not delete account", 500);
  }

  // 7. Finally, remove the Supabase Auth user (outside the DB transaction —
  //    it's a separate system and can't be rolled back together).
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) {
    console.error("Error deleting auth user", error);
    throw new AppError(
      "Your data was deleted but we couldn't remove your login. Contact support.",
      500
    );
  }

  res.status(204).send();
});