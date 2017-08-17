const express = require('express');
const mustache = require('mustache-express');
const session = require('express-session');
const bodyparse = require('body-parser');
const server = express();

const users = [{
    username: "chris",
    password: "ingram",
  },
  {
    username: "test",
    password: "123",
  },
];

let cookieClicker = 0;

server.engine('mustache', mustache());
server.set('views', './views');
server.set('view engine', 'mustache');
server.use(bodyparse.urlencoded({
  extended: false
}));

server.listen(6382, function() {
  console.log("Login server is working please don't break it.");
});

server.use(session({
  secret: 'Easter Egg',
  resave: false,
  saveUninitialized: true,
}));

server.get('/', function(req, res) {
  const cookies = cookieClicker;

  res.render('login', {
    cookies: cookieClicker,
  });
});

server.post('/logout', function(req, res) {
  req.session.destroy(function(){
    res.render('login', {
      cookies: cookieClicker,
    });
  });
});
server.post('/gosignup',function(req, res){
  res.render('signup');
})
server.post('/signup', function(req, res){
  const usernameTemp = req.body.username;
  const passwordTemp = req.body.password;
  users.push({
    username: usernameTemp,
    password: passwordTemp,
  });
  res.render('login',{
    cookies: cookieClicker,
  });
});

server.post('/clicked', function(req, res) {
  cookieClicker++;
  res.render('login', {
    cookies: cookieClicker,
  });
});

server.post('/login', function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  let user = null;

  for (let i = 0; i < users.length; i++) {
    if (username === users[i].username &&
      password === users[i].password) {
      user = users[i];
    }
  }
  if (user !== null) {
    req.session.who = user;
    res.redirect('/home');
  } else {
    res.redirect('/');
  }
});

server.get('/home', function(req, res) {
  if (req.session.who !== undefined) {
    res.render('home', {
      username: req.session.who.username,
    });
  } else {
    res.redirect('/');
  }
});
// https://tinyurl.com/z8t4576
