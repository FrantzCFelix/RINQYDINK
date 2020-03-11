'use strict';

const Sequelize = require(`sequelize`);
const sequelize = new Sequelize(`phaser_db`, `root`, `MyPassword`, {
  host: `127.0.0.1`,
  dialect: `mysql`,
  operatorsAliases: false,
  dialectOptions: {
    dateStrings: true,
    // eslint-disable-next-line object-shorthand
    typeCast: function(field, next) {
      // for reading from database
      if (field.type === `DATETIME`) {
        return field.string();
      }
      return next();
    }
  }
});

const User = require(`../models/users`)(sequelize, Sequelize); // you can do this in many ways

module.exports = {
  // eslint-disable-next-line object-shorthand
  getOneUser: function() {
    return new Promise((resolve, reject) => {
      User.findOne()
        .then(user => {
          // eslint-disable-next-line prefer-template
          console.log(`user value is ` + JSON.stringify(user));
          resolve(user);
        })
        .catch(err => {
          console.log(`error occurred`, err);
          reject(err);
        });
    });
  }
};
