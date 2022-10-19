
const express = require('express');


const path = require('path');
const cors = require('cors')
require('dotenv').config();

const app = express();
const httpServer  = require('http').createServer(app);
//const options = { /* ... */ };

const io = require("socket.io")(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
      }
});
  
  io.on("connection", socket => {
    // ...
  });
// Middleware
app.use(cors());
app.use( express.json() );
app.use( express.urlencoded({ extended: false }) );
//


// Routes
app.use('/api', require("./Routes/user.routes"));
app.use('/api', require("./Routes/auth.routes"));
app.use('/api', require("./Routes/product.routes"));
app.use('/api', require("./Routes/category.routes"));

// This folder will be Public
//app.use( express.static( path.join( __dirname, 'Uploads/Profile') ));
//app.use( express.static( path.join( __dirname, 'Uploads/Home' )));
//app.use( express.static( path.join( __dirname, 'Uploads/Products' )));
//app.use( express.static( path.join( __dirname, 'Uploads/Categories' )));

httpServer.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
    console.log(`http://localhost:${process.env.PORT}`);
  });


