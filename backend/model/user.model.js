const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  company: String,
  street: String,
  city: String,
  zip: Number
});
const User = mongoose.model('User', userSchema);

module.exports = {
  User: User
};
