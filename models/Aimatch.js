import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "AiMatch",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      lost_report_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      sighting_report_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      similarity: DataTypes.DECIMAL,
      fur_similarity: DataTypes.DECIMAL,
      color_similarity: DataTypes.DECIMAL,
      shape_similarity: DataTypes.DECIMAL,
      face_similarity: DataTypes.DECIMAL,
      confidence: DataTypes.DECIMAL,
      ai_model: DataTypes.STRING,
      status: DataTypes.STRING,
      reviewed_by: DataTypes.UUID,
      reviewed_at: DataTypes.DATE,
    },
    {
      tableName: "ai_matches",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );