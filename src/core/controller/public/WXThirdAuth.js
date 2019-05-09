const ThirdAccreditAuth=require('./ThirdAccreditAuth');
const WXSDK = require('../../Util/WXSDK');
const LOG = require('iot-cloud-core').LOG;
class WXAuth extends ThirdAccreditAuth{
	constructor(params){
		super()
		this.WXSDK = new WXSDK(params);
	}

	async auth(code){
		let token=await this.sdk.auth({code:code});
		return token;
	}

	async getUserInfo(token){
		return await this.sdk.getUserinfo(token);
	}

	
	async login(code){
		let wxParams = {
			code:code,
		}
		let auth=await this.WXSDK.auth(wxParams);
		if (auth.errcode) {
	    	LOG.error(auth)
	        return auth;
	    }
	    let uParams = {
	        access_token:auth.access_token,
	        openid:auth.openid
	    };
	    let userinfo =await this.WXSDK.getUserinfo(uParams);
		let usermsg={
			id:userinfo.unionid,
			userinfo:userinfo,
		}
		return usermsg;
	}

	async getUserMsg(openid){
	    let userinfo =await this.WXSDK.getUserMsg({
	        openid:openid
	    });
	    if (userinfo.errcode) {
	    	LOG.error(Info)
	        return Info;
	    }
		return userinfo;
	}
}
module.exports = WXAuth;