const mongoose = require('mongoose')

const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/<database>'
mongoose.Promise = global.Promise;
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true})
.then((result)=>{
console.log('connected to db');
})
.catch((err)=>{
console.log(err);
});