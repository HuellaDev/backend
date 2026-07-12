import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "StatusHistory",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      report_type: DataTypes.STRING,
      report_id: DataTypes.UUID,
      previous_status: DataTypes.STRING,
      new_status: DataTypes.STRING,
      user_id: DataTypes.UUID,
    },
    {
      tableName: "status_history",
      timestamps: false,
    }
  );