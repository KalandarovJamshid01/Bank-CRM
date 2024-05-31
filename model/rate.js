module.exports = (sequelize, DataTypes) => {
  const rates = sequelize.define('rates', {
    rate: {
      type: DataTypes.ENUM('Male', 'Female', 'Other'),
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING,
    },
  });
  return rates;
};
