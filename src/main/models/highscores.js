/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('highscores', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'score'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'UserId'
    }
  }, {
    tableName: 'highscores',
    timestamps: true,
    createdAt: 'creTs',
    updatedAt: 'updTs'
  });
};
