import { sequelize, SightingReport, AnimalProfile, Profile, Photo } from "../models/index.js";
import { catchAsync } from "../helpers/catchAsync.js";
import { AppError } from "../helpers/AppError.js";

export const createSightingReport = catchAsync(async (req, res) => {
  const {
    anonymous,
    location,
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

    const sightingReport = await SightingReport.create(
      {
        profile_id: animalProfile.id,
        user_id: req.user.id,
        anonymous: anonymous ?? false,
        location,
        status: "active",
      },
      { transaction: t }
    );

    await t.commit();

    res.status(201).json({ sightingReport, animalProfile });
  } catch (err) {
    await t.rollback();
    throw err;
  }
});

export const getSightingReports = catchAsync(async (req, res) => {
  const { status } = req.query;

  const where = {};
  if (status) where.status = status;

  const sightingReports = await SightingReport.findAll({
    where,
    include: [
      { model: AnimalProfile },
      { model: Profile, as: "user", attributes: ["id", "full_name", "profile_photo"] },
      { model: Photo },
    ],
    order: [["created_at", "DESC"]],
  });

  res.json(sightingReports);
});

export const getSightingReportById = catchAsync(async (req, res) => {
  const sightingReport = await SightingReport.findByPk(req.params.id, {
    include: [
      { model: AnimalProfile },
      { model: Profile, as: "user", attributes: ["id", "full_name", "profile_photo"] },
      { model: Photo },
    ],
  });

  if (!sightingReport) {
    throw new AppError("Sighting report not found", 404);
  }

  res.json(sightingReport);
});

export const updateSightingReportStatus = catchAsync(async (req, res) => {
  const { status } = req.body;

  const validStatuses = ["active", "resolved", "cancelled"];
  if (!validStatuses.includes(status)) {
    throw new AppError(`status must be one of: ${validStatuses.join(", ")}`, 400);
  }

  const sightingReport = await SightingReport.findByPk(req.params.id);

  if (!sightingReport) {
    throw new AppError("Sighting report not found", 404);
  }

  if (sightingReport.user_id !== req.user.id) {
    throw new AppError("You do not own this report", 403);
  }

  sightingReport.status = status;
  await sightingReport.save();

  res.json(sightingReport);
});

export const deleteSightingReport = catchAsync(async (req, res) => {
  const sightingReport = await SightingReport.findByPk(req.params.id);

  if (!sightingReport) {
    throw new AppError("Sighting report not found", 404);
  }

  if (sightingReport.user_id !== req.user.id) {
    throw new AppError("You do not own this report", 403);
  }

  await sightingReport.destroy();

  res.json({ message: "Sighting report deleted" });
});