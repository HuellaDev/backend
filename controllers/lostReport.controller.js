import { sequelize, LostReport, AnimalProfile, Profile, Photo } from "../models/index.js";
import { catchAsync } from "../helpers/catchAsync.js";
import { AppError } from "../helpers/AppError.js";
import { Op } from "sequelize";

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
  const { status, as_of } = req.query;

  const where = {};

  if (as_of) {
    const asOfDate = new Date(as_of);

    if (Number.isNaN(asOfDate.getTime())) {
      throw new AppError("Invalid as_of date.", 400);
    }

    where.created_at = {
      [Op.lte]: asOfDate,
    };

    where[Op.and] = [
      {
        [Op.or]: [
          { resolved_at: { [Op.is]: null, } },
          { resolved_at: { [Op.gt]: asOfDate } },
        ],
      },
      {
        [Op.or]: [
          { expired_at: { [Op.is]: null, } },
          { expired_at: { [Op.gt]: asOfDate } },
        ],
      },
    ];
  } else if (status) {
    where.status = status;
  }

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

export const getMyLostReports = catchAsync(async (req, res) => {
  const lostReports = await LostReport.findAll({
    where: { user_id: req.user.id },
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

  const validStatuses = [
    "active",
    "resolved",
    "expired",

  ];
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
  if (lostReport.status !== "active") {
    throw new AppError(
      "This report has already been closed.",
      400
    );
  }

  lostReport.status = status;
  lostReport.status_changed_at = new Date();


  switch (status) {
    case "active":
      lostReport.resolved_at = null;
      lostReport.expired_at = null;
      break;

    case "resolved":
      lostReport.resolved_at = new Date();
      lostReport.expired_at = null;
      break;

    case "expired":
      lostReport.expired_at = new Date();
      lostReport.resolved_at = null;
      break;
  }

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