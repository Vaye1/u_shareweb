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
class UserController extends ControllerBase{
	afterInit(){
		this.auth={};
		this.auth.ThirdsAuth=new ThirdsAuth({config:this.getConfig(),error:this.error});
	}
	
	/** 注册接口
	 * 	注册接口
	 * 	@returns
	 * 	{
		 	utoken : "xxxxxxxxxxxx"
		}
	*/
	@NoAuth
	async regAction(data){
		this.checkKeyExists(data.params,'username','password');
		let userInfo = await this.dao.get('user').findUserByUsername({
			username:data.params.username
		})
		if (userInfo) {
			template.error.call(this,'userIsReg');
		}
		let user = {
			username:data.params.username,
			nickname:data.params.nickname?data.params.nickname:'',
			mobile:data.params.mobile?data.params.mobile:"",
			password:data.params.password,
			head:data.params.head?data.params.head:'',
			info:{},
			salt:Math.random().toString(36).substr(2, 6)
		};
		let ua = UAformater.setUA(data.header['user-agent']).getResult();
		user.info.mobiletype=ua.os.name?ua.os.name:'null';
		user.info.version=ua.os.version?ua.os.version:'null';
		user.info.useragent=ua?ua:'null';
		user.mobile=data.params.mobile?data.params.mobile:'';
		user.info.clienId=data.params.ClientID?data.params.ClientID:'';
		userInfo = await this.dao.get('user').createSimpleUser(user);
		return {
			utoken:data.auth.sign(Calculation.signParams(userInfo.id))
		}
	}

	/** 登陆接口
	 * 	登陆接口
	 * 	@returns
	 * 	{
		 	utoken : "xxxxxxxxxxxx"
		}
	*/
	@NoAuth
	async loginAction(data){
		this.checkKeyExists(data.params,'username','password');
		let userInfo = await this.dao.get('user').findUserByUsername({
			username:data.params.username
		})
		if (!userInfo) {
			template.error.call(this,'usernameOrPasswordWrong');
		}
		if(userInfo.password!=data.params.password){
			template.error.call(this,'usernameOrPasswordWrong');
		}
		await this.dao.get('user').updateUserLoginTimeForid({
			user_id:userInfo.id,
			loginTime:moment().format('YYYY-MM-DD HH:mm:ss')
		})
		return {
			utoken:data.auth.sign(Calculation.signParams(userInfo.id))
		}
	}

	/** 自动登录
	 * 	自动登录
	 * 	@returns
	 * 	{
		 	utoken : "xxxxxxxxxxxx"
		}
	*/
	async autoLoginAction(data){
		await this.dao.get('user').updateUserLoginTimeForid({
			user_id:data.user.uid,
			loginTime:moment().format('YYYY-MM-DD HH:mm:ss')
		})
		return {
			utoken:data.auth.sign(Calculation.signParams(data.params.uid))
		}
	}

	@NoAuth
	async thirdLoginAction(data){
		if (data.params.type=="wx") {
			this.checkKeyExists(data.params,'identityId','ucode');
			//根据code获取的第三方用户信息
			let ThirdUserID=data.params.ucode;
			//根据第三方用户表的id查询第三方用户表
			let ThirdUserMsg=await this.dao.get('user').findThirdUserById({id:ThirdUserID});
			if (ThirdUserMsg && ThirdUserMsg.type=="wx") {
				//根据飞燕的identityId查询用户表
				let UserMsg=await this.dao.get('user').findUserByUsername({username:data.params.identityId});
				//判断用户表是否存在这条记录
				if (!UserMsg) {
					let user = {
						username:data.params.identityId,
						nickname:'',
						mobile:data.params.mobile?data.params.mobile:"",
						pwd:'',
						head:'',
						info:{},
						salt:Math.random().toString(36).substr(2, 6)
					};
					let ua = UAformater.setUA(data.header['user-agent']).getResult();
					user.info.mobiletype=ua.os.name?ua.os.name:'null';
					user.info.version=ua.os.version?ua.os.version:'null';
					user.info.useragent=ua?ua:'null';
					user.mobile=data.params.mobile;
					user.info.clienId=data.params.ClientID?data.params.ClientID:'';
					UserMsg = await this.dao.get('user').createSimpleUser(user);
				}
				if(ThirdUserMsg.user_id){
					if(ThirdUserMsg.user_id==UserMsg.id){
						await this.dao.get('user').updateUserLoginTimeForid({
							user_id:UserMsg.id,
							loginTime:moment().format('YYYY-MM-DD HH:mm:ss')
						})
						//输出结果
						return {
							utoken:data.auth.sign(Calculation.signParams(UserMsg.id))
						}
					}else{
						//报错：第三方账号已经绑定其他账号
						this.error("第三方账号已经绑定其他账号",70100);
					}
				}else{
					//第三方用户绑定用户表
					await this.dao.get('user').updateThirdUserById({user_id:UserMsg.id,id:ThirdUserID})
					await this.dao.get('user').updateUserLoginTimeForid({
						user_id:UserMsg.id,
						loginTime:moment().format('YYYY-MM-DD HH:mm:ss')
					})
					//输出结果
					return {
						utoken:data.auth.sign(Calculation.signParams(UserMsg.id))
					}
				}
			}else{
				//报错：第三方账号不存在或类型不正确
				this.error("第三方账号不存在或和登陆类型不同",70101);
			}
		}else if(!data.params.type||data.params.type=="fy"){
			this.checkKeyExists(data.params,'identityId','mobile');
			//根据传参的的identityID查询第三方用户表
			let ThirdUserMsg=await this.dao.get('user').findOauthUserByUsernameAndType({username:data.params.identityId,type:"fy"});
			if (!ThirdUserMsg) {
				ThirdUserMsg=await this.dao.get('user').createThirdUsers({
					user_id:data.user_id,
					username:data.params.identityId,
					type:"fy",
					info:{},
					state: data.params.state?data.params.state:1
				})
			}
			//根据飞燕的identityId查询用户表
			let UserMsg=await this.dao.get('user').findUserByUsername({username:data.params.identityId});
			//判断用户表是否存在这条记录
			if (!UserMsg) {
				let user = {
					username:data.params.identityId,
					nickname:'',
					mobile:data.params.mobile?data.params.mobile:"",
					pwd:'',
					head:'',
					info:{},
					salt:Math.random().toString(36).substr(2, 6)
				};
				let ua = UAformater.setUA(data.header['user-agent']).getResult();
				user.info.mobiletype=ua.os.name?ua.os.name:'null';
				user.info.version=ua.os.version?ua.os.version:'null';
				user.info.useragent=ua?ua:'null';
				user.mobile=data.params.mobile;
				user.info.clienId=data.params.ClientID?data.params.ClientID:'';
				UserMsg = await this.dao.get('user').createSimpleUser(user);
			}
			if(ThirdUserMsg.user_id){
				if(ThirdUserMsg.user_id==UserMsg.id){
					await this.dao.get('user').updateUserLoginTimeForid({
						user_id:UserMsg.id,
						loginTime:moment().format('YYYY-MM-DD HH:mm:ss')
					})
					//输出结果
					return {
						utoken:data.auth.sign(Calculation.signParams(UserMsg.id))
					}
				}else{
					//报错：第三方账号已经绑定其他账号
					this.error("第三方账号已经绑定其他账号",70100);
				}
			}else{
				//第三方用户绑定用户表
				await this.dao.get('user').updateThirdUserById({user_id:UserMsg.id,id:ThirdUserMsg.id})
				await this.dao.get('user').updateUserLoginTimeForid({
					user_id:UserMsg.id,
					loginTime:moment().format('YYYY-MM-DD HH:mm:ss')
				})
				//输出结果
				return {
					utoken:data.auth.sign(Calculation.signParams(UserMsg.id))
				}
			}
		}
	}

	/** 清除用户数据,cid登出
	 * 清除用户数据,cid登出 http://116.62.143.3:10080/iot-v2/iot-cloud-app/issues/1
	 * @returns
	 * {
		 success : 1
		}
	*/
	async logoutAction(data){
		let update={
			user_id:data.user.uid,
			key:['clienId']
		};
		let res = await this.public.core.logout(update);
		//注销当前token
		let deleteTokenData = {
			appId:data.auth._appId,
			uid:data.user.uid,
			token:data.header.authorization.substring(4),
		};
		let deleteRes = await ServiceManager.execute('JWTToken','deleteToken',deleteTokenData);
		if (res) {
			return {success:1}
		}
		return {msg:'update failed'}
	}

	@NoAuth
	async thirdAuthorizeAction(data){
		if (data.params.type=="wx_app") {
			//调用微信接口获取微信信息
			let userParams=await this.auth.ThirdsAuth.thirdLogin("wx_app",data.params.code);
			if (userParams.errcode) {
				this.error(userParams.errmsg,userParams.errcode)
			}
			// //判断参数是否存在user_id
			// if (data.params.user_id) {
			//     //查询第三方用户表
			//     let ThirdUserInfo=await this.dao.get('user').findThirdUserByUsernameType({username:userParams.id,type:"wx"});
			//     //第三方用户表没有记录增加记录
			//     if (!ThirdUserInfo) {
			//         userParams.userinfo["weChat_push"]=1;
			//         ThirdUserInfo=await this.dao.get('user').createThirdUsers({
			//             user_id:data.params.user_id,
			//             username:userParams.id,
			//             type:"wx",
			//             info:userParams.userinfo,
			//         })
			//     //第三方用户表有记录并且user为空
			//     }else if (!ThirdUserInfo.user_id) {
			//         await this.dao.get('user').updateThirdUserById({id:ThirdUserInfo.id,user_id:data.params.user_id})
			//     //第三方用户表有记录并且user和传参相同
			//     }else if (ThirdUserInfo.user_id==data.params.user_id) {
			//     //第三方用户表有记录并且user和传参不同
			//     }else{
			//       this.error("第三方用户已绑定其他用户",40012);
			//     }
			//     //根据第三方用户id和类型为WX_APP查询微信信息表如果没有创建一条记录
			//     await this.dao.get('wx').findOrCreateWXByThirduserId({
			//         thirduser_id:ThirdUserInfo.id,
			//         username:userParams.userinfo.openid,
			//         type:"wx_app",
			//         info:userParams.userinfo
			//     })
			//     return {ucode:ThirdUserInfo.id};
			// }else{
				//查询第三方用户表
				let ThirdUserInfo=await this.dao.get('user').findThirdUserByUsernameType({username:userParams.id,type:"wx"});
				//第三方用户表没有记录增加记录
				if (!ThirdUserInfo) {
					userParams.userinfo["weChat_push"]=1;
					ThirdUserInfo=await this.dao.get('user').createThirdUsers({
						user_id:null,
						username:userParams.id,
						type:"wx",
						info:userParams.userinfo,
					})
				}
				//根据第三方用户id和类型为WX_APP查询微信信息表如果没有创建一条记录
				await this.dao.get('wx').findOrCreateWXByThirduserId({
					thirduser_id:ThirdUserInfo.id,
					username:userParams.userinfo.openid,
					type:"wx_mp",
					info:userParams.userinfo
				})
				return {ucode:ThirdUserInfo.id};
			// }
		}
		this.error("授权类型不存在",40101);
	}

	async authorizeWeChatAction(data){
		if (data.params.type=="wx_app") {
			//调用微信接口获取微信信息
			let userParams=await this.auth.ThirdsAuth.thirdLogin("wx_app",data.params.code);
			if (userParams.errcode) {
			  this.error(userParams.errmsg,userParams.errcode)
			}
			//查询第三方用户表
			let ThirdUserInfo=await this.dao.get('user').findThirdUserByUsernameType({username:userParams.id,type:"wx"});
			//第三方用户表没有记录增加记录
			if (!ThirdUserInfo) {
				userParams.userinfo["weChat_push"]=1;
				ThirdUserInfo=await this.dao.get('user').createThirdUsers({
					user_id:data.user.uid,
					username:userParams.id,
					type:"wx",
					info:userParams.userinfo,
				})
			//第三方用户表有记录并且user为空
			}else if (!ThirdUserInfo.user_id) {
				await this.dao.get('user').updateThirdUserById({id:ThirdUserInfo.id,user_id:data.user.uid})
			//第三方用户表有记录并且user和传参相同
			}else if (ThirdUserInfo.user_id==data.user.uid) {
				//第三方用户表有记录并且user和传参不同
			}else{
			  this.error("第三方用户已绑定其他用户",40012);
			}
			//根据第三方用户id和类型为WX_APP查询微信信息表如果没有创建一条记录
			await this.dao.get('wx').findOrCreateWXByThirduserId({
				thirduser_id:ThirdUserInfo.id,
				username:userParams.userinfo.openid,
				type:"wx_app",
				info:userParams.userinfo
			})
			return {success:1};
		}
		this.error("授权类型不存在",40101);
	}

	/** 获取用户详情
	 * 获取用户详情 
	 * @returns
	*/
	async getUserAction(data){
		let UserMsg = await this.public.core.searchById({uid:data.user.uid});
		if (!UserMsg) {
			template.error.call(this,'userNotFound');
		}
		let user_info={};
		let user_set={};
		let auth_Info={
			wx_app:0,
			wx_mp:0
		};
		let ThirdUsersInfo=await this.dao.get('user').findThirdUserByUserId({
			user_id:data.user.uid
		})
		for (let i = 0; i < ThirdUsersInfo.length; i++) {
			let ThirdUserInfo=ThirdUsersInfo[i];
			if(ThirdUserInfo.type=="wx"){
				ThirdUserInfo.info=JSON.parse(ThirdUserInfo.info);
				if (ThirdUserInfo) {
					let WXInfo=await this.public.core.findWXMsgByThirdId({
						thirduser_id:ThirdUserInfo.id
					})
					for (let i = 0; i < WXInfo.length; i++) {
						auth_Info[WXInfo[i].type]=WXInfo[i].state
					}
				}
				let weChat_push=typeof(ThirdUserInfo.info.weChat_push)=="number"?ThirdUserInfo.info.weChat_push:Number(ThirdUserInfo.info.weChat_push);
				user_set=ThirdUserInfo.info.weChat_push?{weChat_push:weChat_push}:{weChat_push:0};
			}else if(ThirdUserInfo.type=="tmallGenie"){
				let tmallGenie_push=ThirdUserInfo.info?JSON.parse(ThirdUserInfo.info).tmallGenie_push:0;
				user_set.tmallGenie=typeof(tmallGenie_push)=="number"?tmallGenie_push:Number(tmallGenie_push);
				auth_Info[ThirdUserInfo.type]=typeof(ThirdUserInfo.state)=="number"?ThirdUserInfo.state:Number(ThirdUserInfo.state);
			}else{
				auth_Info[ThirdUserInfo.type]=typeof(ThirdUserInfo.state)=="number"?ThirdUserInfo.state:Number(ThirdUserInfo.state);
			}
		}
		user_info.mobile=UserMsg.mobile?UserMsg.mobile:"";
		user_set.tmallGenie=user_set.tmallGenie?user_set.tmallGenie:0;
		let res={
			user_id:data.user.uid,
			user_name:UserMsg.username,
			user_info:user_info,
			user_set:user_set,
			auth_Info:auth_Info
		}
		return res;
	}

	/** 用户设置修改
	 * 用户设置修改
	 * @returns
		 {
			 code: 0,
			data: {
				success:1
			}
			}
	*/
	async setUserAction(data){
		this.checkKeyExists(data.params, 'setting_key', 'setting_value');

		let UserMsg = await this.public.core.searchById({uid:data.user.uid});
		if (!UserMsg) {
			template.error.call(this,'userNotFound');
		}
		let res;
		let ThirdUserMsg;
		let info=UserMsg.info;
		switch(data.params.setting_key) {
			case 'TmallGenie':
				ThirdUserMsg = await this.dao.get('user').findThirdUserByUserIdType({user_id:data.user.uid,type:"TmallGenie"});
				if (ThirdUserMsg) {
					if (data.params.setting_value==1) {
						res = await ServiceManager.execute('TmallGenieService', 'acceptOauthRegister', {fyid:UserMsg.username});
					}else if(data.params.setting_value==0){
						res = await ServiceManager.execute('TmallGenieService', 'cancelOauthRegister', {fyid:UserMsg.username});
					}
					if(res){
						info.setting=info.setting?info.setting:{};
						info.setting.tmallGenie_push=data.params.setting_value;
						res=await this.dao.get('user').updateThirdUserInfo({
							third_user_id:ThirdUserMsg.id,
							info:{
								tmallGenie_push:data.params.setting_value
							}
						})
						if (res) {return  {success:1}}
					}else{
						template.error.call(this,'setpropError');
					}
				}else{
					template.error.call(this,'thirdUserNotFound');
				}
				break;
			case 'weChat_push':
				ThirdUserMsg = await this.dao.get('user').findThirdUserByUserIdType({user_id:data.user.uid,type:"wx"});
				if (ThirdUserMsg) {
					info.setting=info.setting?info.setting:{};
					info.setting.weChat_push=data.params.setting_value;
					res=await this.dao.get('user').updateThirdUserInfo({
						third_user_id:ThirdUserMsg.id,
						info:{
							weChat_push:data.params.setting_value
						}
					})
					if (res) {return {success:1}}
				}else{
					template.error.call(this,'thirdUserNotFound');
				}
				// info.setting=info.setting?info.setting:{};
				// info.setting[data.params.setting_key]=data.params.setting_value;
				// res=await this.public.core.updateUserForid({user_id:data.user.uid,info:info})
				// if (res) {
				// 	 return  {success:1}
				// }
				break;
			default:
				info.setting=info.setting?info.setting:{};
				info.setting[data.params.setting_key]=data.params.setting_value;
				res=await this.public.core.updateUserForid({user_id:UserMsg.id,info:info})
				if (res) {
					return  {success:1}
				}
		}
		template.error.call(this,'setpropError');
	}

	@NoAuth
	async getAccessTokenAction(data){
		if (data.params.client_id==config.appKey.appKey && data.params.client_secret==config.appKey.appSecret) {
			//key和iv

			// let key = CryptoJS.enc.Utf8.parse(config.CryptoJS_AES.key);
			// let iv = CryptoJS.enc.Utf8.parse(config.CryptoJS_AES.iv);
			// let refresh_key = CryptoJS.enc.Utf8.parse(config.CryptoJS_AES.refresh_key);
			// let refresh_iv = CryptoJS.enc.Utf8.parse(config.CryptoJS_AES.refresh_iv);
			if (data.params.grant_type=="authorization_code") {
			let ThirdUserID=data.params.code;
			let str = ThirdUserID;
			//加密出AccessToken
			let access_token=PwdCrypto.aesEncrypt(str,config.CryptoJS_AES.key);
			//加密出refresh_token
			let refresh_token=PwdCrypto.aesEncrypt(str,config.CryptoJS_AES.refresh_key);
			return{
				sourceData:true,
				data:{
					access_token:access_token,
					expires_in:86400,
					refresh_token:refresh_token,
					openid:ThirdUserID,
					result_code:0
				}
			}
			}else if (data.params.grant_type=="refresh_token") {
				let ThirdUserID=PwdCrypto.aesDecipher(data.params.refresh_token,config.CryptoJS_AES.refresh_key);
				// 转换为 utf8 字符串
				ThirdUserID = CryptoJS.enc.Utf8.stringify(ThirdUserID);
				let str = ThirdUserID;
				//加密出AccessToken
				let access_token=PwdCrypto.aesEncrypt(str,config.CryptoJS_AES.key);
				//加密出refresh_token
				let refresh_token=PwdCrypto.aesEncrypt(str,config.CryptoJS_AES.refresh_key);
				return{
					sourceData:true,
					data:{
						access_token:access_token,
						expires_in:86400,
						refresh_token:refresh_token,
						result_code:0
					}
				}
			}else{
				this.error("类型不正确",110000);
			}
		}else{
			this.error("appKey或appSecret无效",110000);
		}
	}
  
	@NoAuth
	async userinfoAction(data){
		let encrypted = data.params.access_token;
		//key和iv
		let key = CryptoJS.enc.Utf8.parse(config.CryptoJS_AES.key);
		let iv = CryptoJS.enc.Utf8.parse(config.CryptoJS_AES.iv);
		// 解密
		let ThirdUserID = CryptoJS.AES.decrypt(encrypted, key, {
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		
		// 转换为 utf8 字符串
		ThirdUserID = CryptoJS.enc.Utf8.stringify(ThirdUserID);
		let ThirdUserMsg=await this.public.core.findThirdUserById({id:ThirdUserID});
		if (!ThirdUserMsg) {
			this.error("没有找到用户",110000);
		}
		return{
			sourceData:true,
			data:{
			result_code: 0,
			message: "成功",
			openid:ThirdUserID,
			nick_name: ThirdUserMsg.username,
			gender: 0
			}
		}
	}
}

module.exports = UserController;