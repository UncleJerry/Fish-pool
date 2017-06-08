var pg = require('pg');
var hash = require('./hash');

var config = {
  user: '',
  database: '',
  password: '', 
  port: 5432, 
  max: 10, 
  idleTimeoutMillis: 1000
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

function addUserInfo(uid, firstname, lastname, isFemale, callback) {

  var pool = new pg.Pool(config);
  pool.connect(function(err, client, done){
    if(err) {
      return callback(err, null);
    }

    client.query('INSERT INTO userinfo (uid, firstname, lastname, female) VALUES ($1, $2, $3, $4);', [uid, firstname, lastname, isFemale], function(err, result){
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

function addMatch(uid, matchid, theday, callback) {
  
  var pool = new pg.Pool(config);
  pool.connect(function(err, client, done){
    if(err) {
      return callback(err, null);
    }

    client.query('UPDATE userinfo SET matchid = $1, theday = $2 WHERE uid = $3;', [matchid, theday, uid], function(err, result){
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

function addNotification(uid, detail, hour, minute, repeat, callback) {
  
  var pool = new pg.Pool(config);
  pool.connect(function(err, client, done){
    if(err) {
      return callback(err, null);
    }

    client.query('INSERT INTO notification (author, target, detail, hour, minute, repeatmodel) VALUES ($1, (SELECT matchid FROM userinfo WHERE uid = $2), $3, $4, $5, $6) RETURNING notifyid;', [uid, uid, detail, hour, minute, repeat], function(err, result){
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

function updateNotification(uid, notifyid, repeat, day, week, month, year, callback) {
  
  var pool = new pg.Pool(config);
  pool.connect(function(err, client, done){
    if(err) {
      return callback(err, null);
    }

    if(repeat == '0'){
      client.query('UPDATE notification SET year = $1, month = $2, day = $3 WHERE notifyid = $4 AND author = $5;', [year, month, day, notifyid, uid], function(err, result){
        done(err);
      
        if(err) {
          return callback(err, null);
        }

        return callback(null, result);
      
        client.end(function (err) {
          if (err) throw err;
        });
      });

    }else if(repeat == '2'){
      client.query('UPDATE notification SET week = $1 WHERE notifyid = $2 AND author = $3;', [week, notifyid, uid], function(err, result){
        done(err);
      
        if(err) {
          return callback(err, null);
        }

        return callback(null, result);
      
        client.end(function (err) {
          if (err) throw err;
        });
      });
    }else if(repeat == '3'){
      client.query('UPDATE notification SET day = $1 WHERE notifyid = $2 AND author = $3;', [day, notifyid, uid], function(err, result){
        done(err);
      
        if(err) {
          return callback(err, null);
        }

        return callback(null, result);
      
        client.end(function (err) {
          if (err) throw err;
        });
      });
    }else if(repeat == '4'){
      client.query('UPDATE notification SET month = $1, day = $2 WHERE notifyid = $3 AND author = $4;', [month, day, notifyid, uid], function(err, result){
        done(err);
      
        if(err) {
          return callback(err, null);
        }

        return callback(null, result);
      
        client.end(function (err) {
          if (err) throw err;
        });
      });
    }
    
  })
}

function addDevice(uid, deviceid, callback) {
  
  var pool = new pg.Pool(config);
  pool.connect(function(err, client, done){
    if(err) {
      return callback(err, null);
    }

    client.query('INSERT INTO device (deviceid, uid) VALUES ($1, $2)', [deviceid, uid], function(err, result){
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
exports.addMatch = addMatch;
exports.addNotification = addNotification;
exports.updateNotification = updateNotification;
exports.addDevice = addDevice;