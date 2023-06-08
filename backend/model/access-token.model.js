const mongoose = require('mongoose');

const accessTokenSchema = new mongoose.Schema({
  token: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});
const AccessToken = mongoose.model('AccessToken', accessTokenSchema);

function createToken() {
  this.token = Math.random().toString(36).slice(2);
  return this.token;
}

module.exports = {
  AccessToken: AccessToken,
  createToken: createToken
};
