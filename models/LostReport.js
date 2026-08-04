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

      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active",
      },

      anonymous: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      // 👇 Nuevas columnas

      resolved_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      expired_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      status_changed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "lost_reports",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );