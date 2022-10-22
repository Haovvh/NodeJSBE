const express = require('express');
const path = require('path');
const cors = require('cors')
require('dotenv').config();
const MySql = require('./DB/MySql');
const app = express();

const httpServer  = require('http').createServer(app);

const io = require("socket.io")(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
      }
});
  let n =1;
  io.on("connection", (socket) => {
    // ...
    
    socket.on("send_message", (data) => {
      console.log(data);
      
    });
    socket.broadcast.emit("broadcat", { some: `broadcat toàn server ${n++}` });
    console.log("success")
    //const conn =  MySql();
     //conn.query(`DELETE FROM online_driver WHERE Driver_ID = 3`)
     //conn.query(`insert into online_driver (Driver_ID, lng, lat, status_ID)
    //values (3, 10.123, 105.234, 3)`);
    //conn.end();
  });
// Middleware
app.use( cors() );
app.use( express.json() );
app.use( express.urlencoded({ extended: false }) );
//


// Routes
app.use('/api', require("./Routes/user.routes"));
app.use('/api', require("./Routes/auth.routes"));
//app.use('/api', require("./Routes/product.routes"));
//app.use('/api', require("./Routes/category.routes"));

// This folder will be Public
//app.use( express.static( path.join( __dirname, 'Uploads/Profile') ));
//app.use( express.static( path.join( __dirname, 'Uploads/Home' )));
//app.use( express.static( path.join( __dirname, 'Uploads/Products' )));
//app.use( express.static( path.join( __dirname, 'Uploads/Categories' )));

httpServer.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
    console.log(`http://localhost:${process.env.PORT}`);
  });


