'use strict';

const db = require(`../models`);

// eslint-disable-next-line no-unused-vars
module.exports = (app, sequelize) => {
  // by max method
  //   app.get('/api/highscores/top', (req, res) => {
  //     db.HighScore
  //       .findAll({
  //         attributes: [
  //           [sequelize.fn('max', sequelize.col('score')), 'high_score']
  //         ],
  //         raw: true
  //       })
  //       .then(dbScore => {
  //         console.log(dbScore);
  //         res.json(dbScore);
  //       });
  //   });

  app.get(`/api/highscores/top`, (req, res) => {
    db.HighScore.findAll({
      order: [[`score`, `DESC`]],
      raw: true
    }).then(dbScore => {
      res.json(dbScore);
    });
  });

  app.get(`/`, (req, res) => {
    db.HighScore.findAll({}).then(dbScore => {
      const highScoresObj = {
        highScores: dbScore
      };
      res.render(`index`, highScoresObj);
    });
  });

  app.delete(`/api/highscores/:id`, (req, res) => {
    db.HighScore.destroy({
      where: {
        id: req.params.id
      }
    }).then(dbScore => {
      res.json(dbScore);
    });
  });

  app.post(`/api/highscores`, (req, res) => {
    db.HighScore.create({
      score: req.body.score,
      UserId: req.body.id
    }).then(dbScore => {
      res.json(dbScore);
    });
  });
};
