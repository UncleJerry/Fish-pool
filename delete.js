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
 * Delete the notification identified by notifyid and uid (author)
 * uid is for security
 * @param {String} notifyid 
 * @param {String} uid 
 * @param {*} callback 
 */
function deleteNotification(notifyid, uid, callback) {
  
  var pool = new pg.Pool(config);
  pool.connect(function(err, client, done){
    

    client.query('DELETE FROM notification WHERE author = $1 AND notifyid = $2', [uid, notifyid], function(err, result){
      done(err);
      
      if(err) {
        
      }
      
      client.end(function (err) {
        if (err) throw err;
      });
    });
  })
}

exports.deleteNotification = deleteNotification;