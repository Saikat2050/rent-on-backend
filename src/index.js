const express = require('express')
require('dotenv').config()
const router = require('./routes') 
require('./util/db')
const message = require('./util/message.json')
const port = process.env.PORT || 4001
const app = express()

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use(router)

app.use('*', (req, res) => {
    res.status(404).json({Status: "Error", Message: message.NOTFOUND});
  });

app.listen(port);