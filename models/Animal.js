import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "Animal",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    },
    {
      tableName: "animals",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );