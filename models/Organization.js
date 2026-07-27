import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "Organization",
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: DataTypes.TEXT,
      phone: DataTypes.STRING,
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: DataTypes.GEOMETRY("POINT", 4326),
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "organizations",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );