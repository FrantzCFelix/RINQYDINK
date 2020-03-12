/* jshint indent: 2 */
/* eslint-disable no-magic-numbers */

'use strict';


module.exports = function(sequelize, DataTypes) {
  return sequelize.define(`users`, {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: `id`
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      field: `username`
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: `password`
    }
  }, {
    tableName: `users`,
    timestamps: true,
    createdAt: `creTs`,
    updatedAt: `updTs`
  });
};
