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
class ShareDeviceController extends ControllerBase{
	afterInit(){
		
	}

	/** 创建分享用户
	 * 	创建分享用户
	 * 	@returns
	 *  {
			autoCode:"xxxxxxxxxxxxx"
		}
	*/
	async createShareUserAction(data){
		this.checkKeyExists(data.params, 'device_id', 'mobile', 'qrKey');
		
		//验证设备是否存在
		let device = await this.public.core.findDeviceById({id:data.params.device_id});
		if(!device){
			template.error.call(this,'deviceNotFound');
		}
		//验证是否是管理员
		if(!await this.public.core.checkRole({ user_id: data.user.uid, device_id: data.params.device_id }, "admin")) {
			template.error.call(this,'auth');
		}
		let DeviceUserList = await this.public.core.findDeviceUserAndMoblieNameByDeviceId({device_id:data.params.device_id,status:1});
		for (let i = 0; i < DeviceUserList.length; i++) {
			if (DeviceUserList[i]["user.mobile"]==data.params.mobile) {
				template.error.call(this,'shareUserIsBind');
			}
		}
		let ShareUser=await this.dao.get('shareuser').findShareUserByDeviceIdAndNumber({
			device_id:data.params.device_id,
			phoneNumber:data.params.mobile
		})
		//判断是否已有相同的记录
		if (ShareUser) {
			if (ShareUser.shareuser_id) {
				template.error.call(this,'shareUserIsBind');
			}else{
				let codemsg={qrKey:data.params.qrKey,mobile:data.params.mobile,device_id:data.params.device_id};
				let autoCode=PwdCrypto.aesEncrypt(JSON.stringify(codemsg),config.shareUser_AES_key);
				if (!ShareUser.info) {
					ShareUser.info={}
				}
				if (typeof(ShareUser.info)==="string") {
					ShareUser.info=JSON.parse(ShareUser.info);
				}
				ShareUser.info["autoCode"]=autoCode;
				try{
					await this.dao.get('shareuser').updateShareUserById({
						id: ShareUser.id,
						info:ShareUser.info
					})
					autoCode=PwdCrypto.aesEncrypt(String(ShareUser.id),config.shareUser_AES_key);
					autoCode=autoCode.slice(0,autoCode.length-2);
					return {autoCode:autoCode};
				}catch(err){
					console.log(err);
					template.error.call(this,'sqlerror');
				}
			}
		}else{
			let codemsg={qrKey:data.params.qrKey,mobile:data.params.mobile,device_id:data.params.device_id};
			let autoCode=PwdCrypto.aesEncrypt(JSON.stringify(codemsg),config.shareUser_AES_key);
			let DeviceUser = await this.dao.get('shareuser').findShareUserByDeviceId({device_id: data.params.device_id})
			if(DeviceUser.length>20){
				template.error.call(this,'shareUserIsMore');
			}
			for (let j = 0; j < DeviceUser.length; j++) {
				if(DeviceUser[j].mobile==data.params.mobile){
					template.error.call(this,'shareUserIsBind');
				}
			}
			let res=await this.dao.get('shareuser').createShareUser({
				user_id: data.user.uid,
				device_id: data.params.device_id,
				phoneNumber: data.params.mobile,
				info:{
					autoCode:autoCode
				}
			})
			autoCode=PwdCrypto.aesEncrypt(String(res.id),config.shareUser_AES_key);
			autoCode=autoCode.slice(0,autoCode.length-2);
			return {autoCode:autoCode};
		}
	}

	/** 获取设备分享信息
	 * 获取设备分享信息
	 * @returns
	   	{
		   	qrKey:"xxxxxxxxxxxxx",
		   	phoneNumber:"xxxxxxxxxxxxx",
		   	device_id:xx
	   	}
	*/
	async getQrkeyAction(data){
		this.checkKeyExists(data.params, 'autoCode');

		let autoCode,codemsg;
		try{
			data.params.autoCode=data.params.autoCode+"==";
			let ShareUser_id=PwdCrypto.aesDecipher(data.params.autoCode,config.shareUser_AES_key);
			let ShareUserInfo=await this.dao.get('shareuser').findShareUserById({id:ShareUser_id})
			autoCode=JSON.parse(ShareUserInfo.info).autoCode;
		}catch(err){
			template.error.call(this,'AESDecryptIsNot');
		}
		try{
			codemsg=PwdCrypto.aesDecipher(autoCode,config.shareUser_AES_key);
			codemsg=JSON.parse(codemsg);
		}catch(err){
			template.error.call(this,'AESDecryptIsNot');
		}
		this.checkKeyExists(codemsg, 'qrKey','mobile','device_id');
		//验证设备是否存在
		let device = await this.public.core.findDeviceById({id:codemsg.device_id});
		if(!device){
			template.error.call(this,'deviceNotFound');
		}
		let UserMsg = await this.public.core.searchById({uid:data.user.uid});
		if (!UserMsg) {
			template.error.call(this,'userNotFound');
		}
		if (UserMsg.mobile!=codemsg.mobile) {
			template.error.call(this,'phoneNumberUnlike');
		}
		return codemsg;
	}

	/** 删除分享用户
	 *  删除分享用户
	 *  @returns
	   	{
		   	success:1
	   	}
	*/
	async deleteShareUserAction(data){
		this.checkKeyExists(data.params, 'device_id');

		//验证是否是管理员
		if(!await this.public.core.checkRole({ user_id: data.user.uid, device_id: data.params.device_id }, "admin")) {
			template.error.call(this,'auth');
		}
		if (data.params.share_id) {
			try{
				let ShareUserInfo=await this.dao.get('shareuser').findShareUserById({id:data.params.share_id})
				if (ShareUserInfo && ShareUserInfo.shareuser_id) {
					await this.public.core.delBindByDeviceIdAndUserId({device_id:data.params.device_id,user_id:ShareUserInfo.shareuser_id});
				}
				await this.dao.get('shareuser').delShareUserById({id:data.params.share_id})
			}catch(err){
				template.error.call(this,'sqlerror');
			}
		}else if (data.params.user_id) {
			try{
				// if(data.user.uid==data.params.user_id){
				// 	template.error.call(this,'delShareUserError');
				// }
				await this.public.core.delBindByDeviceIdAndUserId({device_id:data.params.device_id,user_id:data.params.user_id});
				await this.dao.get('shareuser').delShareUserByShareuserId({device_id:data.params.device_id,shareuser_id:data.params.user_id});
			}catch(err){
				template.error.call(this,'sqlerror');
			}
		}else{
			template.error.call(this,'paramsNull');
		}
		return {success:1};
	}

	/** 绑定设备
	 * 	绑定设备
	 * 	@returns
	 *  
	*/
	async bindAction(data){
		if(data.params.role=="SA"){
			this.checkKeyExists(data.params, 'productKey', 'deviceName');
			//获得需要绑定的设备
			let device = await this.public.core.findDeviceByPkAndName({product_key:data.params.productKey,device_name:data.params.deviceName});
			if(!device[0]){
				template.error.call(this,'deviceNotFound');
			}
			device = device[0];
			if(!device){
				template.error.call(this,'deviceNotFound');
			}
			//验证是否是管理员
			if(await this.public.core.checkRole({ user_id: data.user.uid, device_id: device.id }, "admin")) {
				template.error.call(this,'userAlreadyBound');
			}
			await this.public.core.delBindByDeviceId({device_id:device.id});
			await this.dao.get('lock').expireInviteByDeviceId({device_id:device.id});
			await this.public.data.delHistory({device_id:device.id});
			await this.public.core.delSetMsgByDeviceId({device_id:device.id});
			await this.dao.get('virtualuser').delVirtualUserByDevice({device_id:device.id});
			await this.public.core.delShareUserByDeviceId({device_id:device.id});
			let bind = await this.public.core.userBind({user_id:data.user.uid,device_id:device.id,role:'SA'});
			if(bind){
				await this.FYPublic.TriggerService({
					core:this.public.core,
					iotId:device.device_id,
					identifier:"Bind",
					args:{result:1}
				});
				await this.public.core.createSetMsg({
					user_id: data.user.uid,
					device_id: device.id,
					type: "weChat_push",
					value:0,
					state:1,
					info: {}
				});
				//重置推送设置,重置设备昵称
				await this.public.core.setDeviceInfo({id:device.id,info:{nickname:config.defaultDeviceName,options:config.defaultOptions}});
				return {success:1};
			}else{
				template.error.call(this,'sqlerror');
			}
			// let msg = await this.public.core.findDeviceDetailById({device_id:device.id,user_id:data.user.uid});
			// let deviceInfo = msg[0];
			// if(deviceInfo){
			// 	deviceInfo.product_id = Number(deviceInfo.product_id);
			// 	deviceInfo.loginTime = moment(deviceInfo.loginTime).format('YYYY-MM-DD HH:mm:ss');
			// 	deviceInfo.user_role = config.role[deviceInfo.user_role];
			// 	deviceInfo.push_option = JSON.parse(deviceInfo.push_option);
			// }else{
			// 	template.error.call(this,'sqlerror');
			// }
			// return {success:1,deviceInfo:deviceInfo};
		}else{
			this.checkKeyExists(data.params, 'device_id',"autoCode");
			let bindmsg=await this.public.core.findBindInfo({user_id:usermsg.id,device_id:device.id});
			//没有绑定信息
			if (bindmsg==null || bindmsg.status==0) {
				let ShareUserInfo,Share_id;
				try{
					data.params.autoCode=data.params.autoCode+"==";
					Share_id=PwdCrypto.aesDecipher(data.params.autoCode,config.shareUser_AES_key);
					ShareUserInfo=await this.dao.get('shareuser').findShareUserById({id:ShareUser_id})
				}catch(err){
					template.error.call(this,'AESDecryptIsNot');
				}
				let UserMsg = await this.public.core.searchById({uid:data.user.uid});
				if (!UserMsg) {
					template.error.call(this,'userNotFound');
				}
				if (UserMsg.mobile!=ShareUserInfo.phoneNumber) {
					template.error.call(this,'phoneNumberUnlike');
				}
				
				await this.public.core.createSetMsg({
					user_id: data.user.uid,
					device_id: data.params.device_id,
					type: "weChat_push",
					value:0,
					state:1,
					info: {}
				});
				await this.dao.get('shareuser').bindShareUserById({
					id:Share_id,
					shareuser_id:data.user.uid
				})
				//普通用户绑定
				let res=await this.public.core.userBind({user_id:data.user.uid,device_id:data.params.device_id,role:'A'});
				if(res){
					return {success:1};
				}
				template.error.call(this,'bindShareUserError');
			}else{
				return {success:1};
			}
		}
	}
	
	/** 解绑设备
	 * 	解绑设备
	 * 	@returns
	 *  
	*/
	async unbindAction(data){
		let device_id=data.params.device_id;
		let device=await this.dao.get('device').findDeviceById({
			id:device_id
		})
		let user_id=data.user.uid;
		let user=await this.dao.get('user').findUserById({
			uid:user_id
		})
		let fyunbind = await this.FYPublic.unbind({
			core:this.public.core,
			iotId:device.device_id,
			identityId:user.username
		});
		if (fyunbind&&fyunbind.code==200){
			let userRole=await this.dao.get('device').findRoleByUserId({
				user_id:user_id,
				device_id:device_id
			})
			if (userRole=="SA"){
				await this.public.core.delBindByDeviceId({device_id:device_id});
				await this.dao.get('lock').expireInviteByDeviceId({device_id:device_id});
				await this.public.data.delHistory({device_id:device_id});
				await this.public.core.delSetMsgByDeviceId({device_id:device_id});
				await this.dao.get('virtualuser').delVirtualUserByDevice({device_id:device_id});
				let res=await this.public.core.delShareUserByDeviceId({device_id:device_id});
				if(res){
					return {success:1};
				}else{
					template.error.call(this,'UnbindError');
				}
				return {success:1}
			}else if(userRole=="A"){
				await this.dao.get('virtualuser').deleteVirtualUserBindById({device_id:device_id,user_id:user_id});
				await this.public.core.delBindByDeviceIdAndUserId({device_id:device_id,user_id:user_id});
				await this.public.core.delSetMsgByDeviceIdUserId({device_id:device_id,user_id:user_id});
				return {success:1}
			}else{
				return {success:1}
			}
		}else{
			template.error.call(this,'fyUnbindError');
		}
	}

}

module.exports = ShareDeviceController;