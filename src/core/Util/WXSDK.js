const request = require('request');
const crypto = require('crypto');
const ServiceManager = require('iot-cloud-fs');
const url = 'https://api.weixin.qq.com/';
class WXSDK{
	constructor(params) {
        checkKeyExists(params, "appid");
        this.appid = params.appid;
    }

	async auth(params){
		checkKeyExists(params, "code");
		let wxInfo = await this.getInfo();
		if(wxInfo.isComponent){
			return this.authComponent(params,wxInfo);
		}
		return this.send({ url: 'sns/oauth2/access_token?appid=' + wxInfo.wxAppId + '&secret=' + wxInfo.wxSecret + '&code=' + params.code + '&grant_type=authorization_code' });
	}

	authComponent(params,wxInfo){
		checkKeyExists(params, "code");
		return this.send({ url: 'sns/oauth2/component/access_token?appid=' + wxInfo.wxAppId + '&code=' + params.code + '&grant_type=authorization_code&component_appid=' + wxInfo.componentAppId + '&component_access_token=' + wxInfo.componentAccessToken });
	}

    getUserinfo(params) {
        checkKeyExists(params, "openid");
        return this.send({ url: 'sns/userinfo?access_token=' + params.access_token + '&openid=' + params.openid + '&lang=zh_CN' });
    }

    async getUserMsg(params) {
        checkKeyExists(params, "openid");
        let wxInfo = await this.getInfo();
        let res=this.send({ url: 'cgi-bin/user/info?access_token=' + wxInfo.accessToken + '&openid=' + params.openid + '&lang=zh_CN' });
 		return res;
    }

    bindDevice(params){
    	checkKeyExists(params, "openid", "device_id", "ticket");
    	let data = {
            "ticket": params.ticket,
            "device_id": params.device_id,
            "openid": params.openid
        };
    	return this.send({ url: 'device/bind?access_token=' + params.access_token,type:'post',data:data });
    }

    unBind(params){
    	checkKeyExists(params, "openid", "device_id", "ticket");
    	let data = {
            "ticket": params.ticket,
            "device_id": params.device_id,
            "openid": params.openid
        };
    	return this.send({ url: 'device/unbind?access_token=' + params.access_token,type:'post',data:data });
    }

    compelUnbind(params){
    	checkKeyExists(params, "openid", "device_id");
    	let data = {
            "device_id": params.device_id,
            "openid": params.openid
        };
    	return this.send({ url: 'device/compel_unbind?access_token=' + params.access_token,type:'post',data:data });
    }

    async getInfo(){
        let info = await ServiceManager.execute("WXToken","getWXInfo",{
            appId:this.appid
		});
    	return {
            accessToken:info.accessToken,
            jsapiToken:info.jsapiToken,
            isComponent:info.authType !== 1,
            wxAppId:info.wxAppId,
            wxSecret:info.wxSecret,
            componentAppId:info.componentAppId,
            componentAccessToken:info.componentAccessToken
    	};
    }

	send(params) {
        checkKeyExists(params, "url");
		return new Promise((r,j)=>{
			let data;
			let p;
	        if (params.type === 'post') {
	        	p = request.post(url + params.url);
	            if (params, "data") 
	            	p.json(params.data);
	        }else{
	        	p = request.get(url + params.url);
	        }
	        p.on('response', (response) => {
				if (response.statusCode !== 200)
					j(response);
			}).on('data', (data) => {
				r(JSON.parse(data));
			})
			.on('error', (error) => {
				j(error);
			});
		});
    }


	createNonceStr() {
	    return Math.random().toString(36).substr(2, 15);
	};

	createTimestamp() {
	    return parseInt(new Date().getTime() / 1000) + '';
	};

	raw(args) {
		let keys = Object.keys(args);
		keys = keys.sort()
        let newArgs = {};
		keys.forEach(function (key) {
		    newArgs[key.toLowerCase()] = args[key];
		});

        let string = '';
		for (let k in newArgs) {
		    string += '&' + k + '=' + newArgs[k];
		}
		string = string.substr(1);
		return string;
	};

	async getSign(params) {
		checkKeyExists(params, "url");
		let wxInfo = await this.getInfo();
        let ret = {
			jsapi_ticket: wxInfo.jsapiToken,
			nonceStr: this.createNonceStr(),
			timestamp: this.createTimestamp(),
			url: params.url
		};
        let string = this.raw(ret);
        let sha1 = crypto.createHash('sha1');
		sha1.update(string);
		ret.signature = sha1.digest('hex');
		delete ret.jsapi_ticket;
		return ret;
	};

}

function checkKeyExists(map, ...keys) {
	for(let key of keys){
		if (!(key in map))
			throw new ParamsError(key + " is undefined");
	}
}
module.exports = WXSDK;