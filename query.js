var pg = require('pg');

var config = {
  user: '',
  database: '',
  password: '', 
  port: 5432, 
  max: 10, 
  idleTimeoutMillis: 1000
};


/**
 * query the user's hashed password and salt, then return for callback in object result
 * using the node-postgres as the PostgreSQL client
 * More detail on: https://github.com/brianc/node-postgres
 * @function
 * @param {string} username - username to be queryed
 * @param {string} callback - callback
 */
function login(username, callback) {

  var pool = new pg.Pool(config);
  pool.connect(function(err, client, done){
    if(err) {
      return callback(err, null);
    }

    client.query('SELECT hashpass, salt, uid FROM Account WHERE uname = $1', [username], function(err, result){
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
/**
 * Used for Signin and geting the basic infomation
 * @param {String} uid 
 * @param {*} callback 
 */
function downloadProfile(uid, callback){
  var pool = new pg.Pool(config);
  pool.connect(function(err, client, done){
    if(err) {
      return callback(err, null);
    }

    client.query('SELECT u.firstname, u.lastname, u.female, u.theday, u2.firstname AS MFName, u2.lastname AS MLName, u2.female AS MFemale FROM userinfo as u JOIN userinfo as u2 ON u.matchid = u2.uid WHERE u.uid = $1;', [uid], function(err, result){
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

/**
 * Query username and return its name and gender
 * @param {String} uname 
 * @param {*} callback 
 */
function queryName(uname, callback){
  var pool = new pg.Pool(config);
  pool.connect(function(err, client, done){
    if(err) {
      return callback(err, null);
    }

    client.query('SELECT u.uid, u.firstname, u.lastname, u.female FROM account as a JOIN userinfo as u ON u.uid = a.uid WHERE a.uname = $1;', [uname], function(err, result){
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
/**
 * Return the user id to send back to session or other use
 * @param {String} username 
 * @param {*} callback 
 */
function queryUIDwithUname(username, callback){
  var pool = new pg.Pool(config);
  pool.connect(function(err, client, done){
    if(err) {
      return callback(err, null);
    }

    client.query('SELECT uid FROM userinfo WHERE uname = $1;', [username], function(err, result){
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
/**
 * To query all notifications created by this user.
 * @param {String} uid 
 * @param {*} callback 
 */
function queryNotification(uid, callback){
  var pool = new pg.Pool(config);
  pool.connect(function(err, client, done){
    if(err) {
      return callback(err, null);
    }

    client.query('SELECT notifyid, detail, repeatmodel, month, day, hour, minute, week FROM notification WHERE author = $1;', [uid], function(err, result){
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
/**
 * To query the match record of this user
 * @param {Number} uid 
 * @param {*} callback 
 */
function queryMatch(uid, callback){
  var pool = new pg.Pool(config);
  pool.connect(function(err, client, done){
    if(err) {
      return callback(err, null);
    }

    client.query('SELECT matchid FROM userinfo WHERE uid = $1;', [uid], function(err, result){
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
/**
 * To Check if there exist the user name
 * @param {string} uname 
 * @param {*} callback 
 */
function queryUName(uname, callback){
  var pool = new pg.Pool(config);
  pool.connect(function(err, client, done){
    if(err) {
      return callback(err, null);
    }

    client.query('SELECT COUNT(*) FROM account WHERE uname = $1;', [uname], function(err, result){
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

exports.login = login;
exports.queryName = queryName;
exports.queryUIDwithUname = queryUIDwithUname;
exports.queryNotification = queryNotification;
exports.queryMatch = queryMatch;
exports.downloadProfile = downloadProfile;
exports.queryUName = queryUName;