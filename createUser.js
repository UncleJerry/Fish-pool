var pg = require('pg');
var hash = require('./hash');



var newUser = function(username, password){
  const hashedData = hash.hashItAll(password);

  // Config of PostgreSQL
  var client = new pg.Client({
    //user: '',
    //database: '',
    //password: '',
    //host: '',
    //port:
  });

  // connect to our database
  client.connect(function (err, client, done) {
    if (err) throw err;

    // execute a query on our database
    client.query('INSERT account (uname, hashpass, salt) VALUES ($1, $2, $3); SELECT uid FROM account WHERE username = $4;', [username, hashedData.hashpass, hashedData.salt, username], function (err, result) {
      if (err) throw err;
      done(err);

      return result.rows[0].uid;
      // disconnect the client
      client.end(function (err) {
        if (err) throw err;
      });
    });

  });

}





export.newUser = newUser;
