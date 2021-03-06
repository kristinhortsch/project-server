const express = require('express');
const app = express();
const morgan = require('morgan');
const auth = require('./routes/auth');
const jwt = require('./jwt');
const twitchResults = require('./routes/twitch');
//enhanced logging
app.use(morgan('dev'));

//serve public directory as static files
app.use(express.static('public'));

//register the json "middleware" body parser
app.use(express.json());

// eslint-disable-next-line no-unused-vars
function checkAuth(req, res, next) {
  const token = req.get('Authorization');
  if(!token) {
    res.status(401).json({ error: 'no authorization found' });
    return;
  }
  
  let payload = null;
  try {
    payload = jwt.verify(token);
  }
  catch (err) {
    res.status(401).json({ error: 'invalid token' });
    return;
  }
  req.userId = payload.id;
  next();
}

//register our routes
app.use('/api/auth', auth);

//add routes here:
app.use('/api/twitch', twitchResults);

// const client = require('./db-client');

// app.get('/api', (req, res) => {
//   client.query(`
//     SELECT * from profile;
//   `)
//     .then(result => res.json(result.rows));
// });


module.exports = app;