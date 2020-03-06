'use strict';

const db = require(`../models`);

// eslint-disable-next-line no-unused-vars
module.exports = (app, sequelize) => {
  // by max method
  //   app.get('/api/highscores/top', (req, res) => {
  //     db.highScore
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
    db.highScore
      .findAll({
        order: [[`score`, `DESC`]],
        raw: true
      })
      .then(dbScore => {
        res.json(dbScore);
      });
  });

  app.get(`/`, (req, res) => {
    db.highScore.findAll({}).then(dbScore => {
      const highScoresObj = {
        highScores: dbScore
      };
      res.render(`index`, highScoresObj);
    });
  });

  app.delete(`/api/highscores/:id`, (req, res) => {
    db.highScore
      .destroy({
        where: {
          id: req.params.id
        }
      })
      .then(dbScore => {
        res.json(dbScore);
      });
  });

  app.post(`/api/highscores`, (req, res) => {
    db.highScore
      .create({
        name: req.body.name,
        score: req.body.score
      })
      .then(dbScore => {
        res.json(dbScore);
      });
  });
};
