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
class aliGenieController extends ControllerBase{
	afterInit(){
		
	}
	/** 获取天猫精灵授权码
	 * getAliGenieCode 获取天猫精灵授权码
	 * @author wfc
	 * @param {string} platform - 授权注册平台 tmallGenie为天猫精灵
	 * @param {string} type - 必填 "mobile":username取mobile,"account":username和password取参数的值,"random":取随机值
	 * @param {string} username - type为account时传入此参数
	 * @param {string} password - type为account时传入此参数
	 * @returns
		{
			'code': 0,
			'data': {
				'username': 'Oauth_4',
				'password': 'TTJ9Kobb',
			}
		}
	*/
	async getCodeAction(data) {
		this.checkKeyExists(data.params, 'platform', 'type');

		let tmallGenieInfo=await this.dao.get('user').getThirdUserMsg({
			user_id:data.user.uid,
			type:"tmallGenie",
		})
		if(tmallGenieInfo){
			return { username: tmallGenieInfo.username, password:JSON.parse(tmallGenieInfo.info).password }
		}else{
			let username;
			let password = Math.random().toString(10).substring(2,8);
			let userInfo = await this.public.core.searchMobileById({uid:data.user.uid});
			if (data.params.type === 'mobile') {
				username = userInfo.mobile;
			} else if (data.params.type === 'account') {
				this.checkKeyExists(data.params, 'username', 'password');
				username = data.params.username;
				password = data.params.password;
			} else if (data.params.type === 'random') {
				username = Math.random().toString(16).substring(2, 8);
			} else {
				username = Math.random().toString(16).substring(2, 8);
			}
			let res = await this.public.core.createThirdUser({
				user_id: data.user.uid,
				username: username,
				password: password,
				platform: data.params.platform,
			});
			if (res) {
				let msg = {
					appid: data.params.appid?data.params.appid:this.getConfig().appId,
					phone: data.params.type == 'mobile'?username:"",
					fyid:userInfo.username,
					username: username,
					password: password,
					extra: {
						user_id: userInfo.id,
					}
				};
				let tmallGenie = await ServiceManager.execute('TmallGenieService', 'oauthRegister', msg);
				if (tmallGenie.success&&tmallGenie.success==true) {
					return { username: username, password: password }
				}else{
					template.error.call(this,'sqlerror');
				}
			} else {
				template.error.call(this,'sqlerror');
			}
		}
	}

	/** 获取天猫精灵设置信息
	*/
	async getSettingAction(data) {
		let tmallGenieInfo=await this.dao.get('user').getThirdUserMsg({
			user_id:data.user.uid,
			type:"tmallGenie",
		})
		if(tmallGenieInfo){
			tmallGenieInfo.info=JSON.parse(tmallGenieInfo.info);
			let tmallGenie_push=tmallGenieInfo.info.tmallGenie_push?tmallGenieInfo.info.tmallGenie_push:1;
			return {tmallGenie_push:tmallGenie_push}
		}else{
			template.error.call(this,'thirdUserNotFound');
		}
	}

	/** 设置天猫精灵设置信息
	*/
	async setSettingAction(data) {
		this.checkKeyExists(data.params, 'type', 'value');	
		if (data.params.type == 'tmallGenie_push') {
			let userInfo=await this.dao.get('user').findUserById({
				uid:data.user.uid
			})
			let tmallGenieInfo=await this.dao.get('user').getThirdUserMsg({
				user_id:data.user.uid,
				type:"tmallGenie",
			})
			if(tmallGenieInfo){
				if(data.params.value==1){
					let aliGenie = await ServiceManager.execute('TmallGenieService', 'acceptOauthRegister', {fyid:userInfo.username});
					if (aliGenie){
						await this.dao.get('user').updateThirdUserInfo({
							third_user_id:tmallGenieInfo.id,
							info:{
								tmallGenie_push:1
							}
						})
						return {success:1}
					}
				}else if(data.params.value==0){
					let aliGenie = await ServiceManager.execute('TmallGenieService', 'cancelOauthRegister', {fyid:userInfo.username});
					if (aliGenie){
						await this.dao.get('user').updateThirdUserInfo({
							third_user_id:tmallGenieInfo.id,
							info:{
								tmallGenie_push:0
							}
						})
						return {success:1}
					}
				}else{
					template.error.call(this,'setpropNotFound');
				}
			}else{
				template.error.call(this,'thirdUserNotFound');
			}
		} else {
			template.error.call(this,'setpropNotFound');
		}
	}
}

module.exports = aliGenieController;