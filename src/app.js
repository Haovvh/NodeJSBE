const express = require('express');
const path = require('path');
const cors = require('cors')
require('dotenv').config();
const MySql = require('./DB/MySql');
const app = express();

const httpServer  = require('http').createServer(app);

//cấu hình socket
const io = require("socket.io")(httpServer, {
    cors: {
      //nhận toàn bộ host client
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
      }
});
  //mở kết nối
  io.on("connection", (socket) => {
    
    socket.on("calldriver", async (data) => {
      console.log("vao socket")
      console.log(socket.id)
      
      const conn = await MySql();
      //query 5 tài xế gần nhất
      let driver = await conn.query(`SELECT Driver_ID FROM callcenterdb.online_driver WHERE (POWER((LNG - ?),2) + POWER((LAT- ?),2) > 0 ) LIMIT 5`, [  data.origin.origin_lng, data.origin.origin_lat]);
      //ghi xem có thông tin driver không?
      console.log(driver[0]);
      //broadcat toàn bộ driver
      socket.broadcast.emit("broadcat", { 
        //thông tin user, origin, destinaton ...
        user: data,
        drivers: driver[0],
        socket_ID: socket.id
        //2h3X8Qv6x4jJhSJTAAKv
      });
    });
    socket.on("driveracceptjourney", async (data) => {
      console.log(data);
      io.to(data.socket_ID).emit("passenger", {
        driver_ID: data.driver_ID
      })
        //const conn = await MySql();
        //update
        //await conn.query(`UPDATE online_driver SET LNG = ? , LAT = ? WHERE Driver_ID = ? `, [ data.LNG, data.LAT ,data.id ])
        // delete and insert
        //await conn.query(`DELETE FROM online_driver WHERE Driver_ID = ? `,[parseInt(data.id)]);
        //await conn.query(`INSERT INTO online_driver (Driver_ID, LNG, LAT) Values ( ? , ? , ? ) `, [parseInt(data.id), parseFloat(data.LNG), parseFloat(data.LAT)]);
    })
    
    //socket update 5s của driver
    socket.on("update_lat_lng", async (data) => {
      console.log(data);
        const conn = await MySql();
        //update
        //await conn.query(`UPDATE online_driver SET LNG = ? , LAT = ? WHERE Driver_ID = ? `, [ data.LNG, data.LAT ,data.id ])
        // delete and insert
        await conn.query(`DELETE FROM online_driver WHERE Driver_ID = ? `,[parseInt(data.id)]);
        await conn.query(`INSERT INTO online_driver (Driver_ID, LNG, LAT) Values ( ? , ? , ? ) `, [parseInt(data.id), parseFloat(data.LNG), parseFloat(data.LAT)]);
    })
    
  });
  
// Middleware
app.use( cors() );
app.use( express.json() );
app.use( express.urlencoded({ extended: false }) );
//


// Routes
app.use('/api', require("./Routes/user.routes"));
app.use('/api', require("./Routes/userbyphone.routes"));
app.use('/api', require("./Routes/driver.routes"));
app.use('/api', require("./Routes/login.routes"));
app.use('/api', require("./Routes/journey.routes"));
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


