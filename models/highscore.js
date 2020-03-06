'use strict';

module.exports = function(sequelize, DataTypes) {
  const HighScore = sequelize.define(`HighScore`, {
    score: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  HighScore.associate = function(models) {
    HighScore.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return HighScore;
};
