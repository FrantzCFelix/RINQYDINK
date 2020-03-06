'use strict';

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define(`User`, {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: DataTypes.STRING
  });

  User.associate = function(models) {
    User.hasMany(models.HighScore, {
      onDelete: `CASCADE`
    });
  };
  return User;
};
