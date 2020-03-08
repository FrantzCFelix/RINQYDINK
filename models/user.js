'use strict';

const bcrypt = require(`bcryptjs`);

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define(`User`, {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  User.addHook(`beforeSave`, user => {
    const rounds = 10;
    user.password = bcrypt.hashSync(
      user.password,
      bcrypt.genSaltSync(rounds),
      null
    );
  });

  User.associate = function(models) {
    User.hasMany(models.HighScore, {
      onDelete: `CASCADE`
    });
  };
  return User;
};
