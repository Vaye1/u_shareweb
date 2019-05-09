const ControllerBase = require('iot-cloud-core').BASE.ControllerBase;
const NoAuth = require('iot-cloud-core').BASE.ControllerDecorator.NoAuth;
const UAformater = require('ua-format-js').UAFormat();
const moment = require('moment');
const crypto = require('crypto');
const Calculation = require('./public/Calculation');
const config = require('./config');
const template = require('./ErrorTemplate');
const ServiceManager = require('iot-cloud-fs');
const WXAuth = require('./public/WXAuth');
const ThirdsAuth = require('./public/ThirdsAuth');
const PwdCrypto = require('../public/PwdCrypto');

/**
 * @class
 */ 
class WXController extends ControllerBase{
	afterInit(){
		
	}
	/** 获取微信设置信息
	*/
	async getSettingAction(data) {
		let WXUsersInfo=await this.dao.get('user').findThirdUserByUserIdType({
			user_id:data.user.uid,
          	type:"wx"
		})
		if(WXUsersInfo){
			let weChat_push =JSON.parse(WXUsersInfo.info).weChat_push?JSON.parse(WXUsersInfo.info).weChat_push:0;
			weChat_push=typeof(weChat_push)=="number"?weChat_push:Number(weChat_push);
			let res={
				weChat_push:weChat_push,
				auth_Info:{
					wx_app:0,
					wx_mp:0
				}
			};
			let WXInfo=await this.public.core.findWXMsgByThirdId({
				thirduser_id:WXUsersInfo.id
			})
			for (let i = 0; i < WXInfo.length; i++) {
				res.auth_Info[WXInfo[i].type]=WXInfo[i].state
			}
			return res;
		}else{
			return {
				weChat_push:0,
				auth_Info:{
					wx_app:0,
					wx_mp:0
				}
			};
		}
	}

	/** 设置微信设置信息
	*/
	async setSettingAction(data) {
		this.checkKeyExists(data.params,'type');
		switch (data.params.type) {
			case "weChat_push":
				let WXUsersInfo=await this.dao.get('user').findThirdUserByUserIdType({
					user_id:data.user.uid,
					type:"wx"
				})
				if(WXUsersInfo){
					let res=await this.dao.get('user').updateThirdUserInfo({
						third_user_id:WXUsersInfo.id,
						info:{
							weChat_push:data.params.value
						}
					})
					if (res) {
						return {success:1}
					}
				}else{
					template.error.call(this,'WXNotAuthor');
				}
				break;
			default:
				template.error.call(this,'setpropNotFound');
				break;
		}
		template.error.call(this,'setpropError');
	}
}

module.exports = WXController;