import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "AnimalProfile",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      species: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      breed: DataTypes.STRING,
      animal_type: DataTypes.STRING,
      sex: DataTypes.STRING,
      estimated_age_months: DataTypes.INTEGER,
      size: DataTypes.STRING,
      main_color: DataTypes.STRING,
      secondary_color: DataTypes.STRING,
      collar: DataTypes.BOOLEAN,
      condition: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    {
      tableName: "animal_profiles",
      timestamps: false,
    }
  );