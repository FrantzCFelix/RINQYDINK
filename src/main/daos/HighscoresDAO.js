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

const Highscore = require(`../models/highscores`)(sequelize, Sequelize); // you can do this in many ways

module.exports = {
  getOneHighscore() {
    return new Promise((resolve, reject) => {
      Highscore.findOne()
        .then(highscore => {
          // eslint-disable-next-line prefer-template
          console.log(`highscore value is ` + JSON.stringify(highscore));
          resolve(highscore);
        })
        .catch(err => {
          console.log(`error occurred`, err);
          reject(err);
        });
    });
  }
};
