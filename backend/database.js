const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mydb', { useNewUrlParser: true });
const database = mongoose.connection;
database.on('error', console.error.bind(console, 'connection error:'));
database.once('open', function() {
  console.log("Connected to MongoDB!")
});

module.exports = database;
