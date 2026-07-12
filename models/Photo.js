import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "Photo",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      lost_report_id: DataTypes.UUID,
      sighting_report_id: DataTypes.UUID,
      uploaded_by: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      is_primary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      ai_processed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      width: DataTypes.INTEGER,
      height: DataTypes.INTEGER,
      file_size: DataTypes.INTEGER,
      mime_type: DataTypes.STRING,
    },
    {
      tableName: "photos",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );