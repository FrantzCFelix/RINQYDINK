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

const Highscore = require('../models/highscores')(sequelize, Sequelize); //you can do this in many ways

module.exports = {
  getOneHighscore: function() {
    return new Promise((resolve, reject) => {
      Highscore.findOne()
        .then(highscore => {
          console.log('highscore value is ' + JSON.stringify(highscore));
          resolve(highscore);
        })
        .catch(err => {
          console.log('error occurred', err);
          reject(err);
        });
    });
  }
};
