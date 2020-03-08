'use strict';

const isAuthenticated = require(`../config/middleware/isAuthenticated`);
const passport = require(`../config/passport`);
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

  app.get(`/`, (req, res) => {
    if (req.user) {
      res.redirect(`/members`);
    }
    res.render(`index`);
  });

  app.get(`/signup`, (req, res) => {
    res.render(`signup`);
  });

  app.get(`/login`, (req, res) => {
    if (req.user) {
      res.redirect(`/members`);
    }
    res.render(`login`);
  });

  app.get(`/members`, isAuthenticated, (req, res) => {
    res.render(`members`);
  });

  app.get(`/profile`, isAuthenticated, (req, res) => {
    // console.log(req.user);
    const userInfo = {};
    db.HighScore.findAll({
      include: [db.User],
      where: {
        UserId: req.user.id
      },
      order: [[`score`, `DESC`]],
      raw: true
    }).then(userScores => {
      userInfo.userScores = userScores;
      // console.log(userInfo);
    });
    res.render(`profile`, userInfo);
  });

  app.post(`/api/login`, passport.authenticate(`local`), (req, res) => {
    const user = { user: req.user };
    res.render(`login`, user);
  });

  app.post(`/api/signup`, (req, res) => {
    db.User.create({
      username: req.body.username,
      password: req.body.password
    })
      .then(() => {
        const statusCode = 307;
        res.redirect(statusCode, `/api/login`);
      })
      .catch(err => {
        const unauthenticatedStatusCode = 401;
        res.status(unauthenticatedStatusCode).json(err);
      });
  });

  app.get(`/logout`, (req, res) => {
    req.logout();
    res.redirect(`/`);
  });

  app.get(`/api/user_data`, (req, res) => {
    if (!req.user) {
      res.json({});
    } else {
      res.json({
        username: req.user.username,
        id: req.user.id
      });
    }
  });

  app.get(`/api/highscores/top`, (req, res) => {
    const result = {};
    db.HighScore.findAll({
      include: [db.User],
      order: [[`score`, `DESC`]],
      raw: true
    }).then(dbScore => {
      if (dbScore[0] !== undefined) {
        result.score = dbScore[0].score;
        result.name = dbScore[0][`User.username`];
        res.json(result);
      } else {
        res.end();
      }
    });
  });

  // app.get(`/`, (req, res) => {
  //   db.HighScore.findAll({
  //     include: [db.User],
  //     order: [[`score`, `DESC`]],
  //     raw: true
  //   }).then(dbScore => {
  //     const highScoresObj = {
  //       highScores: dbScore
  //     };
  //     res.render(`index`, highScoresObj);
  //   });
  // });

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
