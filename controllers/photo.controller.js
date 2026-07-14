import { randomUUID } from "crypto";
import supabase from "../db/supabaseClient.js";
import { Photo, LostReport, SightingReport } from "../models/index.js";

const BUCKET = "photos";

export const uploadPhoto = async (req, res) => {
  const { lost_report_id, sighting_report_id, is_primary } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "No file provided" });
  }

  if (!lost_report_id && !sighting_report_id) {
    return res.status(400).json({ error: "lost_report_id or sighting_report_id is required" });
  }

  if (lost_report_id && sighting_report_id) {
    return res.status(400).json({ error: "Provide only one of lost_report_id or sighting_report_id" });
  }

  try {
    if (lost_report_id) {
      const lostReport = await LostReport.findByPk(lost_report_id);
      if (!lostReport) {
        return res.status(404).json({ error: "Lost report not found" });
      }
    }

    if (sighting_report_id) {
      const sightingReport = await SightingReport.findByPk(sighting_report_id);
      if (!sightingReport) {
        return res.status(404).json({ error: "Sighting report not found" });
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
      return res.status(500).json({ error: "Could not upload file" });
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
  } catch (err) {
    console.error("Error creating photo record", err);
    res.status(500).json({ error: "Could not create photo record" });
  }
};

export const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findByPk(req.params.id);

    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }

    if (photo.uploaded_by !== req.user.id) {
      return res.status(403).json({ error: "You do not own this photo" });
    }

    const path = photo.url.split(`${BUCKET}/`)[1];

    if (path) {
      await supabase.storage.from(BUCKET).remove([path]);
    }

    await photo.destroy();

    res.json({ message: "Photo deleted" });
  } catch (err) {
    console.error("Error deleting photo", err);
    res.status(500).json({ error: "Could not delete photo" });
  }
};