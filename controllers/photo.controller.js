import { randomUUID } from "crypto";
import supabase from "../db/supabaseClient.js";
import { Photo, LostReport, SightingReport } from "../models/index.js";
import { catchAsync } from "../helpers/catchAsync.js";
import { AppError } from "../helpers/AppError.js";

const BUCKET = "photos";

export const uploadPhoto = catchAsync(async (req, res) => {
  const { lost_report_id, sighting_report_id, is_primary } = req.body;

  if (!req.file) {
    throw new AppError("No file provided", 400);
  }

  if (!lost_report_id && !sighting_report_id) {
    throw new AppError("lost_report_id or sighting_report_id is required", 400);
  }

  if (lost_report_id && sighting_report_id) {
    throw new AppError("Provide only one of lost_report_id or sighting_report_id", 400);
  }

  if (lost_report_id) {
    const lostReport = await LostReport.findByPk(lost_report_id);
    if (!lostReport) {
      throw new AppError("Lost report not found", 404);
    }
  }

  if (sighting_report_id) {
    const sightingReport = await SightingReport.findByPk(sighting_report_id);
    if (!sightingReport) {
      throw new AppError("Sighting report not found", 404);
    }
  }

  const extension = req.file.originalname.split(".").pop();
  const fileName = `${req.user.id}/${randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, req.file.buffer, {
      contentType: req.file.mimetype,
    });

  if (uploadError) {
    console.error("Error uploading to Supabase Storage", uploadError);
    throw new AppError("Could not upload file", 500);
  }

  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

  const photo = await Photo.create({
    lost_report_id: lost_report_id || null,
    sighting_report_id: sighting_report_id || null,
    uploaded_by: req.user.id,
    url: publicUrlData.publicUrl,
    is_primary: is_primary === "true" || is_primary === true,
    width: null,
    height: null,
    file_size: req.file.size,
    mime_type: req.file.mimetype,
  });

  res.status(201).json(photo);
});

export const deletePhoto = catchAsync(async (req, res) => {
  const photo = await Photo.findByPk(req.params.id);

  if (!photo) {
    throw new AppError("Photo not found", 404);
  }

  if (photo.uploaded_by !== req.user.id) {
    throw new AppError("You do not own this photo", 403);
  }

  const path = photo.url.split(`${BUCKET}/`)[1];

  if (path) {
    await supabase.storage.from(BUCKET).remove([path]);
  }

  await photo.destroy();

  res.json({ message: "Photo deleted" });
});