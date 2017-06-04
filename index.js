var express = require('express');
var app = express();
//var cookieParser = require('cookie-parser'); temporary disable
var bodyParser = require('body-parser');
var session = require('express-session');
const https = require('https');
const fs = require('fs');
const hash = require('./hash');
const query = require('./query');
const create = require('./createUser');
const MatchUser = require('./matchObject').MatchUser;

app.use(express.static('public'));
//app.use(cookieParser()); temporary disable
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Set a month life to Session
app.use(session({secret: 'suggest to have a random secret', cookie: {maxAge: 43200000}, resave: true, saveUninitialized: true}));
var matchQueue = [];

/**
 * Login page.
 */
app.post('/login', function (req, res){

  // Get the username and passwd from request.
  const username = req.body['username'];
  const password = req.body['password'];

  query.queryInfo(username, function(err, result){

    if (!err) {

      if (result.rows[0] == undefined) {
        // if the user isn't exist return false
        res.sendStatus(401);
      }else{
        const hashpass = hash.hashWithSalt(password, result.rows[0].salt);
        if (hashpass.localeCompare(result.rows[0].hashpass) == 0) {
          req.session.user = result.rows[0].uid;// To mark the user id to further action.
          res.sendStatus(200);
        }else{
          // if the hashed password not match, return false
          res.sendStatus(401);
        }
      }

    }else{
      res.send('Error in server.');
    }
  });


});

/**
 * Sign up page
 * If the device never login or the session is expired, redirect to the login page
 */
app.post('/signup', function(req, res){
  // Get the username and passwd from request.
  const username = req.body['username'];
  const password = req.body['password'];

  create.newUser(username, password, function(err, result){
    if (!err) {
      req.session.user = result.rows[0].uid;
      res.sendStatus(200);
    }else{
      console.log(err);
      res.sendStatus(401);
    }
  });
  
  
});

app.post('/signup/userinfo', function(req, res){
  const firstname = req.body['first'];
  const lastname = req.body['last'];
  const gender = req.body['gender'];

  create.addUserInfo(req.session.uid, firstname, lastname, ,function(err, result){
    if (!err) {
      req.session.user = result.rows[0].uid;
      res.sendStatus(200);
    }else{
      console.log(err);
      res.sendStatus(401);
    }
  });
});


app.post('/signup/shake', function(req, res){
  // Get the latitude and longitude from request.
  const latitude = req.body['latitude'];
  const longitude = req.body['longitude'];

  matchQueue.push(new MatchUser(req.session.user, latitude, longitude));
});

app.post('/signup/select', function(req, res){
  // Get the latitude and longitude from request.
  const latitude = req.body['latitude'];
  const longitude = req.body['longitude'];

  matchQueue.sort(function(a, b){
    const aSum = pow(a.latitude, 2) + pow(a.longitude, 2);
    const bSum = pow(b.latitude, 2) + pow(b.longitude, 2);
    const compared = pow(latitude, 2) + pow(longitude, 2);

    return abs(compared - aSum) > abs(compared - bSum);
  });
  if (matchQueue.length <= 1){
    res.json({
      status: 'no'
    });
  }else{
    const matchedUID = matchQueue.find(function(element){
      return element.uid != req.session.user;
    }).uid;

    query.matchQueue(matchedUID, function(err, result){
      if(!err){
        if (result.rows[0] == undefined) {
          // if the user isn't exist return false
          res.sendStatus(401);
        }else{

          const resJSON = JSON.stringify(result.rows[0]);
          res.json(resJSON);
        }
      }
    });
    
  }
  
});



app.post('/signup/manual_match', function(req, res){
  const username = req.body['username'];
});

/**
 * Verify the login session.
 * If the device never login or the session is expired, redirect to the login page
 */
app.get('/verify', function (req, res){
  if (req.session && req.session.user) {
    res.sendStatus(200);
  }else{
    res.redirect(401, '/login');
  }
});


var secureServer = https.createServer({
    key: fs.readFileSync('../sslkey/privkey2.pem'),
    cert: fs.readFileSync('../sslkey/cert2.pem')
}, app);

secureServer.listen(3223, function(){
  console.log('Established the https server at port 3223');
});
