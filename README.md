# RINQYDINK

This is an app based on classic video game arcades from the 80s & early 90s. Kids used to come to play games, yes, but also to socialize and get human interaction. In the days of headsets, high-tech games, and high-speed internet connections, this app hopes to encapsulate the magic of an era lost to history along and combine it with the connectivty of today. Users are able to create their accounts and therefore compare high scores, and interact with eachother in real time either by playing multiplayer or simply using the chat feature.

Check out the repo [here](https://github.com/FrantzCFelix/RINQYDINK), and see the app in operation [here](**************).

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

![Homepage](./public/assets/images/screenshots/homepage.PNG)

## Technologies

Here are the package.json dependencies:

    "dependencies": {
        "bcryptjs": "^2.4.3",
        "express": "^4.17.1",
        "express-handlebars": "^3.1.0",
        "express-session": "^1.17.0",
        "materialize-css": "^1.0.0-rc.2",
        "mysql2": "^2.1.0",
        "passport": "^0.4.1",
        "passport-local": "^1.0.0",
        "sequelize": "^5.21.5"
    }

This package was written in JavaScript using Node.js, and uses `MySQL` (via `sequelize ORM`) to interact with the database. If the GitHub repo is forked, in order to edit the code the user can run `npm i` to install these dependency. `Express` is the module used to create a server, and `express-handlebars` is how the content is being dynamically displayed through a view engine. `materialize-css` works with the front end to style the web-page. All other dependencies not mentioned are related to creating and saving user details either in the database permanently, or in the client for the length of the session, and utilise `bcryptjs` to protect passwords.

The app is hosted via `Heroku` in order to facilitate the necessity of running a live server.

The game engine used is an API - `Phaser 3`, and this enables the app to animate and controll sprites, and at the same time write the games entirely in JavaSCript, mostly using classes.

## Code Examples

## Setup

## Features

## Status & Future Developement

## Contact

Created by [@agtravis](https://agtravis.github.io/) | [@agtravis](https://agtravis.github.io/) | [@agtravis](https://agtravis.github.io/)
