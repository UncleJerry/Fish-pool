var express = require('express');
var app = express();
var userAuth = require('./userAuth');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');


app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret: 'keyboard cat', cookie: { maxAge: 2628000000 }, resave: false, saveUninitialized: true}));




app.post('/login.html', function (req, res){
  userAuth.auth(req.body['username'], req.body['password'], function(err, result){
    console.log(result);

    // if the object result return true, then send a response message
    // else redirect with 401
    // to be continued
    if (result) {
      res.send('Seem succeed????');
    }else{
      res.redirect(401, '/');
    }
  });
});



app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function() {
  console.log('Listening on 3000');
});
