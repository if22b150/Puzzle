const express = require('express');
const cors = require('cors');
const database = require('./database');
const User = require('./model/user.model').User;
const AccessToken = require('./model/access-token.model').AccessToken;
const createToken = require('./model/access-token.model').createToken;
const Highscore = require('./model/highscore.model').Highscore;

const app = express();

app.use(cors());

app.use(express.json());

function authMiddleware(req, res, next) {
  console.log(req.headers.authorization);

  if(!req.headers.authorization)
    res.status(401).json({
      message: 'Not authenticated'
    })
  else {
    AccessToken.findOne({token: req.headers.authorization})
      .then((accessToken) => {
        if (!accessToken)
          res.status(401).json({
            message: 'Not authenticated'
          })
        else {
          console.log('accesstoken: ', accessToken)
          User.findOne({_id: accessToken.user})
            .then((user) => {
              if (!user)
                res.status(401).json({
                  message: 'Not authenticated'
                })
              else {
                req.body.authUser = user;
                next();
              }
            })
            .catch((err) => {
              res.status(500).json({
                message: 'Database error on User.findOne() in authMiddleware'
              });
              console.error(err);
            })
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: 'Database error on AccessToken.findOne() in authMiddleware'
        });
        console.error(err);
      })
  }
}
function signUpRequestMiddleware(req, res, next) {
  let data = req.body;
  if(!data.username || !data.password)
    res.status(422).json({message: 'Username or password missing'});
  else {
    // promise
    User.findOne({username: data.username})
      .then((user) => {
        console.log(user)
        if(user)
          res.status(422).json({
            message: 'User already exists'
          });
        else
          next();
      })
      .catch((err) => {
        res.status(500).json({
          message: 'Database error on User.findOne() in signUpRequestMiddleware'
        });
        console.error(err);
      });
  }
}

// POST route for signup
app.post('/users', signUpRequestMiddleware, (req,res) => {
  let data = req.body;
  let user = new User({
    username: data.username,
    password: data.password,
    company: data.company,
    street: data.street,
    city: data.city,
    zip: data.zip
  });

  user.save()
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Database error on User.save() in signUp request'
      });
      console.error(err)
    });
})

// POST route for login
app.post('/login', (req, res, next) => {
  const data = req.body;

  User.findOne({username: data.username})
    .then((user) => {
      if(!user)
        res.status(404).json({
          message: 'User not found'
        });
      else if (user.password !== data.password)
        res.status(401).json({
          message: 'Wrong credentials'
        })
      else {
        let accessToken = new AccessToken({
          user: user, token: createToken()
        });

        accessToken.save()
          .then((accessToken) => {
            user.token = accessToken.token;
            res.status(200).json({
              id: user._id,
              username: user.username,
              company: user.company,
              city: user.city,
              street: user.street,
              zip: user.zip,
              token: accessToken.token
            });
          })
          .catch((err) => {
            res.status(500).json({
              message: 'Database error on AccessToken.save() in login request'
            });
            console.error(err)
          });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Database error on User.findOne() in login request'
      });
      console.error(err);
    })
})

app.post('/highscores', authMiddleware, (req, res) => {
  let data = req.body;
  let highscore = new Highscore({score: data.score, user: data.authUser})

  highscore.save()
    .then((hs) => {
      res.status(201).json(hs);
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Database error on Highscore.save() in highscores post request'
      });
      console.error(err);
    })
});
app.get('/highscores', authMiddleware, (req, res) => {
  Highscore.find({}).sort({score: -1}).populate('user').exec()
    .then((highscores) => {
      res.status(200).json(highscores)
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Database error on Highscore.find() in highscores get request'
      });
      console.error(err);
    })
})

app.delete('/sessions', authMiddleware, (req, res) => {
  AccessToken.deleteMany({user: req.body.authUser._id})
    .then(() => {
      res.status(204).json({})
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Database error on AccessToken.deleteOne() in sessions delete request'
      });
      console.error(err);
    })
})

module.exports = app;
