const Provider = require('iot-cloud-core').BASE.Provider;

const db_product = require('./model/mysql/Product');
const db_user = require('./model/mysql/User');
const db_device = require('./model/mysql/Device');
const db_user_device = require('./model/mysql/User_device');
const db_User_thirdparty = require('./model/mysql/User_thirdparty');
const db_WX_Info = require('./model/mysql/WX_Info');
const db_setting = require('./model/mysql/Setting');
const db_share_user = require('./model/mysql/Share_user');

const dao_product = require('./dao/ProductDao');
const dao_user = require('./dao/UserDao');
const dao_shareuser = require('./dao/ShareUserDao');
const dao_device = require('./dao/DeviceDao');
const dao_wx = require('./dao/WXDao');
const dao_setting = require('./dao/SettingDao');

const controller_user = require('./controller/UserController');
const controller_ShareDevice = require('./controller/ShareDeviceController');
const controller_wx = require('./controller/WXController');
const controller_aliGenie = require('./controller/aliGenieController');
const controller_device = require('./controller/DeviceController');
const controller_product = require('./controller/ProductController');

const public_class = require('./public/Public');

class CoreProvider extends Provider {
	constructor(dbManager) {
		super("core", dbManager);

		this.registerModel(db_user);
		this.registerModel(db_device);
		this.registerModel(db_user_device);
		this.registerModel(db_User_thirdparty);
		this.registerModel(db_WX_Info);
		this.registerModel(db_setting);
		this.registerModel(db_share_user);
		this.registerModel(db_product);

		this.registerDao("product", dao_product);
		this.registerDao("user", dao_user);
		this.registerDao("device", dao_device);
		this.registerDao("wx", dao_wx);
		this.registerDao("setting", dao_setting);
		this.registerDao("shareuser", dao_shareuser);

		this.registerController("wx", controller_wx);
		this.registerController("aliGenie", controller_aliGenie);
		this.registerController("user", controller_user);
		this.registerController("device", controller_device);
		this.registerController("product", controller_product);
		this.registerController("shareDevice", controller_ShareDevice);
	
		this.setPublicClass(public_class);
	}
}

module.exports = CoreProvider;