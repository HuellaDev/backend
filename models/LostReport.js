import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "LostReport",
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
      pet_name: DataTypes.STRING,
      contact_phone: DataTypes.STRING,
      last_seen_location: DataTypes.GEOMETRY("POINT", 4326),
      search_radius_meters: DataTypes.INTEGER,
      reward_amount: DataTypes.DECIMAL,
      status: DataTypes.STRING,
      anonymous: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "lost_reports",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );