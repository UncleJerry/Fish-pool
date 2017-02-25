'use strict';
var crypto = require('crypto');

/**
 * Referenct to https://ciphertrick.com/2016/01/18/salt-hash-passwords-using-nodejs-crypto/
 */

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        hashpass:value
    };
};
/**
 * hash password with sha512, after generating a random salt with length 16.
 * return both hashed password and salt.
 * @function
 * @param {string} userpassword - The password of user.
 */
function hashItAll(userpassword) {
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    return sha512(userpassword, salt);
}

/**
 * hash password with salt by sha512, return only the hashed password.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var hashWithSalt = function(password, salt){
  return sha512(password,salt).hashpass;
}

exports.hashItAll = hashItAll;
exports.hashWithSalt = hashWithSalt;
