import { Comment, Profile, LostReport, SightingReport } from "../models/index.js";

const VALID_REPORT_TYPES = ["lost_report", "sighting_report"];

const reportExists = async (report_type, report_id) => {
  if (report_type === "lost_report") {
    return await LostReport.findByPk(report_id);
  }
  return await SightingReport.findByPk(report_id);
};

export const createComment = async (req, res) => {
  const { report_type, report_id, comment, photo_url, location } = req.body;

  if (!VALID_REPORT_TYPES.includes(report_type)) {
    return res.status(400).json({ error: `report_type must be one of: ${VALID_REPORT_TYPES.join(", ")}` });
  }

  if (!report_id) {
    return res.status(400).json({ error: "report_id is required" });
  }

  try {
    const report = await reportExists(report_type, report_id);

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    const newComment = await Comment.create({
      user_id: req.user.id,
      report_type,
      report_id,
      comment,
      photo_url,
      location,
    });

    res.status(201).json(newComment);
  } catch (err) {
    console.error("Error creating comment", err);
    res.status(500).json({ error: "Could not create comment" });
  }
};

export const getCommentsForReport = async (req, res) => {
  const { report_type, report_id } = req.query;

  if (!VALID_REPORT_TYPES.includes(report_type)) {
    return res.status(400).json({ error: `report_type must be one of: ${VALID_REPORT_TYPES.join(", ")}` });
  }

  if (!report_id) {
    return res.status(400).json({ error: "report_id is required" });
  }

  try {
    const comments = await Comment.findAll({
      where: { report_type, report_id },
      include: [{ model: Profile, attributes: ["id", "full_name", "profile_photo"] }],
      order: [["created_at", "ASC"]],
    });

    res.json(comments);
  } catch (err) {
    console.error("Error fetching comments", err);
    res.status(500).json({ error: "Could not fetch comments" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.user_id !== req.user.id) {
      return res.status(403).json({ error: "You do not own this comment" });
    }

    await comment.destroy();

    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error("Error deleting comment", err);
    res.status(500).json({ error: "Could not delete comment" });
  }
};