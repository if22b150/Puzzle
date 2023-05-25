var express = require('express');
var cors = require('cors');

var app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

// POST route for login
app.post('/login', (req, res, next) => {
  const loginData = req.body;
  console.log(JSON.stringify(loginData));

  // login...

  res.status(200).json({
    message: 'Hello login from express.js'
  })
})

/*
app.use((req, res, next) => {
  console.log('Middleware');
  next();
})

app.use((req, res) => {
  res.end('Middleware finished');
})

app.get('/', (req, res) => {
  console.log('Hello');
  res.send('GET req to...');
})

app.post('/', (req, res) => {
  console.log('Hello');
  res.send('POST req to...');
})
*/

module.exports = app;
