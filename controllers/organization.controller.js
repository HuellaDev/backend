import { Organization, Profile } from "../models/index.js";
import { catchAsync } from "../helpers/catchAsync.js";
import { AppError } from "../helpers/AppError.js";

export const createOrganization = catchAsync(async (req, res) => {
  const { name, address, phone, type } = req.body;

  if (!name || !type) {
    throw new AppError("name and type are required", 400);
  }

  const existing = await Organization.findOne({ where: { user_id: req.user.id } });

  if (existing) {
    throw new AppError("This user already has an organization", 409);
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
});

export const getOrganizations = catchAsync(async (req, res) => {
  const { type, verified } = req.query;

  const where = {};
  if (type) where.type = type;
  if (verified !== undefined) where.verified = verified === "true";

  const organizations = await Organization.findAll({
    where,
    include: [{ model: Profile, attributes: ["id", "full_name", "profile_photo"] }],
    order: [["created_at", "DESC"]],
  });

  res.json(organizations);
});

export const getOrganizationById = catchAsync(async (req, res) => {
  const organization = await Organization.findByPk(req.params.id, {
    include: [{ model: Profile, attributes: ["id", "full_name", "profile_photo"] }],
  });

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  res.json(organization);
});

export const updateOrganization = catchAsync(async (req, res) => {
  const { name, address, phone, type } = req.body;

  const organization = await Organization.findByPk(req.params.id);

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  if (organization.user_id !== req.user.id) {
    throw new AppError("You do not own this organization", 403);
  }

  if (name !== undefined) organization.name = name;
  if (address !== undefined) organization.address = address;
  if (phone !== undefined) organization.phone = phone;
  if (type !== undefined) organization.type = type;

  await organization.save();

  res.json(organization);
});

export const deleteOrganization = catchAsync(async (req, res) => {
  const organization = await Organization.findByPk(req.params.id);

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  if (organization.user_id !== req.user.id) {
    throw new AppError("You do not own this organization", 403);
  }

  await organization.destroy();

  res.json({ message: "Organization deleted" });
});