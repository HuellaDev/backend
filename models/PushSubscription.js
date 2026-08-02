import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "PushSubscription",
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
      endpoint: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      p256dh: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      auth: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "push_subscriptions",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );