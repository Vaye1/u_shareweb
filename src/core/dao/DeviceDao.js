/**
 * LockDao.js
 * Version: 0.1
 * User: twb
 * Date: 2018-11-15
 * Copyright(c)  2018. U-GEN Tech.Co,Ltd. All Rights Reserved.
 */
const mongoose = require('mongoose');
const sequelize = require('sequelize');
const DaoBase = require('iot-cloud-core').BASE.DaoBase;
const moment = require('moment');

class DeviceDao extends DaoBase {
	//根据device_id查询该设备管理员
		async findAdminByDeviceId(data){
			this.checkKeyExists(data,"device_id","status")
			let update={
				where:{
					device_id:data.device_id,
					status:data.status,
					role:"SA"
				},
				raw:true,
				
			}
			let user_device_result=await this.models.mysql.user_device.findOne(update);
			return user_device_result;
		}
	//注册设备1
	async simpleCreateDevice(data) {
			this.checkKeyExists(data, "device_name", "parent_id", "info");
			let update = {};
			let res;
			if (!data.id) {
				res = await this.models.mysql.device.create(data);
				return res;
			} else {
				update = {
					product_id: data.product_id,
					mac:data.mac,
					device_name: data.device_name,
					device_state: data.device_state?data.device_state:1,
					parent_id: data.parent_id,
					info: data.info
				}
				update.id=data.id;
				res = await this.models.mysql.device.update(update,{
					where:{
						id:data.id
					}
				})
				return update;
			}
		}

	//根据device自增长id查找设备
	async findDeviceById(data) {
		this.checkKeyExists(data, 'id');
		let update = {
		attributes: ['id', 'device_id', 'mac', 'device_name', 'status', 'parent_id', 'device_state'],
		where: {
			id: data.id
		},
		raw: true
		};
		return await this.models.mysql.device.findOne(update);
	}
	
	//根据 id mac device_id 查找设备
		async findDevice(data) {
			if (!data.id && !data.mac && !data.device_id) {
				return false;
			}
			let update = {
				attributes: ['id', 'device_id', 'mac', 'device_name', 'status', 'parent_id', 'product_id'],
				where: {},
				raw: true
			};
			if (data.id) {
				update.where.id = data.id;
			}
			if (data.mac) {
				update.where.mac = data.mac;
			}
			if (data.device_id) {
				update.where.device_id = data.device_id;
			}
			let res = await this.models.mysql.device.findOne(update);
			return res;
		}

		//根据 id mac device_id 查找设备
		async findDeviceInfo(data) {
		if (!data.id && !data.mac && !data.device_id) {
			return false;
		}
		let update = {
			where: {},
			raw: true
		};
		if (data.id) {
			update.where.id = data.id;
		}
		if (data.mac) {
			update.where.mac = data.mac;
		}
		if (data.device_id) {
			update.where.device_id = data.device_id;
		}
		let res = await this.models.mysql.device.findOne(update);
		return res;
	}
	//查询绑定的设备
		async findBindInfo(data) {
			this.checkKeyExists(data, 'user_id', 'device_id');
			let update = {
				where: {
					user_id: data.user_id,
					device_id: data.device_id
				},
				raw: true
			}
			if (data.status) {
				update.where.status = data.status;
			}
			let res = await this.models.mysql.user_device.find(update);
			return res;
		}
	
	//查询用户绑定的设备
	async findDevicesByUser(data) {
		this.checkKeyExists(data, 'user_id');
		let update = {
			where: {
				user_id: data.user_id,
				status: data.status?data.status:1
			},
			raw: true
		}
		let res = await this.models.mysql.user_device.findAll(update);
		return res;
	}

		//批量插入设备或更新
		async createOrUpdateDevice(data) {
			this.checkKeyExists(data, "role", "status", "user_id", "info");
			let update = "";
			for (let i = 0; i < data.info.length; i++) {
				if (i >= 1) {
					update += ',';
				}
				update += `(${data.info[i].id},"${data.info[i].device_name}","${data.role}",${data.status},"{}","${moment().format('YYYY-MM-DD HH:mm:ss')}","${moment().format('YYYY-MM-DD HH:mm:ss')}",${data.info[i].device_id},${data.user_id})`;
			}
			let user_device_table = this.models.mysql.user_device.getTableName();
			let user_device_result = await this.models.mysql.db.query(`INSERT INTO ${user_device_table} (id,nickname, role ,status,info,create_time,update_time,device_id,user_id) VALUES ${update} ON DUPLICATE KEY UPDATE nickname=VALUES(nickname),role=VALUES(role),info=VALUES(info),update_time=VALUES(update_time),status=VALUES(status)`, {
				type: sequelize.QueryTypes.UPSERT,
			})
			if (user_device_result> 0) {
				return true;
			} else {
				return false;
			}
		}
	//根据deviceid来解绑
	async delBindByDeviceId(data) {
		this.checkKeyExists(data, 'device_id')
		let res = await this.models.mysql.user_device.update({
		status: data.status ? data.status : 0
		}, {
		where: {
			device_id: data.device_id
		}
		});
		return res[0] > 0
	}

	//根据user_id和device_id解绑
	async delBindByDeviceIdAndUserId(data) {
		this.checkKeyExists(data, 'user_id', 'device_id');
		let updateWhere = {
		where: {
			device_id: data.device_id,
			user_id: data.user_id
		}
		};
		if (data.role) {
		updateWhere.where.role = data.role;
		}
		let res = await this.models.mysql.user_device.update({status: 0}, updateWhere);
		return res[0] > 0;
	}

	//查找用户与设备的权限
	async findRoleByUserId(data) {
		this.checkKeyExists(data, "user_id", "device_id")
		let res = await this.models.mysql.user_device.find({
		attributes: ['role'],
		raw: true,
		where: {
			status: 1,
			user_id: data.user_id,
			device_id: data.device_id
		}
		});
		if (!res) {
		return false;
		}
		return res.role
	}

	//根据device_id查询该设备所有用户
	async findDeviceUserByDeviceId(data) {
		this.checkKeyExists(data, "device_id", "status");
		let user_device = this.models.mysql.user_device.getTableName();
		let update = {
		attributes: ['user_id', ['role', 'user_role'], ['status', 'user_status']],
		where: {
			status: data.status,
			device_id: data.device_id
		},
		order: `${user_device}.update_time DESC`,
		raw: true,
		include: [{
			model: this.models.mysql.user,
			as: 'user',
			attributes: [],
		}]
		}
		return await this.models.mysql.user_device.findAll(update);
	}
	//根据device_id查询该设备所有用户(带用户表手机号)
	async findDeviceUserAndMoblieNameByDeviceId(data) {
		this.checkKeyExists(data, "device_id", "status");
		let user_device = this.models.mysql.user_device.getTableName();
		let update = {
			attributes: ['user_id', ['role', 'user_role'], ['status', 'user_status']],
			where: {
				status: data.status,
				device_id: data.device_id
			},
			order: `${user_device}.update_time DESC`,
			raw: true,
			include: [{
				model: this.models.mysql.user,
				as: 'user',
				attributes: ["mobile","username"],
			}]
		}
		return await this.models.mysql.user_device.findAll(update);
	}

	//注册设备
	async createDevice(data) {
		this.checkKeyExists(data, "device_id", "device_name", "parent_id", "info");
		let update = {
		product_id: data.product_id,
		device_name: data.device_name,
		parent_id: data.parent_id,
		device_state: data.device_state,
		login_time: new Date(),
		info: data.info,
		status: data.status,
		}
		var that = this;
		return await this.models.mysql.device.findOrCreate({
		where: {device_id: data.device_id},
		defaults: update
		}).spread(function (row, created) {
		if (created) {
			return row;
		} else {
			return that.models.mysql.device.update(update, {where: {device_id: data.device_id}}).then(function (updated) {
			return {id: row.id, device_name: update.device_name, update: updated[0]};
			// return updated;
			});
		}
		});
	}

	//设置device info字段内容
	async setDeviceInfo(data) {
		this.checkKeyExists(data, "id", "info");
		let update = '';
		for (let key in data.info) {
			if (typeof data.info[key] === 'object') {
				update += `,'$.${key}',CAST('${JSON.stringify(data.info[key])}' AS JSON)`;
			} else {
				update += `,'$.${key}','${data.info[key]}'`;
			}
		}
		let updateMsg = {
			info: sequelize.literal(`json_set(info${update})`)
		}
		return await this.models.mysql.device.update(updateMsg, {where: {id: data.id}});
	}

	//获取用户绑定设备列表
	async findDeviceListByUser(data) {
		this.checkKeyExists(data, "user_id");
		let user_device_table = this.models.mysql.user_device.getTableName();
		let device_table = this.models.mysql.device.getTableName();
		let product_table = this.models.mysql.product.getTableName();
		let device = await this.models.mysql.db.query(`
				SELECT product_id,product.product_name,device.id AS device_id,device.device_id AS iot_id , device.info->>"$.nickname" AS device_name,
				device_state,role as user_role,login_time AS loginTime
				FROM ${device_table} AS device 
				LEFT JOIN ${user_device_table} AS user_device ON user_device.device_id = device.id
				LEFT JOIN ${product_table} AS product ON product.id = device.product_id
				WHERE user_device.status=1 AND user_device.user_id=$user_id
				ORDER BY user_device.update_time DESC
				`,
		{
			type: sequelize.QueryTypes.SELECT,
			bind: {
			user_id: data.user_id,
			}
		})
		return device;
	}

	/**
	 * 用户和设备绑定  写入事务防止并发重复插入
	 * @param data.user_id 用户id
	 * @param data.device_id 设备id
	 * @param data.role 权限关系
	 * @returns true:用户设备绑定成功 false:用户设备绑定失败
	 */
	async userBind(data) {
		this.checkKeyExists(data, 'user_id', 'device_id', 'role');
		return await this.models.mysql.db.transaction(async (t) => {
		let user_device = await this.models.mysql.user_device.findOne({
			where: {
			device_id: data.device_id,
			user_id: data.user_id,
			},
			lock: t.LOCK.UPDATE,
			transaction: t,
		});
		if (!user_device) {
			//没有用户和设备绑定关系就创建
			let create = await this.models.mysql.user_device.create({
			status: 1,
			role: data.role,
			device_id: data.device_id,
			user_id: data.user_id,
			info: {},
			}, {
			transaction: t
			});
			if(create){
			return true;
			}else{
			return false;
			}
		} else {
			//有用户和设备绑定关系就更新
			let update = await this.models.mysql.user_device.update({
			status: 1,
			role: data.role
			}, {
			where: {
				device_id: data.device_id,
				user_id: data.user_id,
			},
			transaction: t
			})
			if(update[0]){
			return true;
			}else{
			return false;
			}
		}
		});
	}

	//更新设备在线状态
	async updateDeviceState(data) {
		this.checkKeyExists(data, 'device_id', 'device_state', 'login_time');
		return await this.models.mysql.device.update({device_state: data.device_state,login_time:data.login_time}, {where: {id: data.device_id}});
	}

	//根据device_id获取设备详情信息
	async findDeviceDetailById(data) {
		this.checkKeyExists(data, 'device_id', 'user_id');
		let user_device_table = this.models.mysql.user_device.getTableName();
		let device_table = this.models.mysql.device.getTableName();
		let product_table = this.models.mysql.product.getTableName();
		return await this.models.mysql.db.query(`
				SELECT product_id,product.product_name,device.id AS device_id,device.device_id AS iot_id,device.info->>"$.nickname" AS device_name,
				device_state,role as user_role,user_device.status AS user_status,login_time AS loginTime,product.product_name,
				device.info->>"$.options" AS push_option
				FROM ${device_table} AS device
				LEFT JOIN ${user_device_table} AS user_device ON user_device.device_id = device.id
				LEFT JOIN ${product_table} AS product ON product.id = device.product_id
				WHERE device.id = $device_id AND user_device.user_id = $user_id LIMIT 1
				`,
		{
			type: sequelize.QueryTypes.SELECT,
			bind: {
			device_id: data.device_id,
			user_id: data.user_id,
			}
		})
	}
	//根据device_id获取设备详情信息(增加了设备表的info)
	async findDeviceinfoById(data) {
		this.checkKeyExists(data, 'device_id', 'user_id');
		let user_device_table = this.models.mysql.user_device.getTableName();
		let device_table = this.models.mysql.device.getTableName();
		let product_table = this.models.mysql.product.getTableName();
		return await this.models.mysql.db.query(`
				SELECT product_id,product.product_name,device.id AS device_id,device.device_id AS iot_id,device.info->>"$.nickname" AS device_name,
				device_state,role as user_role,user_device.status AS user_status,login_time AS loginTime,product.product_name,device.info AS deviceInfo,
				device.info->>"$.options" AS push_option
				FROM ${device_table} AS device
				LEFT JOIN ${user_device_table} AS user_device ON user_device.device_id = device.id
				LEFT JOIN ${product_table} AS product ON product.id = device.product_id
				WHERE device.id = $device_id AND user_device.user_id = $user_id LIMIT 1
				`,
		{
			type: sequelize.QueryTypes.SELECT,
			bind: {
			device_id: data.device_id,
			user_id: data.user_id,
			}
		})
	}

	//根据product_key和device_name获取device
	async findDeviceByPkAndName(data) {
		this.checkKeyExists(data, 'product_key', 'device_name');
		let device_table = this.models.mysql.device.getTableName();
		let product_table = this.models.mysql.product.getTableName();
		return await this.models.mysql.db.query(`
				SELECT device.id,device.info
				FROM ${device_table} AS device
				LEFT JOIN ${product_table} AS product ON product.id = device.product_id
				WHERE product.product_key = $product_key AND device.device_name = $device_name LIMIT 1
				`,
		{
			type: sequelize.QueryTypes.SELECT,
			bind: {
			product_key: data.product_key,
			device_name: data.device_name,
			}
		})
	}

      //根据权限查找绑定关系
    async findBindUserByDeviceId(data) {
        this.checkKeyExists(data, 'device_id')
        let update = {
            attributes: [
            'id',
            'user_id',
            'status', 
            'user.username',
            'user.nickname',
            'user.mobile',
            'role',
            ['info','user_device_info']],
            raw: true,
            include: [{
                model: this.models.mysql.user,
                as: 'user',
                attributes: []
            }]
        };
        if (data.Key) {
            for (let i = 0; i < data.Key.length; i++) {
                update.attributes.push(sequelize.literal("user.info->'$." + data.Key[i] + "' as " + data.Key[i]));
            }
            delete data.Key
        }
        update.where=data;
        let res = await this.models.mysql.user_device.findAll(update);
        return res;
    }
}

module.exports = DeviceDao;