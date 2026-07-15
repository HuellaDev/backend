import { sequelize } from "../models/index.js";
import { catchAsync } from "../helpers/catchAsync.js";

export const healthCheck = catchAsync(async (req, res) => {
  await sequelize.authenticate();

  res.json({
    status: "ok",
    database: "connected",
    timestamp: new Date().toISOString(),
  });
});