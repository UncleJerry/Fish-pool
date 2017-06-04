var pg = require('pg');


const config = {
  user: 'fishproj',
  database: 'FishProject',
  password: '9NG3k37cyaX3', 
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
function queryInfo(username, callback) {

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

function queryName(uid, callback){
  var pool = new pg.Pool(config);
  pool.connect(function(err, client, done){
    if(err) {
      return callback(err, null);
    }

    client.query('SELECT uid, ifirstname, lastname FROM userinfo WHERE uid = $1;', [username], function(err, result){
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

exports.queryInfo = queryInfo;
exports.queryName = queryName;
exports.queryUIDwithUname = queryUIDwithUname;