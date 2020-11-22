const path = require('path')
const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');


const app = express()


const basePath = path.join(__dirname, '../public/')
app.use(express.static(basePath))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());


module.exports = app;