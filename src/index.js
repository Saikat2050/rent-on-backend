const express = require('express')
require('dotenv').config()
const cors = require('cors')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const compression = require('compression')
const router = require('./routes') 
require('./util/db')
const message = require('./util/message.json')
const cron = require('node-cron');
const Cronjob = require('./jobs/CronJobs')
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


//cron job
cron.schedule('0 0 0 * * *', () => {
    console.log('running a task every every day');
    Cronjob();
  });


app.listen(port);