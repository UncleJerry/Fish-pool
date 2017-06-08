var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
const https = require('https');
const fs = require('fs');
const hash = require('./hash');
const query = require('./query');
const create = require('./createUser');
const MatchUser = require('./matchObject').MatchUser;
const deleteData = require('./delete');


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

  query.login(username, function(err, result){

    if (!err) {

      if (result.rows[0] == undefined) {
        // if the user isn't exist return false
        res.sendStatus(401);
      }else{
        const hashpass = hash.hashWithSalt(password, result.rows[0].salt);
        if (hashpass.localeCompare(result.rows[0].hashpass) == 0) {
          req.session.user = result.rows[0].uid;// To mark the user id to further action.
          query.downloadProfile(req.session.user, function(err, result){
            console.log('Alive0');
            if(!err){
              console.log('Alive1');
              console.log(result.rows[0]);
              res.json(result.rows[0]);
            }
          });
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

  query.queryUName(username, function(err, result){
    if (!err){
      if(result.rows[0].count == '0'){
        create.newUser(username, password, function(err, result){
          if (!err) {
            req.session.user = result.rows[0].uid;
            res.json({
              status: 'success'
            })
          }else{
            console.log(err);
            res.sendStatus(500);
          }
        });
      }else{
        res.json({
          status: 'exist'
        })
      }
    }
  });
  
  
  
});

app.post('/signup/userinfo', function(req, res){
  const firstname = req.body['first'];
  const lastname = req.body['last'];
  const gender = req.body['gender'];

  var isFemale = false;

  if(gender == 'female'){
    isFemale = true;
  }

  create.addUserInfo(req.session.user, firstname, lastname, isFemale,function(err, result){
    if (!err) {
      res.sendStatus(200);
    }else{
      console.log(err);
      res.sendStatus(401);
    }
  });
});



app.post('/signup/match', function(req, res){
  // Get the latitude and longitude from request.
  const targetEmail = req.body['target'];
  
  query.queryName(targetEmail, function(err, result){
      if(!err && result != undefined){
        const matchedUID = result.rows[0].uid
        matchQueue.push(new MatchUser(req.session.user, matchedUID));
        res.json({
            status: 'matched',
            uid: matchedUID,
            firstname: result.rows[0].firstname,
            lastname: result.rows[0].lastname,
            isFemale: result.rows[0].female
        });
      }else{
        res.json({
          status:'no'
        })
      }

  });
  
});


app.post('/signup/match_check', function(req, res){
  const matchid = req.body['match'];

  const item = matchQueue.find(function(element){
    return element.uid == matchid;
  });
  if (item != undefined) {
    if(item.matchid == req.session.user){
      res.json({
        status: 'success'
      });
    }else{
      res.json({
        status: 'failed'
      });
    }
  }else{
    res.json({
        status: 'failed'
    });
  }
  

});

app.post('/signup/match_complete', function(req, res){
  const matchedUID = req.body['matched'];
  const date = req.body['date'];
        
  create.addMatch(req.session.user, matchedUID, date, function(err, result){
    if (!err) {
      res.json({
        status: 'Success'
      })
    }else{
      console.log(err);
      res.sendStatus(500);
    }
  });
});



app.get('/Get_Notification', function(req, res){
  
  query.queryNotification(req.session.user, function(err, result){
    if(!err){
      
      if (result.rows[0] == undefined) {
        // if the user isn't exist return false

        res.json(null);
      }else{
        res.json(result.rows);
      }
    }
  });
});

app.post('/Add_Notification', function(req, res){
  
  const detail = req.body['detail'];
  const repeat = req.body['repeat'];
  const year = req.body['year'];
  const month = req.body['month'];
  const day = req.body['day'];
  const hour = req.body['hour'];
  const minute = req.body['minute'];
  const week = req.body['week'];

  create.addNotification(req.session.user, detail, hour, minute, repeat, function(err, result){
    if(!err){
      
      if (result.rows[0] == undefined) {
        // error
      }else{

        console.log('Alive1');
        const nid = result.rows[0].notifyid;

        if(repeat == '1'){
          res.json({
            status: 'success',
            notifyid: nid
          });
        }
        create.updateNotification(req.session.user, nid, repeat, day, week, month, year, function(err, result){
          console.log('Alive2');
          res.json({
            status: 'success',
            notifyid: nid
          });
        });
      }
    }else{
      console.log(err);
    }
  });
});



app.post('/Delete_Notification', function(req, res){
  const notifyid = req.body['notifyid'];

  deleteData.deleteNotification(notifyid, req.session.user);
});

app.post('/Add_device', function(req, res){
  
  const deviceid = req.body['deviceid'];

  create.addDevice(req.session.user, deviceid, function(err, result){
    res.sendStatus(200);
  });
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

app.get('/logout', function(req, res){
  req.session.destroy();
  res.json({
    status: 'Success'
  })
});


var secureServer = https.createServer({
    key: fs.readFileSync('../sslkey/privkey.pem'),
    cert: fs.readFileSync('../sslkey/cert.pem')
}, app);

secureServer.listen(3223, function(){
  console.log('Established the https server at port 3223');
});
