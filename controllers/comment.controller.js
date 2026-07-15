import { Comment, Profile, LostReport, SightingReport } from "../models/index.js";
import { createNotification } from "../helpers/notification.helper.js";
import { catchAsync } from "../helpers/catchAsync.js";
import { AppError } from "../helpers/AppError.js";

const VALID_REPORT_TYPES = ["lost_report", "sighting_report"];

const reportExists = async (report_type, report_id) => {
  if (report_type === "lost_report") {
    return await LostReport.findByPk(report_id);
  }
  return await SightingReport.findByPk(report_id);
};

export const createComment = catchAsync(async (req, res) => {
  const { report_type, report_id, comment, photo_url, location } = req.body;

  if (!VALID_REPORT_TYPES.includes(report_type)) {
    throw new AppError(`report_type must be one of: ${VALID_REPORT_TYPES.join(", ")}`, 400);
  }

  if (!report_id) {
    throw new AppError("report_id is required", 400);
  }

  const report = await reportExists(report_type, report_id);

  if (!report) {
    throw new AppError("Report not found", 404);
  }

  const newComment = await Comment.create({
    user_id: req.user.id,
    report_type,
    report_id,
    comment,
    photo_url,
    location,
  });

  if (report.user_id !== req.user.id) {
    await createNotification({
      user_id: report.user_id,
      type: "new_comment",
      title: "New comment on your report",
      message: comment ? comment.slice(0, 100) : "Someone commented on your report",
    });
  }

  res.status(201).json(newComment);
});

export const getCommentsForReport = catchAsync(async (req, res) => {
  const { report_type, report_id } = req.query;

  if (!VALID_REPORT_TYPES.includes(report_type)) {
    throw new AppError(`report_type must be one of: ${VALID_REPORT_TYPES.join(", ")}`, 400);
  }

  if (!report_id) {
    throw new AppError("report_id is required", 400);
  }

  const comments = await Comment.findAll({
    where: { report_type, report_id },
    include: [{ model: Profile, attributes: ["id", "full_name", "profile_photo"] }],
    order: [["created_at", "ASC"]],
  });

  res.json(comments);
});

export const deleteComment = catchAsync(async (req, res) => {
  const comment = await Comment.findByPk(req.params.id);

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  if (comment.user_id !== req.user.id) {
    throw new AppError("You do not own this comment", 403);
  }

  await comment.destroy();

  res.json({ message: "Comment deleted" });
});