const mongoose = require("mongoose");

// define the mongodb connection url
const mongourl = 'mongodb://localhost:27017/hotels';



// setup mongodb connections

mongoose.connect(mongourl,{
    // useNewUrlParser: true,
    useUnifiedTopology:true
})


//get the deafault connection
// mongoose maintains a  deafult connection object representing the mongodb connections
const db = mongoose.connection;

// define event listeners for database connection
db.on('connected', () => {
    console.log('connected to mongodb server');
});

db.on('error', (err) => {
    console.log('mongodb connected error',err);
});

db.on('disconnected', () => {
    console.log('mongodb disconnected');
});

// export the database connection
module.exports = db;
