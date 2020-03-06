'use strict';
/*DEPENDENCIES*/
/*IIFE immediately Invoked function expression
**************EXAMPLE****************
const express = require("express")
const app = express();
*************************************
Basically requires the module, immediately invokes the express() function,
 creating our server and sets it equal to app. */ 
 const app = require('express')();
 const ip = require("ip");
/**************/





// EXPRESS CONFIGURATION
//Sets an intial port 
const PORT = process.env.PORT || 3000;

//Express Middleware
/* Commented out, unsure if needed
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
*/

//ROUTER
/*
require('./routes/apiRoutes')(app);
require('./routes/htmlRoutes')(app);
*/
app.get(`/`, (req, res)=>{
    res.sendFile(`${__dirname}/index.html`)
   // console.log(req.ip);
});
/*****************************/



//Listener 
// The below code effectively "starts" our server
const server = app.listen(PORT, () => console.log(`App listening on PORT: ${PORT}, Visit http://localhost:3000/ `));
// io needs to take in an http.Server instance as a param. app.listen returns this for us
const io = require(`socket.io`)(server);
//try on client side or look into socket ids to tell which device is connecting
//let ipAdress = ip.address();
//${ipAdress}:${PORT}


/**********TO DEBUG**********
  Paste localStorage.debug = '*'; into broswer console
  look into making it a script on the server https://stackoverflow.com/questions/27751646/how-do-i-set-node-env-and-debug
 ***************************/
   io.on('connection',  (socket) => {
    console.log(` Frantz connected`);
    socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message', msg);
        console.log('message: ' + msg);
      });
    socket.on(`disconnect`, ()=>{
        console.log(`Frantz disconected`);
    });
     });
     
     