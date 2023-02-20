const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('cribs', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: DataTypes.STRING,
    location: DataTypes.STRING,
    img: DataTypes.STRING,
  });
};
