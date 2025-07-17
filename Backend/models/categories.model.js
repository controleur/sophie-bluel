module.exports = (sequelize, DataTypes) => {
  const Categories = sequelize.define(
    "categories",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    { timestamps: false }
  );
  return Categories;
};
