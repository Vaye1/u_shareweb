const ThirdAccreditAuth=require('./ThirdAccreditAuth');
const Calculation = require('./Calculation');
const LOG = require('iot-cloud-core').LOG;
const WXSDK = require('../../Util/WXSDK');
const UAformater = require('ua-format-js').UAFormat();
const WXThirdAuth=require('./WXThirdAuth');
const WXminThirdAuth=require('./WXminThirdAuth');
class ThirdsAuth{

	constructor(data){
		this.error=data.error;
		//第三方授权类
		this.thirdmsg= {};
		//第三方授权的的配置（runtime.thirdLoginSupports）
		let supports = data.config.thirdLoginSupports;
		//第三方授权参照表
		let refer={
			"wx":"WXThird",
		}
		for(let i=0;i<supports.length;i++){
			let item = supports[i];
			let type=item.type;
			let config=item.config;
			let prefix = type;
			let thirdauth;
			if(type.split("_").length>0){
				prefix= type.split("_")[0];
				thirdauth=refer[prefix];
			};
			if (type.split("_")[1]=="min") {
				thirdauth="WXminThird";
			};
			let auth =eval(`new ${thirdauth}Auth(item.config)`);
			this.thirdmsg[type] = auth;
		}
	}


	async thirdLogin(type,thirdmsg){
		if (this.thirdmsg[type]) {
			let UserInfo=await this.thirdmsg[type].login(thirdmsg);
			if (UserInfo.errcode) {
				this.error("Third party verification information is invalid",30010)
		    }
		    return UserInfo;
		}else{
			this.error("There is no such third-party authorization",30012)
		}
	}
	
	async getUserMsg(type,thirdmsg){
		if (this.thirdmsg[type]) {
			let UserInfo=await this.thirdmsg[type].getUserMsg(thirdmsg);
			if (UserInfo.errcode) {
				this.error("Third party verification information is invalid",30010)
		    }
		    return UserInfo;
		}else{
			this.error("There is no such third-party authorization",30012)
		}
	}
}

module.exports = ThirdsAuth;