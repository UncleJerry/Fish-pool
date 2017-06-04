function MatchUser(uid, latitude, longitude){
    this.uid = Number(uid); // Type to be discussed
    this.latitude = Number(latitude);
    this.longitude = Number(longitude);
}

MatchUser.prototype.isMatched = function (inputUser){
    return abs(inputUser.longitude - this.longitude) <= 0.00001 && abs(inputUser.latitude - this.latitude) <= 0.00001;
}

exports.MatchUser = MatchUser;