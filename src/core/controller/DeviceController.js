const ControllerBase = require('iot-cloud-core').BASE.ControllerBase;
const NoAuth = require('iot-cloud-core').BASE.ControllerDecorator.NoAuth;
const ServiceManager = require('iot-cloud-fs');
const PwdCrypto = require('../public/PwdCrypto');
const moment = require('moment');
const config = require('./config');
const template = require('./ErrorTemplate');

class DeviceController extends ControllerBase {
  	afterInit() {
		this.ProductInfo=this.getConfig().ProductInfo;
	}
	
	/** 获取设备详情
	 * 获取设备详情
	 * @param {int} device_id 设备id
	 * @returns
	 *	{
			product_id: 10001,
			product_name: 'XXXXXXX',
			device_id: 1,
			device_name: 'XXXX',
			device_state: 1,
			user_role: 1,
			user_status: 1,
			loginTime: 1234567,
			push_option: {
				open: 1,
				ring: 1,
				alarm: 1,
				hijack: 1,
				TemPwd: 1
			}
		}
	*/
	async getDeviceAction(data){
		this.checkKeyExists(data.params, 'device_id');
		//查询当前设备是否存在
		if(!await this.public.core.findDeviceById({id:data.params.device_id})){
			template.error.call(this,'deviceNotFound');
		}
		//验证是否是管理员或普通用户
		if(!await this.public.core.checkRole({ user_id: data.user.uid, device_id: data.params.device_id }, "admin","normal")) {
			template.error.call(this,'auth');
		}
		//返回设备详细信息
		let device = await this.public.core.findDeviceinfoById({device_id:data.params.device_id,user_id:data.user.uid});
		device = device[0];
		if(device){
			let deviceInfo=JSON.parse(device.deviceInfo);
			delete device.deviceInfo;
			let product={};
			let ProductMsg = await this.public.core.findProductByid({product_id:device.product_id});
			if (!ProductMsg) {
				//报错
				// this.error("没有找到产品信息",50001);
				let info={
					assets:this.ProductInfo.default.url
				}
				product={
					product_id:data.params.product_id,
					product_name:null,
					product_key:null,
					product_info: info
				}
			}else{
				if(ProductMsg.info==null){
					await this.public.core.updateProductInfoById({
						id:ProductMsg.id,
						info:{
							assets:this.ProductInfo[ProductMsg.product_key]&&this.ProductInfo[ProductMsg.product_key].url?this.ProductInfo[ProductMsg.product_key].url:this.ProductInfo.default.url
						}
					})
					ProductMsg.info = {assets:this.ProductInfo[ProductMsg.product_key]&&this.ProductInfo[ProductMsg.product_key].url?this.ProductInfo[ProductMsg.product_key].url:this.ProductInfo.default.url};
				}
				product={
					product_id:ProductMsg.id,
					product_name:ProductMsg.product_name,
					product_key:ProductMsg.product_key,
					product_info: ProductMsg.info? JSON.parse(ProductMsg.info):{}
				}
			}
			let push_option=JSON.parse(device.push_option)
			if (deviceInfo.setting&&deviceInfo.setting.weChat_push) {
				push_option.weChat_push =deviceInfo.setting.weChat_push;
			}else{
				push_option.weChat_push =0;
			}
			device.product=product;
			device.product_id = Number(device.product_id);
			device.loginTime = moment(device.loginTime).format('YYYY-MM-DD HH:mm:ss');
			device.user_role = config.role[device.user_role];
			device.push_option = push_option;
			delete device.product_id; 
			delete device.product_name; 
			return device;
		}else{
			template.error.call(this,'sqlerror');
		}
	}

	/** 获取用户下的设备列表
	 * 获取用户下的设备列表
	 * @returns
	*/
	async getDevicesByUserAction(data){
		let res=[];
		let DevicesList = await this.dao.get('device').findDevicesByUser({
			user_id:data.user.uid
		})
		for (let i = 0; i < DevicesList.length; i++) {
			let device_id=DevicesList[i].device_id;
			let device = await this.public.core.findDeviceinfoById({device_id:device_id,user_id:data.user.uid});
			device = device[0];
			device.product_id = Number(device.product_id);
			device.loginTime = moment(device.loginTime).format('YYYY-MM-DD HH:mm:ss');
			device.user_role = config.role[device.user_role];
			delete device.deviceInfo;
			delete device.push_option;
			res.push(device)
		}
		return res;
	}

	/** 设置设备信息
	 * 设置设备信息
	 * @returns
	*/
	async setDeviceAction(data){
		this.checkKeyExists(data.params, 'device_id', 'type');
		//查询当前设备是否存在
		if(!await this.public.core.findDeviceById({id:data.params.device_id})){
			template.error.call(this,'deviceNotFound');
		}
		//验证是否是管理员
		if(!await this.public.core.checkRole({ user_id: data.user.uid, device_id: data.params.device_id }, "admin")) {
			template.error.call(this,'auth');
		}
		if(data.params.type=="setDeviceName"){
			let res=await this.public.core.setDeviceInfo({id:data.params.device_id,info:{nickname:data.params.value}});
			if (res[0]) {
				return {success:1};
			}
			return {msg:'set failed'}
		}else if(data.params.type=="setPushOption"){
			//APP推送类型
			let APPPush=['open','ring','alarm','hijack','TemPwd'];
			let params={
				id:data.params.device_id
			};
			let deviceInfo=await this.dao.get('device').findDeviceInfo(params)
			deviceInfo.info=deviceInfo.info?deviceInfo.info:{}
			let setkeys=Object.keys(data.params.value);
			for (let i = 0; i < setkeys.length; i++) {
				let setting_key=setkeys[i];
				let setting_value=data.params.value[setkeys[i]];
				if(APPPush.indexOf(setting_key)>=0){
					deviceInfo.info.options=deviceInfo.info.options?deviceInfo.info.options:{}
					deviceInfo.info.options[setting_key]=setting_value;
					params.info=deviceInfo.info;
				}else{
					deviceInfo.info.setting=deviceInfo.info.setting?deviceInfo.info.setting:{}
					deviceInfo.info.setting[setting_key]=setting_value;
					params.info=deviceInfo.info;
				}
			}
			let res=await this.public.core.setDeviceInfo(params);
			if (res[0]) {
				return {success:1};
			}else{
				//重复设置
				template.error.call(this,'setOptionError');
			}
		}else{
			template.error.call(this,'setpropError');
		}
	}

	/** 获取设备下的用户列表
	 * 获取设备下的用户列表
	 * @param {int} device_id 设备id
	 * @returns
		[{
			user_id: 1,
			user_role: 0,
			user_status:1
		}, {
			user_id: 2,
			user_role: 0,
			user_status:1
		}]
	*/
	async getUsersByDeviceAction(data){
		this.checkKeyExists(data.params, 'device_id');
		//查询当前设备是否存在
		if(!await this.public.core.findDeviceById({id:data.params.device_id})){
			template.error.call(this,'deviceNotFound');
		}
		//验证是否是管理员或者普通用户
		if(!await this.public.core.checkRole({ user_id: data.user.uid, device_id: data.params.device_id }, "admin", "normal")) {
			template.error.call(this,'auth');
		}
		let res,UsersInfo;
		let ShareUsersInfo = await this.dao.get('shareuser').findShareUserByDeviceId({device_id:data.params.device_id});
		let ShareUserID = new Map();
		ShareUsersInfo.forEach(item=>{
			ShareUserID.set(item.shareuser_id,item.id);
		});
		switch (data.params.type) {
			case 1:
				//查找用户列表
				UsersInfo = await this.public.core.findDeviceUserAndMoblieNameByDeviceId({device_id:data.params.device_id,status:1});
				UsersInfo.forEach(item => {
					if (item.user_id==data.user.uid) {
						item.isSelf=1
					}else{
						item.isSelf=0
					}
					item.mobile=item['user.mobile'];
					item.identityId=item['user.username'];
					delete item['user.mobile'];
					delete item['user.username'];
					delete item['user.user_status'];
					item.user_role = config.role[item.user_role];
					if (ShareUserID.get(item.user_id)) {
						item.share_id = ShareUserID.get(item.user_id);
					}
				});
				res=UsersInfo;
				return res;
			case 2:
				res=[];
				for (let i = 0; i < ShareUsersInfo.length; i++) {
					if(!ShareUsersInfo[i].shareuser_id){
						let item={
							share_id:ShareUsersInfo[i].id,
							user_role:1,
							user_status:0,
							isSelf:0,
							mobile:ShareUsersInfo[i].phoneNumber
						};
						res.push(item)
					}
				}
				return res;
			default:
				//查找用户列表
				UsersInfo = await this.public.core.findDeviceUserAndMoblieNameByDeviceId({device_id:data.params.device_id,status:1});
				UsersInfo.forEach(item => {
					if (item.user_id==data.user.uid) {
						item.isSelf=1
					}else{
						item.isSelf=0
					}
					item.mobile=item['user.mobile'];
					item.identityId=item['user.username'];
					delete item['user.mobile'];
			 		delete item['user.username'];
					item.user_role = config.role[item.user_role];
					if (ShareUserID.get(item.user_id)) {
						item.share_id = ShareUserID.get(item.user_id);
					}
				});
				let UnbindShareUsers=[];
				for (let i = 0; i < ShareUsersInfo.length; i++) {
					if(!ShareUsersInfo[i].shareuser_id){
						let item={
							share_id:ShareUsersInfo[i].id,
							user_role:1,
							user_status:0,
							isSelf:0,
							mobile:ShareUsersInfo[i].phoneNumber
						};
						UnbindShareUsers.push(item)
					}
				}
				res=UsersInfo.concat(UnbindShareUsers);
				return res;
				break;
		}
	}

  	/** 绑定状态查询 
	 * 绑定状态查询 
	 * @returns
		{
			code: 0,
			data: {
				user_role:1
			}
		}
	*/
	async getBindStateAction(data){
		let device_id;
		if (data.params.iot_id) {
			let device=await this.public.core.findDevice({device_id:data.params.iot_id});
			if (!device) {
				template.error.call(this,'deviceNotFound');
			}
			device_id=device.id;
		}else if (data.params.device_id) {
			device_id=data.params.device_id
		}else{
			template.error.call(this,'paramsNull');
		}
		let bindmsg=await this.public.core.findBindInfo({device_id:device_id,user_id:data.user.uid,status:1});
		if (bindmsg) {
			return {user_role:1}
		}else{
			return {user_role:0}
		}
	}

	/** 获取设备个性化设置
	 * 获取设备个性化设置
	 * @returns
		{
        	"weChat_push": "1",
        	"xxxx": "xxxx"
    	}
	*/
	async getDevicePreInfoAction(data){
		this.checkKeyExists(data.params, 'device_id');

		//验证是否是管理员或普通用户
		if(!await this.public.core.checkRole({ user_id: data.user.uid, device_id: data.params.device_id },"admin","normal")) {
			template.error.call(this,'auth');
		}

		let UserMsg = await this.public.core.searchById({uid:data.user.uid});
		if (!UserMsg) {
			template.error.call(this,'userNotFound');
		}
		let res={};
		let setmsg=await this.dao.get('setting').findSetMsgByUserIdDeviceId({user_id:data.user.uid,device_id:data.params.device_id});
		if (setmsg&&setmsg.length!=0) {
			res.weChat_push=[];
			for (let item of setmsg){
				item.value=item.value.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
				res[item.type]=item.value;
			}
		}
		return res;
	}

	/** 设置设备个性化设置
	 * 设置设备个性化设置  
	 * @returns
		{
        	"weChat_push": "1",
        	"xxxx": "xxxx"
    	}
	*/
	async setDevicePreInfoAction(data){
		this.checkKeyExists(data.params, 'device_id','setting_key', 'setting_value');
		let UserMsg = await this.public.core.searchById({uid:data.user.uid});
		if (!UserMsg) {
			template.error.call(this,'userNotFound');
		}

		//验证是否是管理员或普通用户
		if(!await this.public.core.checkRole({ user_id: data.user.uid, device_id: data.params.device_id }, "admin","normal")) {
			template.error.call(this,'auth');
		}

		let setmsg=await this.dao.get('setting').findSetMsgByUserId({
			device_id: data.params.device_id,
			user_id:data.user.uid,
			type:data.params.setting_key
		})

		if(setmsg){
			setmsg=await this.dao.get('setting').updateSetMsgByDeviceIdUserId({
				device_id: data.params.device_id,
				user_id: data.user.uid,
				type: data.params.setting_key,
				value: data.params.setting_value
			})
		}else{
			setmsg=await this.dao.get('setting').createSetMsg({
				device_id: data.params.device_id,
				user_id: data.user.uid,
				type: data.params.setting_key,
				value: data.params.setting_value,
			})
		}
		if (setmsg){
			return {success:1};
		}else{
			template.error.call(this,'setpropError');
		}
	}
}

module.exports = DeviceController;