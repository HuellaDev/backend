import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "Comment",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      report_type: DataTypes.STRING,
      report_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      comment: DataTypes.TEXT,
      photo_url: DataTypes.TEXT,
      location: DataTypes.GEOMETRY("POINT", 4326),
    },
    {
      tableName: "comments",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );