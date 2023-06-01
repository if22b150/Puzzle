let userId = 1;
class User {
  constructor(username, password) {
    this.id = userId++;
    this.username = username;
    this.password = password;
  }

  createToken() {
    this.token = Math.random().toString(36).slice(2);
    return this.token;
  }
}
let highscoreId = 1;
class Highscore {
  constructor(user, score) {
    this.id = highscoreId++;
    this.user = user;
    this.score = score;
  }
}

class Database {
  _users;
  _accessTokens;
  _highscores;

  constructor() {
    this._users = [];
    this._accessTokens = [];
    this._highscores = [];
  }

  getUserByUsername(username) {
    return this._users.find(u => u.username === username);
  }
  getUserByToken(token) {
    let accessToken = this._accessTokens.find(t => t.token === token);
    return this._users.find(u => u.id === accessToken.id);
  }

  addUser(username, password) {
    if(this.getUserByUsername(username))
      return false;

    let user = new User(username, password)
    this._users.push(user);
    return user;
  }

  deleteUser(user) {
    this._users = this._users.filter(u => u.id !== user.id);
    this._accessTokens = this._accessTokens.filter(t => t.id !== user.id);
  }

  login(user) {
    let token = user.createToken();
    this._accessTokens.push({id: user.id, token: token});
  }

  addHighscore(user, score) {
    let highscore = new Highscore(user, score);
    this._highscores.push(highscore);
    return highscore;
  }
}


const express = require('express');
const cors = require('cors');

const app = express();

let db = new Database();

app.use(cors());

app.use(express.json());

function authMiddleware(req, res, next) {
  console.log(req.headers.authorization);

  if(!req.headers.authorization)
    res.status(401).json({
      message: 'Not authenticated'
    })
  else {
    let user = db.getUserByToken(req.headers.authorization);
    if(!user)
      res.status(401).json({
        message: 'Not authenticated'
      })
    else
      next();
  }
}

// POST route for signup
app.post('/users', (req,res) => {
  let data = req.body;
  let addedUser = db.addUser(data.username, data.password);
  if(!addedUser)
    res.status(422).json({
      message: 'User already exists'
    })
  else
    res.status(201).json(addedUser)
})

// POST route for login
app.post('/login', (req, res, next) => {
  const data = req.body;

  let user = db.getUserByUsername(data.username);
  if(!user)
    res.status(404).json({
      message: 'User not found'
    })

  if(user.password !== data.password)
    res.status(401).json({
      message: 'Wrong credentials'
    })

  db.login(user);

  console.log(db._users);
  console.log(db._accessTokens);

  res.status(201).json(user)
})

app.post('/highscores', authMiddleware, (req, res) => {
  let user = db.getUserByToken(req.headers.authorization);

  const data = req.body;
  let highscore = db.addHighscore(user, data.score);

  console.log(db._highscores);
  res.status(201).json(highscore);
})
app.get('/highscores', authMiddleware, (req, res) => {
  res.status(200).json(db._highscores.sort((a, b) => {
    return b.score - a.score;
  }));
})

app.delete('/sessions', authMiddleware, (req, res) => {
  let user = db.getUserByToken(req.headers.authorization);
  db.deleteUser(user);

  console.log(db._users);
  console.log(db._accessTokens);

  res.status(204).json({})
})

module.exports = app;



