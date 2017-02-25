var hash = require('./hash');
var query = require('./query');

/**
 * query the user's hashed password and salt, then return for callback in object result
 * using the node-postgres as the PostgreSQL client
 * More detail on: https://github.com/brianc/node-postgres
 * @function
 * @param {string} username - username to be queryed
 * @param {string} password - The password of user.
 * @param {string} callback - callback
 */
function auth(username, password, callback){

  query.queryInfo(username, function(err, result){

    if (!err) {
      if (result.rows[0] == undefined) {
        // if the user isn't exist return false
        callback(null, false);
      }else{
        const hashpass = hash.hashWithSalt(password, result.rows[0].salt);
        if (hashpass.localeCompare(result.rows[0].hashpass) == 0) {
          callback(null, true);
        }else{
          // if the hashed password not match, return false
          callback(null, false);
        }
      }

    }else{
      callback(true, null);
    }
  });


};

exports.auth = auth;
