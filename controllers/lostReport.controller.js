import { sequelize, LostReport, AnimalProfile, Profile, Photo } from "../models/index.js";
import { catchAsync } from "../helpers/catchAsync.js";
import { AppError } from "../helpers/AppError.js";

export const createLostReport = catchAsync(async (req, res) => {
  const {
    pet_name,
    contact_phone,
    last_seen_location,
    search_radius_meters,
    reward_amount,
    anonymous,
    species,
    breed,
    animal_type,
    sex,
    estimated_age_months,
    size,
    main_color,
    secondary_color,
    collar,
    condition,
    description,
  } = req.body;

  if (!species) {
    throw new AppError("species is required", 400);
  }

  const t = await sequelize.transaction();

  try {
    const animalProfile = await AnimalProfile.create(
      {
        species,
        breed,
        animal_type,
        sex,
        estimated_age_months,
        size,
        main_color,
        secondary_color,
        collar,
        condition,
        description,
      },
      { transaction: t }
    );

    const lostReport = await LostReport.create(
      {
        profile_id: animalProfile.id,
        user_id: req.user.id,
        pet_name,
        contact_phone,
        last_seen_location,
        search_radius_meters,
        reward_amount,
        anonymous: anonymous ?? false,
        status: "active",
      },
      { transaction: t }
    );

    await t.commit();

    res.status(201).json({ lostReport, animalProfile });
  } catch (err) {
    await t.rollback();
    throw err;
  }
});

export const getLostReports = catchAsync(async (req, res) => {
  const { status } = req.query;

  const where = {};
  if (status) where.status = status;

  const lostReports = await LostReport.findAll({
    where,
    include: [
      { model: AnimalProfile },
      { model: Profile, as: "user", attributes: ["id", "full_name", "profile_photo"] },
      { model: Photo },
    ],
    order: [["created_at", "DESC"]],
  });

  res.json(lostReports);
});

export const getLostReportById = catchAsync(async (req, res) => {
  const lostReport = await LostReport.findByPk(req.params.id, {
    include: [
      { model: AnimalProfile },
      { model: Profile, as: "user", attributes: ["id", "full_name", "profile_photo"] },
      { model: Photo },
    ],
  });

  if (!lostReport) {
    throw new AppError("Lost report not found", 404);
  }

  res.json(lostReport);
});

export const updateLostReportStatus = catchAsync(async (req, res) => {
  const { status } = req.body;

  const validStatuses = ["active", "resolved", "cancelled"];
  if (!validStatuses.includes(status)) {
    throw new AppError(`status must be one of: ${validStatuses.join(", ")}`, 400);
  }

  const lostReport = await LostReport.findByPk(req.params.id);

  if (!lostReport) {
    throw new AppError("Lost report not found", 404);
  }

  if (lostReport.user_id !== req.user.id) {
    throw new AppError("You do not own this report", 403);
  }

  lostReport.status = status;
  await lostReport.save();

  res.json(lostReport);
});

export const deleteLostReport = catchAsync(async (req, res) => {
  const lostReport = await LostReport.findByPk(req.params.id);

  if (!lostReport) {
    throw new AppError("Lost report not found", 404);
  }

  if (lostReport.user_id !== req.user.id) {
    throw new AppError("You do not own this report", 403);
  }

  await lostReport.destroy();

  res.json({ message: "Lost report deleted" });
});