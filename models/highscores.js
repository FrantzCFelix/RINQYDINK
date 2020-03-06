'use strict';

module.exports = function(sequelize, DataTypes) {
  const highScore = sequelize.define(`highScore`, {
    name: DataTypes.STRING,
    score: DataTypes.INTEGER
  });
  return highScore;
};
