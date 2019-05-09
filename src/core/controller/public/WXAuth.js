const ThirdAuth=require('./ThirdAuth');
const Calculation = require('./Calculation');
const LOG = require('iot-cloud-core').LOG;
const WXSDK = require('../../Util/WXSDK');
const UAformater = require('ua-format-js').UAFormat();
class WxAuth extends ThirdAuth{

	constructor(data) {
		super()
		this.WXSDK = new WXSDK({appid:data.appId});
	}

	async wxLogin(data){
		let wxParams = {
			code:data.params.code,
			appid:data.appid
		}
		let auth=await this.WXSDK.auth(wxParams);
		if (auth.errcode) {
	    	LOG.error(auth)
	        return auth;
	    }
	    let uParams = {
	    	appid:data.appid,
	        access_token:auth.access_token,
	        openid:auth.openid
	    };
	    let wxUserInfo =await this.WXSDK.getUserinfo(uParams);
	    let userParams = {
	        username: auth.openid,
	        nickname: wxUserInfo.nickname,
	        head: wxUserInfo.headimgurl,
	        salt:Math.random().toString(36).substr(2, 6)
	    }
	    return userParams;
	}

	async wxAuthorize(data){
		let wxParams = {
			code:data.params.code,
			appid:data.appid
		}
		let auth=await this.WXSDK.auth(wxParams);
		if (auth.errcode) {
	    	LOG.error(auth)
	        return auth;
	    }
	    let uParams = {
	    	appid:data.appid,
	        access_token:auth.access_token,
	        openid:auth.openid
	    };
	    let wxUserInfo =await this.WXSDK.getUserinfo(uParams);
	    let userParams = {
	        username: wxUserInfo.unionid,
	        value: auth.openid,
	        nickname: wxUserInfo.nickname,
	        head: wxUserInfo.headimgurl,
	        salt: Math.random().toString(36).substr(2, 6)
	    }
	    return userParams;
	}
	
}

module.exports = WxAuth;