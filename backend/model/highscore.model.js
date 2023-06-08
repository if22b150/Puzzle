const mongoose = require('mongoose');

const highscoreSchema = new mongoose.Schema({
  score: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});
const Highscore = mongoose.model('Highscore', highscoreSchema);

module.exports = {
  Highscore: Highscore
};
