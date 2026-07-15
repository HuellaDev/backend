import { Organization, Profile } from "../models/index.js";

export const createOrganization = async (req, res) => {
  const { name, address, phone, type } = req.body;

  if (!name || !type) {
    return res.status(400).json({ error: "name and type are required" });
  }

  try {
    const existing = await Organization.findOne({ where: { user_id: req.user.id } });

    if (existing) {
      return res.status(409).json({ error: "This user already has an organization" });
    }

    const organization = await Organization.create({
      user_id: req.user.id,
      name,
      address,
      phone,
      type,
      verified: false,
    });

    res.status(201).json(organization);
  } catch (err) {
    console.error("Error creating organization", err);
    res.status(500).json({ error: "Could not create organization" });
  }
};

export const getOrganizations = async (req, res) => {
  const { type, verified } = req.query;

  const where = {};
  if (type) where.type = type;
  if (verified !== undefined) where.verified = verified === "true";

  try {
    const organizations = await Organization.findAll({
      where,
      include: [{ model: Profile, attributes: ["id", "full_name", "profile_photo"] }],
      order: [["created_at", "DESC"]],
    });

    res.json(organizations);
  } catch (err) {
    console.error("Error fetching organizations", err);
    res.status(500).json({ error: "Could not fetch organizations" });
  }
};

export const getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findByPk(req.params.id, {
      include: [{ model: Profile, attributes: ["id", "full_name", "profile_photo"] }],
    });

    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }

    res.json(organization);
  } catch (err) {
    console.error("Error fetching organization", err);
    res.status(500).json({ error: "Could not fetch organization" });
  }
};

export const updateOrganization = async (req, res) => {
  const { name, address, phone, type } = req.body;

  try {
    const organization = await Organization.findByPk(req.params.id);

    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }

    if (organization.user_id !== req.user.id) {
      return res.status(403).json({ error: "You do not own this organization" });
    }

    if (name !== undefined) organization.name = name;
    if (address !== undefined) organization.address = address;
    if (phone !== undefined) organization.phone = phone;
    if (type !== undefined) organization.type = type;

    await organization.save();

    res.json(organization);
  } catch (err) {
    console.error("Error updating organization", err);
    res.status(500).json({ error: "Could not update organization" });
  }
};

export const deleteOrganization = async (req, res) => {
  try {
    const organization = await Organization.findByPk(req.params.id);

    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }

    if (organization.user_id !== req.user.id) {
      return res.status(403).json({ error: "You do not own this organization" });
    }

    await organization.destroy();

    res.json({ message: "Organization deleted" });
  } catch (err) {
    console.error("Error deleting organization", err);
    res.status(500).json({ error: "Could not delete organization" });
  }
};