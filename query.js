var pg = require('pg');

/**
 * query the user's hashed password and salt, then return for callback in object result
 * using the node-postgres as the PostgreSQL client
 * More detail on: https://github.com/brianc/node-postgres
 * @function
 * @param {string} username - username to be queryed
 * @param {string} callback - callback
 */
function queryInfo(username, callback) {

  const config = {
    //user: '',
    //database: '',
    //password: '',
    //host: 'localhost',
    //port: 5432,
    //max: 10,
    //idleTimeoutMillis: 1000,
  };

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

exports.queryInfo = queryInfo;
