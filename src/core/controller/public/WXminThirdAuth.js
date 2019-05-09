const ThirdAccreditAuth=require('./ThirdAccreditAuth');
const WXSDK = require('../../Util/WXSDK');
const request = require('request');
const LOG = require('iot-cloud-core').LOG;
const WXBizDataCrypt = require('./WXBizDataCrypt')
class WXMinAuth extends ThirdAccreditAuth{
	constructor(params){
		super()
		this.WXSDK = new WXSDK(params);
	}

	async auth(code){
		let Info=await this.WXSDK.getInfo();
		let reqUrl = 'https://api.weixin.qq.com/sns/jscode2session?';
	  	let params = {
	    	appid: Info.wxAppId,
	    	secret: Info.wxSecret,
	    	code: code,
	  	};
	  	let options = {
	    	method: 'get',
	    	url: reqUrl+"appid="+params.appid+"&secret="+params.secret+"&js_code="+params.code+"&grant_type=snsapi_userinfo"
	  	};
		return new Promise((resolve, reject) => {
	    	request(options, function (err, res, body) {
		      	if (res) {
		        	resolve(body);
		      	} else {
		        	reject(err);
		      	}
	    	})
    	})
	}

	async getUserInfo(info,sessionKey){
		var appId = 'wxd9b547737fc66093';
		var sessionKey = sessionKey;
		var encryptedData = info.encryptedData;
		var iv = info.iv;
		var pc = new WXBizDataCrypt(appId, sessionKey)
		var userinfo = pc.decryptData(encryptedData , iv)
		return userinfo;
	}

	
	async login(info){
		let msg=await this.auth(info.code);
		msg=JSON.parse(msg);
		let sessionKey=msg.session_key;
		let openid=msg.openid;
		let infomsg =JSON.parse(info.info);
		let userinfo=await this.getUserInfo(infomsg,sessionKey);
		let unionid=userinfo.unionId;
		let usermsg={
			id:unionid,
			userinfo:{
				unionid:unionid,
				openid:userinfo.openId,
				nickname:userinfo.nickName,
				headimgurl:userinfo.avatarUrl
			},
		}
		return usermsg;
	}
}
module.exports = WXMinAuth;