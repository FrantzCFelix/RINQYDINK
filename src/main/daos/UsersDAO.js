const Sequelize = require('sequelize');
const sequelize = new Sequelize('phaser_db', 'root', 'George1!', {
  host: '127.0.0.1',
  dialect: 'mysql',
  operatorsAliases: false,
  dialectOptions: {
    dateStrings: true,
    typeCast: function(field, next) {
      // for reading from database
      if (field.type === 'DATETIME') {
        return field.string();
      }
      return next();
    }
  }
});

const User = require('../models/users')(sequelize, Sequelize); //you can do this in many ways

module.exports = {
  getOneUser: function() {
    return new Promise((resolve, reject) => {
      User.findOne()
        .then(user => {
          console.log('user value is ' + JSON.stringify(user));
          resolve(user);
        })
        .catch(err => {
          console.log('error occurred', err);
          reject(err);
        });
    });
  }
};
