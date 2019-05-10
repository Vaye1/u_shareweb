/**
* Public.js
* Version: 0.2
* User: zym
* Date: 2017-09-05
* Copyright(c)  2017. U-GEN Tech.Co,Ltd. All Rights Reserved.
* public
*/
const PublicFunBase = require('iot-cloud-core').BASE.PublicFunBase;
const Role = require('../Util/Role');
// const SDSSDK = require('../Util/SDSTopSDK');
const ServiceManager = require('iot-cloud-fs');
const LOG = require('iot-cloud-core').LOG;
const UAformater = require('ua-format-js').UAFormat();
const Calculation = require('../controller/public/Calculation');
const WXSDK = require('../Util/WXSDK');
const ThirdsAuth = require('../controller/public/ThirdsAuth');
class Public extends PublicFunBase{

	/*
	*	设置系统参数
	*/

	constructor(){
		super();
		this.role = new Role();
	}

	async afterInit() {
	    //this.SDSSDK= new SDSSDK();
	    this.role.setDao(this.dao);
	    //实例微信sdk
	    // this.WXSDK = new WXSDK({appid: this.getConfig().wxAppId});
		this.auth={};
		this.auth.ThirdsAuth=new ThirdsAuth({config:this.getConfig(),error:this.error});
  	}
	async findThirdUserByUserId(data){
  		return await this.dao.get('user').findThirdUserByUserId(data);
	}
	async findThirdUserById(data){
  		return await this.dao.get('user').findThirdUserById(data);
	}
  	//添加用户权限关系
	addRole(action,...roles){
		this.role.addRole(action,...roles);
	}
  	//验证用户权限关系
	checkRole(role,...action){
		return this.role.checkRole(role,action);
	}
	async findAdminByDeviceId(data){
		return await this.dao.get('device').findAdminByDeviceId(data);
	}
	
	async simpleCreateDevice(data){
		return await this.dao.get('device').simpleCreateDevice(data);
	}
	
	async findDevice(data){
		return await this.dao.get('device').findDevice(data);
	}
	async findUserByUsername(data){
		return await this.dao.get('user').findUserByUsername(data);
	}
	//通过username创建账号
	async createSimpleUser(data){
		return await this.dao.get('user').createSimpleUser(data);
	}
	
	async findBindInfo(data){
		return await this.dao.get('device').findBindInfo(data);
	}
	//批量插入设备或更新
	async createOrUpdateDevice(data){
		return await this.dao.get('device').createOrUpdateDevice(data);
	}
	async findDeviceinfoById(data){
		return await this.dao.get('device').findDeviceinfoById(data);
	}
	//根据deviceId查找所有设备用户
	async findDeviceUserByDeviceId(data){
		return await this.dao.get('device').findDeviceUserByDeviceId(data);
	}
	//根据deviceId查找所有设备用户
	async findDeviceUserAndMoblieNameByDeviceId(data){
		return await this.dao.get('device').findDeviceUserAndMoblieNameByDeviceId(data);
	}

	//根据id查找设备
	async findDeviceById(data){
		return await this.dao.get('device').findDeviceById(data);
	}

	//根据device_id和user_id解绑设备
	async delBindByDeviceIdAndUserId(data){
		return await this.dao.get('device').delBindByDeviceIdAndUserId(data);
	}

	//删除设备关系
	async delBindByDeviceId(data){
		return await this.dao.get('device').delBindByDeviceId(data);
	}

	//注册设备
	async regDevice(data){
	  this.checkKeyExists(data,'product_id','device_id','device_name');
    data.status = 1;
    data.info = data.info ? data.info : {};
		return await this.dao.get('device').createDevice(data);
	}

	//登出时清除特定的用户数据
	async logout(data){
		return await this.dao.get('user').logout(data);
	}

	//设置deviceinfo
	async setDeviceInfo(data){
		console.log(data);
		return await this.dao.get('device').setDeviceInfo(data);
	}

	//根据id查询用户
	async searchById(data){
		return await this.dao.get('user').findUserById(data);
	}
	//根据id查询用户
	async searchMobileById(data){
		return await this.dao.get('user').findUserMobileById(data);
	}

	//根据用户id获得绑定设备以及详情
	async findDeviceListByUser(data){
		return await this.dao.get("device").findDeviceListByUser(data);
	}

	//用户绑定
	async userBind(data){
		return await this.dao.get('device').userBind(data);
	}

	//根据product_key 获取产品信息
	async findProductByKey(data){
		return await this.dao.get('product').findProductByKey(data);
	}
	//根据product_key获取产品信息
	async findProductByProductKey(data){
		return await this.dao.get('product').findProductByProductKey(data);
	}
	//根据product_id获取产品信息
	async findProductByid(data){
		return await this.dao.get('product').findProductByid(data);
	}

	async updateProductInfoById(data){
		return await this.dao.get('product').updateProductInfoById(data);
	}
	//获取指定用户的cid列表
	async getCidByUserList(data){
		return await this.dao.get('user').getCidByUserList(data);
	}

	//更新设备是否在线状态
	async updateDeviceState(data){
		return await this.dao.get('device').updateDeviceState(data);
	}

	//获得设备详细信息
	async findDeviceDetailById(data){
		return await this.dao.get('device').findDeviceDetailById(data);
	}

	//根据product_key和device_name获取device
	async findDeviceByPkAndName(data){
		return await this.dao.get('device').findDeviceByPkAndName(data);
	}
  	//微信信息
	async wxUserInfo(data){
		let wxParams = {
			code:data.params.code,
			appid:data.appid
		}
		let auth = await this.WXSDK.auth(wxParams);
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
	    let res={
			openid:wxUserInfo.openid,
			unionid:wxUserInfo.unionid,
			userinfo:wxUserInfo
	    };
	    return res;
	}

	//根据deviceid查找绑定关系
	async findBindUserByDeviceId(data){
		return await this.dao.get('device').findBindUserByDeviceId(data);
	}


	//根据id查询用户
	async searchMobileById(data){
		return await this.dao.get('user').findMobileById(data);
	}

	async createThirdUser(data){
		return await this.dao.get('user').createThirdUser(data);
	}

	async findOauthUserByUsernameAndPassword(data){
		return await this.dao.get('user').findOauthUserByUsernameAndPassword(data);
	}

	async upsertCode(data){
		return await this.dao.get('user').upsertCode(data);
	}

	async updateCodeStatus(data){
		return await this.dao.get('user').updateCodeStatus(data);
	}

	async findOauthCodeTokenByCodeAndRedirectUri(data){
		return await this.dao.get('user').findOauthCodeTokenByCodeAndRedirectUri(data);
	}

	async findUserByThirdUserId(data){
		return await this.dao.get('user').findUserByThirdUserId(data);
	}

	async findUserOauth(data){
		return await this.dao.get('user').findUserOauth(data);
	}

	async updateRefreshTokenById(data){
		return await this.dao.get('user').updateRefreshTokenById(data);
	}

	async getThirdUserMsg(data){
		return await this.dao.get('user').getThirdUserMsg(data);
	}
	async updateWXpushById(data){
		return await this.dao.get('user').updateWXpushById(data);
	}
	async updateUserForid(data){
		return await this.dao.get('user').updateUserForid(data);
	}
	async findOauthUserByUsernameAndType(data){
		return await this.dao.get('user').findOauthUserByUsernameAndType(data);
	}
	async updateThirdUserInfo(data){
		return await this.dao.get('user').updateThirdUserInfo(data);
	}



  	async findWXInfoByOpenidAndType(data){
  		return await this.dao.get('wx').findWXInfoByOpenidAndType(data);
  	}
  	async updateWXStateById(data){
  		return await this.dao.get('wx').updateWXStateById(data);
  	}
  	async getWXInfo(data){
		let userinfo=await this.auth.ThirdsAuth.getUserMsg(data.type,data.thirdmsg);
	    return userinfo;
  	}
  	async findThirdUserByUsernameType(data){
  		return await this.dao.get('user').findThirdUserByUsernameType(data);
  	}
  	async createThirdUsers(data){
  		return await this.dao.get('user').createThirdUsers(data);
  	}
  	async findOrCreateWXByUsername(data){
  		return await this.dao.get('wx').findOrCreateWXByUsername(data);
  	}
  	async findWXInfoByThirdId(data){
  		return await this.dao.get('wx').findWXInfoByThirdId(data);
  	}
  	async findWXMsgByThirdId(data){
  		return await this.dao.get('wx').findWXMsgByThirdId(data);
	}
	  

	async findSetMsgByDeviceIdUserIdType(data){
		return await this.dao.get('setting').findSetMsgByDeviceIdUserIdType(data);
	}
	async delSetMsgByDeviceIdUserId(data){
		return await this.dao.get('setting').delSetMsgByDeviceIdUserId(data);
	}
	async delSetMsgByDeviceId(data){
		return await this.dao.get('setting').delSetMsgByDeviceId(data);
	}
	async createSetMsg(data){
		return await this.dao.get('setting').createSetMsg(data);
	}
	
	async delShareUserByDeviceId(data){
		return await this.dao.get('shareuser').delShareUserByDeviceId(data);
	}
	async bindShareUserById(data){
		return await this.dao.get('shareuser').bindShareUserById(data);
	}
	
	async findShareUserByPhoneNumber(data){
		return await this.dao.get('shareuser').findShareUserByPhoneNumber(data);
	}
	async unbindShareUserByShareuserId(data){
		return await this.dao.get('shareuser').unbindShareUserByShareuserId(data);
	}
	async delShareUserByShareuserId(data){
		return await this.dao.get('shareuser').delShareUserByShareuserId(data);
	}
	
	//解绑用户和设备
	async unbind(data) {
        let DeviceInfo=await this.dao.get('device').findDevice({device_id:data.iotId});
        if(!DeviceInfo||!DeviceInfo.product_id){
            return false;
        }
        let ProductInfo=await this.dao.get('product').findProductByid({product_id:DeviceInfo.product_id});
        if (!ProductInfo.product_key) {
            return false;
        }
        let param={
            productKey:ProductInfo.product_key,
            apiParams:{
                path:"/cloud/user/device/unbind",
                apiVer:'1.0.4',
                params:{
                    iotId:data.iotId,
                    // productKey:data.productKey,
                    productKey:"a1pDrFc5DVW",
                    deviceName:"test_cyy_1",
                    // deviceName:data.deviceName,
                    identityId:data.identityId
                }
            }
		};
		console.log("param");
		console.log(param);
        let res = await ServiceManager.execCom('FYTokenService', 'postFYApis', param);
        return res;
    }
}
module.exports = Public;