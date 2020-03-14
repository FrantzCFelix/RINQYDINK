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

  let numUsers = 0;

io.on('connection', (socket) => {
  var addedUser = false;

  // When the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
     // The client will execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username , randomColor) => {
      //if user already exsists do nothing
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    socket.randomColor = randomColor;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });


  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
})();
/** ********TO DEBUG(client side)**********
  Paste localStorage.debug = '*'; into broswer console
  ***************************/


const UserDAO = require('./src/main/daos/UsersDAO');
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
