
const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.use('/api', require("./Routes/auth.routes"));
app.use('/api', require("./Routes/user.routes"));

app.use('/api', require("./Routes/driver.routes"));
app.use('/api', require("./Routes/journey.routes"));

// This folder will be Public
app.use(express.static(path.join(__dirname, 'Uploads/Profile')));
app.use(express.static(path.join(__dirname, 'Uploads/Home')));
app.use(express.static(path.join(__dirname, 'Uploads/Products')));
app.use(express.static(path.join(__dirname, 'Uploads/Categories')));


module.exports = app;
