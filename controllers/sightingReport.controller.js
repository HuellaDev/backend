import { sequelize, SightingReport, AnimalProfile, Profile, Photo } from "../models/index.js";

export const createSightingReport = async (req, res) => {
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
    console.error("Error creating sighting report", err);
    res.status(500).json({ error: "Could not create sighting report" });
  }
};

export const getSightingReports = async (req, res) => {
  const { status } = req.query;

  const where = {};
  if (status) where.status = status;

  try {
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
  } catch (err) {
    console.error("Error fetching sighting reports", err);
    res.status(500).json({ error: "Could not fetch sighting reports" });
  }
};

export const getSightingReportById = async (req, res) => {
  try {
    const sightingReport = await SightingReport.findByPk(req.params.id, {
      include: [
        { model: AnimalProfile },
        { model: Profile, as: "user", attributes: ["id", "full_name", "profile_photo"] },
        { model: Photo },
      ],
    });

    if (!sightingReport) {
      return res.status(404).json({ error: "Sighting report not found" });
    }

    res.json(sightingReport);
  } catch (err) {
    console.error("Error fetching sighting report", err);
    res.status(500).json({ error: "Could not fetch sighting report" });
  }
};

export const updateSightingReportStatus = async (req, res) => {
  const { status } = req.body;

  const validStatuses = ["active", "resolved", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${validStatuses.join(", ")}` });
  }

  try {
    const sightingReport = await SightingReport.findByPk(req.params.id);

    if (!sightingReport) {
      return res.status(404).json({ error: "Sighting report not found" });
    }

    if (sightingReport.user_id !== req.user.id) {
      return res.status(403).json({ error: "You do not own this report" });
    }

    sightingReport.status = status;
    await sightingReport.save();

    res.json(sightingReport);
  } catch (err) {
    console.error("Error updating sighting report status", err);
    res.status(500).json({ error: "Could not update sighting report" });
  }
};

export const deleteSightingReport = async (req, res) => {
  try {
    const sightingReport = await SightingReport.findByPk(req.params.id);

    if (!sightingReport) {
      return res.status(404).json({ error: "Sighting report not found" });
    }

    if (sightingReport.user_id !== req.user.id) {
      return res.status(403).json({ error: "You do not own this report" });
    }

    await sightingReport.destroy();

    res.json({ message: "Sighting report deleted" });
  } catch (err) {
    console.error("Error deleting sighting report", err);
    res.status(500).json({ error: "Could not delete sighting report" });
  }
};