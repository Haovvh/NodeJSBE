const express = require('express');
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
    //mở kết nối khi frontend gọi socket.emit('calldriver')
    socket.on("calldriver", async (data) => {
      console.log(data);
      const conn = await MySql();      
      //query 5 tài xế gần nhất
      //Lỗi chọn xe bất kỳ không ra
      var carsat = "";
      if(data.Car_seat) {
        carsat = ' AND Car_seat = ? ';
      }
      console.log(carsat + "001")
      let driver1km = await conn.query(`SELECT Driver_ID FROM online_driver WHERE Status = 'Online' ${carsat} AND (POWER((LNG - ?),2) + POWER((LAT- ?),2) > 0 ) LIMIT 5`, [data.Car_seat,  data.origin.origin_lng, data.origin.origin_lat]);
      //ghi xem có thông tin driver không?
      console.log(driver1km[0]);
      //nếu không có tìm trong bán kính 5km
      let driver5km = await conn.query(`SELECT Driver_ID FROM online_driver WHERE Car_seat = ? AND Status = 'Online' AND (POWER((LNG - ?),2) + POWER((LAT- ?),2) > 0 ) LIMIT 5`, [data.Car_seat,  data.origin.origin_lng, data.origin.origin_lat]);
      conn.end();
      //broadcat toàn bộ driver
      socket.broadcast.emit("broadcat", { 
        //thông tin user, origin, destinaton ...
        user: data,
        drivers: driver1km[0],
        room: data.room
        //2h3X8Qv6x4jJhSJTAAKv
      });
    });
    //successjourney
    socket.on("successjourney", async (data) => {
      console.log(data);
      socket.to(data.room).emit("successpassenger", {
            Status: data.Status
      })
    })

    socket.on("join_room", (data) => {
      console.log(data)
      socket.join(data.room);
      console.log(`User with ID: ${socket.id} joined room: ${data.room}`);
    });
  


    socket.on("driveracceptjourney", async (data) => {
      console.log(data)
      socket.to(data.room).emit("driverinfo", {
            Fullname: data.Fullname,
            Phone: data.Phone,
            Driver_ID: data.Driver_ID,
            Car_type: data.Car_type,
            Car_code: data.Car_code,
            Car_seat: data.Car_seat,
            Car_color: data.Car_color
      })
        
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
app.use('/api', require("./Routes/onlinedriver.routes"));

httpServer.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
    console.log(`http://localhost:${process.env.PORT}`);
  });


