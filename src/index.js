const express = require('express')
require('dotenv').config()
const cors = require('cors')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const compression = require('compression')
const router = require('./routes') 
require('./util/db')
const message = require('./util/message.json')
const port = process.env.PORT || 4001
const app = express()

app.use(helmet())
app.use(cors())
app.use(compression())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use(router)

app.listen(port);