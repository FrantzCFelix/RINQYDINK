'use strict';

const express = require(`express`);
const expressHandlebars = require(`express-handlebars`);

const db = require(`./models`);

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(`public`));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine(`handlebars`, expressHandlebars({ defaultLayout: `main` }));
app.set(`view engine`, `handlebars`);
require(`./controllers/routes.js`)(app, db.sequelize);

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}`);
  });
});
