'use strict';

const express = require(`express`);
const app = express();
const expressHandlebars = require(`express-handlebars`);
const session = require(`express-session`);
const socketIO = require(`socket.io`);
const passport = require(`./config/passport`);
const db = require(`./models`);

// eslint-disable-next-line no-magic-numbers
const PORT = process.env.PORT || 5000;

app.use(express.static(`public`));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({ secret: `secret password`, resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

app.engine(`handlebars`, expressHandlebars({ defaultLayout: `main` }));
app.set(`view engine`, `handlebars`);
require(`./controllers/routes.js`)(app, db.sequelize);

(async () => {
  await db.sequelize.sync();
  const server = app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}`);
  });

  const io = socketIO(server);

  io.use((socket, next) => {
    const { username } = socket.handshake.query;
    console.log(username);
    const { id } = socket.handshake.query;
    if (username || id) {
      return next();
    }
    return next(new Error(`error receiving user's name`));
  });

  // back up ID if query in handshake is empty
  const logId = 0;
  io.on(`connection`, socket => {
    const { username } = socket.handshake.query;
    const { id } = socket.handshake.query;

    io.engine.generateId = () => {
      if (username) {
        return `User: ${username}`; // custom id must be unique
      } else if (id) {
        return `Anonymous: ${id}`;
      } else {
        return `Log: ${logId}`;
      }
    };
    console.log(` ${socket.id} connected`);
    socket.on(`chat message`, msg => {
      io.sockets.emit(`chat message`, msg);
      console.log(`${socket.id} said ${msg}`);
    });
    socket.on(`disconnect`, () => {
      console.log(`${socket.id} disconected`);
    });
  });
})();
/** ********TO DEBUG(client side)**********
  Paste localStorage.debug = '*'; into broswer console
  ***************************/

const UserDAO = require('./src/main/daos/UsersDao');
app.get('/test', async (req, res) => {
  //note async here
  let user = await UserDAO.getOneUser();
  res.json(user);
});

const HighscoreDAO = require('./src/main/daos/HighscoresDAO');
app.get('/test', async (req, res) => {
  //note async here
  let highscore = await HighscoreDAO.getOneHighscore();
  res.json(highscore);
});
