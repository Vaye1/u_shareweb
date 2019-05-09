const crypto = require('crypto');
class Calculation{
	static signParams(id){
		return {
			uid:id
		}
	}
	
	static getSalt(){
		return Math.random().toString(36).substr(2, 6);
	}

	static generatePassword(password, salt) {
	    var md5 = crypto.createHash('md5');
	    md5.update(password + salt);
	    return md5.digest('hex');
	}
}
module.exports = Calculation;