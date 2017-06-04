var pg = require('pg');
var hash = require('./hash');

const config = {
    //user: '',
    //database: '',
    //password: '',
    //host: 'localhost',
    //port: 5432,
    //max: 10,
    //idleTimeoutMillis: 1000,
  };

function newUser(username, password, callback) {
  const hashedData = hash.hashItAll(password);

  var pool = new pg.Pool(config);
  pool.connect(function(err, client, done){
    if(err) {
      return callback(err, null);
    }

    client.query('INSERT INTO account (uname, hashpass, salt) VALUES ($1, $2, $3) RETURNING uid;', [username, hashedData.hashpass, hashedData.salt], function(err, result){
      done(err);
      
      if(err) {
        return callback(err, null);
      }
      return callback(null, result);
      client.end(function (err) {
        if (err) throw err;
      });
    });
  })
}

function addUserInfo(uid, firstname, lastname, gender, callback) {
  const hashedData = hash.hashItAll(password);
  var female = false;

  if (gender == 'female'){
    female = true;
  }

  var pool = new pg.Pool(config);
  pool.connect(function(err, client, done){
    if(err) {
      return callback(err, null);
    }

    client.query('INSERT INTO userinfo (uid, firstname, lastname, female) VALUES ($1, $2, $3, $4);', [uid, firstname, firstname, female], function(err, result){
      done(err);
      
      if(err) {
        return callback(err, null);
      }
      return callback(null, result);
      client.end(function (err) {
        if (err) throw err;
      });
    });
  })
}


exports.newUser = newUser;
exports.addUserInfo = addUserInfo;