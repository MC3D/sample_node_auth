const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const parseurl = require('parseurl');
const app = express();

const credentials = [
  {
    username: 'faith',
    password: 'puppy'
  }, {
    username: 'dan',
    password: 'ogdennash'
  }, {
    username: 'mady',
    password: 'joey'
  }
];

app.engine('mustache', expressHandlebars()); // Register the mustache template engine
app.set('view engine', 'mustache'); // Set mustache as the engine to use for our views
app.set('views', './views'); // Tell express where the view files are located

app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'joey', resave: false, saveUnitialized: true})); // see comments below
app.use((req, res, next) => {
  var pathname = parseurl(req).pathname;
  console.log('pathname', pathname);
  !req.session.user && pathname != '/login'
    ? res.redirect('login')
    : next();
});

app.get('/', function(req, res) {
  res.send(`Thank you for logging in, ${req.session.user.username[0].toUpperCase()}${req.session.user.username.substr(1)}!`);
});

app.get('/login', function(req, res) {
  res.render('login', {});
});

app.post('/login', function(req, res) {
  let username = req.body.username;
  let password = req.body.password;

  let user = credentials.find(function(user) {
    return user.username == username;
  });

  user && user.password == password
    ? req.session.user = user
    : undefined;

  req.session.user
    ? res.redirect('/')
    : res.redirect('login');
});

app.listen(3000);

// 'secret' is the secret used to sign the session ID cookie
// 'resave' forces the session to be saved back to the session store;
// 'saveUnitialized' forces a session that is "uninitialized" to be saved to the store; a session is uninitialized when it is new but not modified
// app.use(session({secret: 'puppies', resave: false, saveUnitialized: true}));
