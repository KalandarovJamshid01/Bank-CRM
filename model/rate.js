module.exports = (sequelize, DataTypes) => {
  const rates = sequelize.define('rates', {
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 0,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.STRING,
    },
  });
  return rates;
};
