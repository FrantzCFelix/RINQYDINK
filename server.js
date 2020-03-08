'use strict';

const express = require(`express`);
const expressHandlebars = require(`express-handlebars`);
const session = require(`express-session`);

const passport = require(`./config/passport`);
const db = require(`./models`);

// eslint-disable-next-line no-magic-numbers
const PORT = process.env.PORT || 5000;

const app = express();

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

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}`);
  });
});
