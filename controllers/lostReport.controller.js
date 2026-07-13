import { sequelize, LostReport, AnimalProfile, Profile, Photo } from "../models/index.js";

export const createLostReport = async (req, res) => {
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
    return res.status(400).json({ error: "species is required" });
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
    console.error("Error creating lost report", err);
    res.status(500).json({ error: "Could not create lost report" });
  }
};

export const getLostReports = async (req, res) => {
  const { status } = req.query;

  const where = {};
  if (status) where.status = status;

  try {
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
  } catch (err) {
    console.error("Error fetching lost reports", err);
    res.status(500).json({ error: "Could not fetch lost reports" });
  }
};

export const getLostReportById = async (req, res) => {
  try {
    const lostReport = await LostReport.findByPk(req.params.id, {
      include: [
        { model: AnimalProfile },
        { model: Profile, as: "user", attributes: ["id", "full_name", "profile_photo"] },
        { model: Photo },
      ],
    });

    if (!lostReport) {
      return res.status(404).json({ error: "Lost report not found" });
    }

    res.json(lostReport);
  } catch (err) {
    console.error("Error fetching lost report", err);
    res.status(500).json({ error: "Could not fetch lost report" });
  }
};

export const updateLostReportStatus = async (req, res) => {
  const { status } = req.body;

  const validStatuses = ["active", "resolved", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${validStatuses.join(", ")}` });
  }

  try {
    const lostReport = await LostReport.findByPk(req.params.id);

    if (!lostReport) {
      return res.status(404).json({ error: "Lost report not found" });
    }

    if (lostReport.user_id !== req.user.id) {
      return res.status(403).json({ error: "You do not own this report" });
    }

    lostReport.status = status;
    await lostReport.save();

    res.json(lostReport);
  } catch (err) {
    console.error("Error updating lost report status", err);
    res.status(500).json({ error: "Could not update lost report" });
  }
};

export const deleteLostReport = async (req, res) => {
  try {
    const lostReport = await LostReport.findByPk(req.params.id);

    if (!lostReport) {
      return res.status(404).json({ error: "Lost report not found" });
    }

    if (lostReport.user_id !== req.user.id) {
      return res.status(403).json({ error: "You do not own this report" });
    }

    await lostReport.destroy();

    res.json({ message: "Lost report deleted" });
  } catch (err) {
    console.error("Error deleting lost report", err);
    res.status(500).json({ error: "Could not delete lost report" });
  }
};