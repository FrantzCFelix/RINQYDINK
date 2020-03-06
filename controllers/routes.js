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
    const result = {};
    db.HighScore.findAll({
      include: [db.User],
      order: [[`score`, `DESC`]],
      raw: true
    }).then(dbScore => {
      result.score = dbScore[0].score;
      db.User.findByPk(dbScore[0].UserId).then(dbUsername => {
        result.name = dbUsername.dataValues.username;
        res.json(result);
      });
    });
  });

  app.get(`/`, (req, res) => {
    db.HighScore.findAll({
      include: [db.User],
      order: [[`score`, `DESC`]],
      raw: true
    }).then(dbScore => {
      // console.log(dbScore);
      // console.log(dbScore[0].id);
      // console.log(dbScore[0][`User.username`]);
      const highScoresObj = {
        highScores: dbScore
      };
      console.log(highScoresObj);
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
