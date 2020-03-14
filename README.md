# RINQYDINK

### UML

![Homepage](./public/assets/images/screenshots/UML.png)

This is an app based on classic video game arcades from the 80s & early 90s. Kids used to come to play games, yes, but also to socialize and get human interaction. In the days of headsets, high-tech games, and high-speed internet connections, this app hopes to encapsulate the magic of an era lost to history along and combine it with the connectivity of today. Users are able to create their accounts and therefore compare high scores, and interact with each other in real time either by ~~playing multiplayer~~ or simply using the chat feature.

Check out the repo [here](https://github.com/FrantzCFelix/RINQYDINK), and see the app in operation [here](https://rinqydinky.herokuapp.com/).

This app runs in the browser - see [Setup](#setup) below for instructions on how to use.

## Table of contents

- [Screenshots](#screenshots)
- [Technologies](#technologies)
- [Code Examples](#code-examples)
- [Setup](#setup)
- [Features](#features)
- [Status](#status)
- [Contact](#contact)

## Screenshots

![Homepage](./public/assets/images/screenshots/log-in.PNG)
![Homepage](./public/assets/images/screenshots/homepage.PNG)
![Homepage](./public/assets/images/screenshots/instructions.PNG)
![Homepage](./public/assets/images/screenshots/game-chat.png)
![Homepage](./public/assets/images/screenshots/leaderboard.PNG)
![Homepage](public\assets\images\screenshots\chat-screen-shot.png)

## Technologies

Here are the package.json dependencies:

    "dependencies": {
        "bcryptjs": "^2.4.3",
        "express": "^4.17.1",
        "express-handlebars": "^3.1.0",
        "express-session": "^1.17.0",
        "mysql2": "^2.1.0",
        "nodemailer": "^6.4.5",
        "passport": "^0.4.1",
        "passport-local": "^1.0.0",
        "sequelize": "^5.21.5",
        "socket.io": "^2.3.0",
        "socket.io-client": "^2.3.0"
    }

This package was written in JavaScript using Node.js, and uses `MySQL` (via `sequelize ORM`) to interact with the database. If the GitHub repo is forked, in order to edit the code the user can run `npm i` to install these dependency. `Express` is the module used to create a server, and `express-handlebars` is how the content is being dynamically displayed through a view engine. `materialize-css` works with the front end to style the web-page. `socket.io` and `socket.io-client` are to support the chat window.

All other dependencies not mentioned are related to creating and saving user details either in the database permanently, or in the client for the length of the session, and utilize `bcryptjs` to protect passwords. `nodemailer` was used to send the us form submitted from the contact page.

The app is hosted via `Heroku` in order to facilitate the necessity of running a live server.

The game engine used is an API - `Phaser 3`, and this enables the app to animate and controll sprites, and at the same time write the games entirely in JavaSCript, mostly using classes.

## Code Examples

To start, let's look at some of the `CRUD` operations:

### Create

This happens in two seperate occasions, for two different tables. Both when a user signs up for a new account, and when a new score is created. The user signing up is by far more interesting:

    function signUpUser(username, password) {
        $.post(`/api/signup`, {
            username,
            password
        })
        .then(() => {
            window.location.replace(`/members`);
        })
        .catch(handleSignupErr);
    }

This is the API request that handles the form submission. The object `post`ed to the router is the username and password the user has entered (code not shown) in fields on screen. In the router:

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

we can see that the `create` method is applied passing the properties of the object that was passed. In the ORM (`sequelize`) for the model that represents the table in `MySQL`:

    User.addHook(`beforeSave`, user => {
        const rounds = 10;
        user.password = bcrypt.hashSync(
            user.password,
            bcrypt.genSaltSync(rounds),
            null
        );
    });

(this is not the whole model, just the relevant part) we can see that a hook is added (this is a method of waiting for an appropriate point in the process to run specific code) to take a value and encrypt it, using `bcrypt`. A prototype function exists in this model to be able to compare a user input password during login to the encrypted password saved in the database as well.

If successful in the sign up, back in the API AJAX request, the user is then redirected to the `/members` route, and we can follow the `Read` part of `CRUD`.

### Read

The `get` part of the above flow is actually pretty straightforward, so instead of demonstrating that, here is a more complicated `get` involving a join and an object being passed to the view engine:

    app.get(`/leaderboard`, isAuthenticated, (req, res) => {
        db.HighScore.findAll({
            include: [db.User],
            order: [[`score`, `DESC`]],
            raw: true
        }).then(dbScore => {
            const highScoresObj = {
                highScores: dbScore
            };
            res.render(`leaderboard`, highScoresObj);
        });
    });

This `get` route is accessed when either the user chooses to view the Leader Board page, or when they finish a game and their score is logged to the database they are redirected to this page automatically. The `HighScores` table (factoring in sequelize's auto pluralizer) has a `findAll` method run on in. The first property is the `JOIN`, and since this table has a foreign key representing the ID column of the `Users` table, this is `include`d here. The `order` property is because we want scores to be displayed with the highest at the top, and `raw: true` means we only get returned the literal content of the table - no other information which is not be useful for our purposes.

Next, the returned object, an array, has to be itself placed inside an object so it can be sent to the view engine to be rendered with `leaderboard` (a string representing a `.handlebars` file). In the handlebars file:

    <ol>
        {{#each highScores}}
        <li data-id="{{id}}">
            {{'User.username'}} scored {{score}}
        </li>
        {{/each}}
    </ol>

an ordered list generates a list item for each object that exists within the array that was passed, forming a simple concatenation that is displayed in the browser.

### Update

Next in our `CRUD` is update. There is only one instance of this app using this, and that is where a user wants to change their password:

It starts with an API `PUT` AJAX request, that passes the new password to the router, and then reloads (technically redirects)the page. In the router:

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

briefly, the passed new paweors is stored in a new object that will match the database model requirements. The password is then encrypted in a similar fashion to the `hook` in the model, and then the sequelize `update` query is run.

### Delete

Finally let's look at a delete. If the user clicks on a delete button for a high score (which will only be shown next to their own high scores, they cannot delete other user high scores), they an API `DELETE` request is made. In the router:

    app.delete(`/api/highscores/:id`, (req, res) => {
        db.HighScore.destroy({
            where: {
                id: req.params.id
            }
        }).then(dbScore => {
            res.json(dbScore);
        });
    });

`destroy` is the method used to identify the specific record of the `HighScores` table. For this route, instead of passing the ID of the record as part of the object (`req.body.id`), the ID is passed using the parameters variable (`/:id` == `req.params.id`).

## Socket.io

### Socket.io-UML

![Homepage](public\assets\images\screenshots\socket-io-uml.png)

Each one of the above bubble is a different repo that each part of socket.io lives and how they are connected.

### How It Works

---

#### engine.io-parser

This is the JavaScript parser for the engine.io protocol encoding

#### engine.io-

Engine.IO is the implementation of transport-based cross-browser/cross-device bi-directional communication layer for Socket.IO.
Its main feature is the ability to swap transports on the fly. A connection starts with XHR polling, but can then switch to WebSocket if possible. (So does engine.io-client)

#### engine.io-client

This is the client for Engine.IO, the implementation of transport-based cross-browser/cross-device bi-directional communication layer for Socket.IO. It runs in both the browser and Node.js. It uses the engine.io-parser to encode/decode packets.

#### socket.io-adapter

This is the default Socket.IO in-memory adapter class. This module is not intended for end-user usage, but can be used as an interface to inherit from from other adapters you might want to build, like socket.io-redis.

#### socket.io-redis

This is the adapter using the Redis Pub/Sub mechanism to broadcast messages between multiple nodes.

#### socket.io-parser

A socket.io encoder and decoder written in JavaScript complying with version 3 of socket.io-protocol. Used by socket.io and socket.io-client.

#### socket.io-

Socket.IO brings some syntactic sugar over the Engine.IO “raw” API. It also brings two new concepts, Rooms and Namespaces, which introduce a separation of concern between communication channels. By default, it exposes a browser build of the client at /socket.io/socket.io.js.
It uses the socket.io-parser to encode/decode packets.

#### socket.io-client

This is the client for Socket.IO. It relies on engine.io-client, which manages the transport swapping and the disconnection detection.
It handles reconnection automatically, in case the underlying connection is severed.

#### More socket.io info?

Checkout their docs at https://socket.io/docs/
Their github repo can be found here https://github.com/socketio

## Setup

To set up this app as a user, you simply go to the website [here](https://rinqydinky.herokuapp.com/) and sign up for an account. All it requires is a username and password. From that point you are automatically logged in and ready to go, or on following visits you would login with those credentials. All your scores are stored in your own personal history, and users can delete any scores of their own with which they are unhappy. Users can also change their password from inside their profile.

### Gameplay

The rules of the space shooter game itself are very simple. You start with 3 lives, and if an enemy ship touches you, you lose a life. If you destroy an enemy, you score points, but if an enemy makes it to the bottom of the screen, you lose points (negative scores are totally possible). Different ships have different speeds, and will take varying amounts of points off your score. You will not be able to get every ship, so this game is about making decisions on the fly about which objectives are more important. Every 30 seconds when the game levels up, power-ups will appear containing extra lives, but don't shoot them! As the levels go up, the speed intensifies and the scores and penalties increase!

Use the cursor keys to move around, and spacebar to shoot.

## Features

This app has a cool chat feature that enables users to talk to each other while playing. The fact that you have to sign up for an account makes it more competitive and helps identify individuals in the chat.

## Status & Future Developement

This app already achieves more than we set out to achieve. Our MVP was simply to provide a fun, basic game platform, using JavaScript, and running it in the browser. Adding the sign in and chat features brings us to MVP+. To take it to MVP++, we would like to have multiple games, all with their own accompanying high scores. The logical next step for MVP+++ would be to enable users to submit their own games to add to the arcade, and ultimately we could provide tools (spritesheets, tilemaps, code examples & tutorials) for users to do this.

Multiplayer.....................................

## Contact

Created by [@agtravis](https://agtravis.github.io/) | [@FrantzCFelix](https://frantzcfelix.github.io/index.html) | [@ddhoang21](https://ddhoang21.github.io/My-Portfolio/)
