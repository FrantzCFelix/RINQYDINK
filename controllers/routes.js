'use strict';
const bcrypt = require(`bcryptjs`);
const isAuthenticated = require(`../config/middleware/isAuthenticated`);
const passport = require(`../config/passport`);
const nodemailer = require(`nodemailer`);
const db = require(`../models`);

// eslint-disable-next-line no-unused-vars
module.exports = (app, sequelize) => {
  app.get(`/`, (req, res) => {
    if (req.user) {
      res.redirect(`/members`);
    } else {
      res.render(`index`);
    }
  });

  app.get(`/signup`, (req, res) => {
    res.render(`signup`);
  });

  app.get(`/login`, (req, res) => {
    if (req.user) {
      res.redirect(`/members`);
    } else {
      res.render(`login`);
    }
  });

  app.get(`/members`, isAuthenticated, (req, res) => {
    res.render(`members`);
  });

  app.get(`/profile`, isAuthenticated, (req, res) => {
    db.HighScore.findAll({
      where: {
        UserId: req.user.id
      },
      order: [[`score`, `DESC`]],
      raw: true
    }).then(userScores => {
      const userInfo = {
        highScores: userScores
      };
      res.render(`profile`, userInfo);
    });
  });

  app.get(`/solo`, isAuthenticated, (req, res) => {
    res.render(`solo`);
  });

  app.get(`/coop`, isAuthenticated, (req, res) => {
    res.render(`coop`);
  });

  app.get(`/leaderboard`, isAuthenticated, (req, res) => {
    db.HighScore.findAll({
      include: [db.User],
      order: [[`score`, `DESC`]],
      limit: 20,
      raw: true
    }).then(dbScore => {
      for (const score of dbScore) {
        score.signedIn = req.user.id;
        if (score.signedIn === score[`User.id`]) {
          score.status = true;
        } else {
          score.status = false;
        }
      }
      const highScoresObj = {
        highScores: dbScore
      };
      console.log(highScoresObj);
      res.render(`leaderboard`, highScoresObj);
    });
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

  app.put(`/api/reset`, (req, res) => {
    const userData = {
      password: req.body.password
    };
    const rounds = 10;
    userData.password = bcrypt.hashSync(
      userData.password,
      bcrypt.genSaltSync(rounds),
      null
    );
    db.User.update(userData, {
      where: {
        id: req.user.id
      }
    }).catch(err => {
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

  app.delete(`/api/highscores/:id`, (req, res) => {
    db.HighScore.destroy({
      where: {
        id: req.params.id
      }
    }).then(dbScore => {
      res.json(dbScore);
    });
  });

  app.post(`/api/highscores`, isAuthenticated, (req, res) => {
    db.HighScore.create({
      score: req.body.score,
      UserId: req.user.id
    }).then(() => {
      res.redirect(`/leaderboard`);
    });
  });

  app.get(`/contact`, (req, res) => {
    res.render(`contact`);
  });

  // eslint-disable-next-line no-unused-vars
  app.post(`/send`, (req, res) => {
    const output = `
      <p>New submission for Rinqydink Arcade</p>
      <h3>Contact Details</h3>
      <ul>
        <li>First Name: ${req.body.firstname}</li>
        <li>Last Name: ${req.body.lastname}</li>
        <li>Email: ${req.body.email}</li>
      </ul>
      <h3>Message</h3>
      <p>${req.body.message}</p>
    `;

    const transporter = nodemailer.createTransport({
      service: `gmail`,
      auth: {
        user: `rinqydinkarcadenoreply@gmail.com`,
        pass: `#MyPassword!`
      },
      tls:{
        rejectUnauthorized:false
      },
      logger: true
    });

    const mailOptions = {
      from: `"Rinqydink Arcade" <rinqydinkarcadenoreply@gmail.com>`,
      to: `rinqydinkarcade@yahoo.com`,
      subject: `Contact Form`,
      text: `New Message`,
      html: output
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log(`Message sent: %s`, info.messageId);
      console.log(`Preview URL: %s`, nodemailer.getTestMessageUrl(info));

      res.render(`contact`, { message:`Thank you for your feedback!` });
    });
  });
};
