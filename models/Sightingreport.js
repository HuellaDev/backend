import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "SightingReport",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      animal_id: DataTypes.UUID,
      profile_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      anonymous: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      location: DataTypes.GEOMETRY("POINT", 4326),
      status: DataTypes.STRING,
    },
    {
      tableName: "sighting_reports",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );