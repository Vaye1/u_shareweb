const DaoBase = require('iot-cloud-core').BASE.DaoBase;
const sequelize = require('sequelize');
const moment = require('moment')
class UserDao extends DaoBase{
	async createUser(params){
		this.checkKeyExists(params,"username","pwd","salt");
		let newUser = {
			username:params.username,
			password:params.pwd,
			info:params.info,
			salt:params.salt,
			loginTime:new Date()
		};
		let res = await this.models.mysql.user.create(newUser);
		return res.get({
			plain:true
		});
	}
	async updateUserForid(params){
		let upmsg={
				info:params.info
			};
		let upwhere={
			where:{
				id:params.user_id
			}
		};
		let res = await this.models.mysql.user.update(upmsg,upwhere);
		return res;
	}
	
	async updateUserLoginTimeForid(params){
		let upmsg={
			loginTime:params.loginTime
		};
		let upwhere={
			where:{
				id:params.user_id
			}
		};
		let res = await this.models.mysql.user.update(upmsg,upwhere);
		return res;
	}

	async createWXUser(params){
		this.checkKeyExists(params,"username","salt");
		let newUser = {
			where:{
				username:params.username
			},
			defaults:{
				loginTime:new Date(),
				password:"",
				nickname:params.nickname,
				head:params.head,
				info:params.info?params.info:{},
				salt:params.salt
			}
		};
		let info = {
			loginTime:moment().format('YYYY-MM-DD HH:mm:ss'),
			nickname:params.nickname,
			head:params.head,
			mobiletype:params.info.mobiletype,
			version:params.info.version,
			useragent:params.info.useragent,
			username:params.username
		};
        let clienId='';
		if (params.info.clienId) {
			clienId=",'$.clienId','"+params.info.clienId+"'";
		}
		let update = {
			attributes:['id','username','nickname','head'],
			raw:true,
			where:{
				username:params.username
			}
		};
		var that=this;//从不同方法过来的参数用不同的方法
		let res = await this.models.mysql.user.findOrCreate(newUser).spread(function(row, created) {
            if (created||params.condition) {
                return row.get({
					plain:true
				});
            } else {
                let user_table = that.models.mysql.user.getTableName();
	        	return that.models.mysql.db.query(`UPDATE ${user_table} SET nickname=$nickname,head=$head,loginTime=$loginTime,info=json_set(info,'$.mobiletype',$mobiletype,'$.version',$version,'$.useragent',$useragent${clienId}) WHERE username=$username`, {
	            	type: sequelize.QueryTypes.UPDATE,
	            	bind: {
	            		nickname:info.nickname,
	            		head:info.head,
	                	username:info.username,
	                	mobiletype:info.mobiletype,
	                	version:info.version,
	                	useragent:JSON.stringify(info.useragent),
	                	loginTime:info.loginTime
	            	}
	        	}).then(function(updated) {
                    return that.models.mysql.user.find(update);
                });
            }
        });
		return res;
	}

	async createSimpleUser(params){
		this.checkKeyExists(params,"username","salt");
		let newUser = {
			where:{
				username:params.username
			},
			defaults:{
				loginTime:new Date(),
				password:params.password?params.password:"",
				nickname:params.nickname,
				mobile:params.mobile?params.mobile:'',
				head:params.head,
				info:params.info?params.info:{},
				salt:params.salt
			}
		};
		let info = {
			loginTime:moment().format('YYYY-MM-DD HH:mm:ss'),
			mobiletype:params.info.mobiletype,
			version:params.info.version,
			useragent:params.info.useragent,
			username:params.username
		};
    	let clienId='';
		if (params.info.clienId) {
			clienId=",'$.clienId','"+params.info.clienId+"'";
		}
		let update = {
			attributes:['id','username','nickname','head'],
			raw:true,
			where:{
				username:params.username
			}
		};
		var that=this;//从不同方法过来的参数用不同的方法
		let res = await this.models.mysql.user.findOrCreate(newUser).spread(function(row, created) {
            if (created||params.condition) {
                return row.get({
					plain:true
				});
            } else {
                let user_table = that.models.mysql.user.getTableName();
	        	return that.models.mysql.db.query(`UPDATE ${user_table} SET loginTime=$loginTime,info=json_set(info,'$.mobiletype',$mobiletype,'$.version',$version,'$.useragent',$useragent${clienId}) WHERE username=$username`, {
	            	type: sequelize.QueryTypes.UPDATE,
	            	bind: {
	                	username:info.username,
	                	mobiletype:info.mobiletype,
	                	version:info.version,
	                	useragent:JSON.stringify(info.useragent),
	                	loginTime:info.loginTime
	            	}
	        	}).then(function(updated) {
                    return that.models.mysql.user.find(update);
                });
            }
        });
		return res;
	}

	async findUserById(params){
		this.checkKeyExists(params,"uid");
		let search = {
			where:{
				id:params.uid
			},
			attributes:["id","username","password","nickname","mobile","head","info","salt","loginTime"]
		};
		let res = await this.models.mysql.user.findOne(search);
		if(res == null){
			return false;
		}
		return res.get({
			plain:true
		});
	}
	
	async findUserByUsername(params){
		let search = {
			where:{
				username:params.username
			}
    };
		let res = await this.models.mysql.user.findOne(search);
		if(res == null){
			return false;
		}
		return res;
	}


	async findUserMobileById(params){
		this.checkKeyExists(params,"uid");
		let search = {
		where:{
			id:params.uid
		},
		attributes:["id","username","password","nickname","head","salt","loginTime", "mobile"]
		};
		let res = await this.models.mysql.user.findOne(search);
		if(res == null){
		return false;
		}
		return res.get({
		plain:true
		});
	}

	async logout(data){
		this.checkKeyExists(data,"key","user_id");
		let params='';
		for (let i = 0; i < data.key.length; i++) {
            params += ",'$." + data.key[i]+"'";
        }
		let update={
			info:sequelize.literal(`JSON_REMOVE(info${params})`)
		}
		let condition={
			where:{
				id:data.user_id
			}
		}
		let res = await this.models.mysql.user.update(update,condition)
		if (res[0]>0) {
			return true;
		}
		return false;
	}

	async getCidByUserList(data){
		this.checkKeyExists(data,"user_list");
		return await this.models.mysql.user.findAll({
			raw:true,
			attributes:[[sequelize.literal(`info->>'$.clienId'`),'cid']],
			where:{
				id:{$in: data.user_list}
			}
		});
	}


	async getThirdUserMsg(data){
		let res = await this.models.mysql.user_thirdparty.findOne({
			raw:true,
			where:{
				user_id:data.user_id,
				type:data.type
			}
		});
		return res;
	}

	async createThirdUsers(data){
		let create = {
			user_id:data.user_id,
			username:data.username,
			type:data.type,
			info:data.info,
			state: data.state?data.state:1
		};
		let res;
		try{
			res = await this.models.mysql.user_thirdparty.create(create);
		}catch(err){
			return false;
		}
		return res;
	}

	async delThirdUser(data){
		let update = {
			where:{
				user_id:data.user_id,
				type:data.type
			}
		}
		return await this.models.mysql.user_thirdparty.destroy(update);
	}


	// 根据用户ID获取用户手机号
	async findMobileById(params){
		this.checkKeyExists(params,"uid");
		let search = {
			attributes:["id","username","password","nickname","head","salt","loginTime","mobile"],
			where:{
				id:params.uid
			}
		};
		let res = await this.models.mysql.user.findOne(search);
		if(res == null){
			return false;
		}
		return res.get({
			plain:true
		});
	}

	//第三方用户表插入数据
	async createThirdUser(data){
		return await this.models.mysql.db.transaction(async (t) => {
			let third_user = await this.models.mysql.user_thirdparty.findOne({
				where: {
					user_id: data.user_id,
					type: data.platform,
					state: 1
				},
				lock: t.LOCK.UPDATE,
				transaction: t,
			});
			if (!third_user) {
				//没有用户和平台数据就创建
				let create = await this.models.mysql.user_thirdparty.create({
					user_id: data.user_id,
					username: data.username,
					type: data.platform,
					state: 1,
					info: {
						password: data.password,
						tmallGenie_push:data.tmallGenie_push?data.tmallGenie_push:1
					},
				}, {
					transaction: t
				});
				return Boolean(create);
			} else {
				//有用户和平台数据就更新
				let update = await this.models.mysql.user_thirdparty.update({
				username: data.username,
				info:sequelize.literal(`json_set(info,'$.password','${data.password}')`)
				}, {
				where: {
					type: data.platform,
					user_id: data.user_id,
					state: 1
				},
				transaction: t
				});
				return Boolean(update[0]);
			}
		});
	}

	//根据账户名密码获取授权密钥表数据
	async findOauthUserByUsernameAndPassword(data) {
		this.checkKeyExists(data, 'username', 'password', 'platform');

		let select = {
			attributes: [
				'id', 'username', sequelize.literal(`info->'$.password' AS password`), ['type', 'platform'], 'user_id'
			],
			where: {
				// username: data.username,
				// password: data.password,
				// platform: data.platform,
				// status: 1

				username: data.username,
				type: data.platform,
				info:sequelize.literal(`info->'$.password' = '${data.password}'`),
				state: 1
			}
		};

		let res = await this.models.mysql.user_thirdparty.find(select);
		return res;
	}
  
	async updateThirdUserInfo(data){
		this.checkKeyExists(data,'third_user_id','info');
		try{
			if (data.info.tmallGenie_push!=undefined) {
				await this.models.mysql.user_thirdparty.update({
					info: sequelize.literal(`json_set(info,'$.tmallGenie_push','${data.info.tmallGenie_push}')`)
				}, {
					where: {
						id:data.third_user_id,
						state: 1,
					}
				});
				return true;
			}else if (data.info.weChat_push!=undefined) {
				await this.models.mysql.user_thirdparty.update({
					info: sequelize.literal(`json_set(info,'$.weChat_push','${data.info.weChat_push}')`)
				}, {
					where: {
						id:data.third_user_id,
						state: 1,
					}
				});
				return true;
			}else{
				return false;
			}
		}catch(e){
			console.log(e);
		}
	}
	// 更新CODE
	async upsertCode(data){
		this.checkKeyExists(data,'third_user_id','code');
		try{
			await this.models.mysql.user_thirdparty.update({
				info: sequelize.literal(`json_set(info,'$.code','${data.code}', `+
				`'$.code_status','1','$.code_expires_time','${ moment().add(300, 'seconds').unix()}')`)
			}, {
				where: {
					id:data.third_user_id,
					state: 1,
				}
			});
			return true;
		}catch(e){
			console.log(e);
		}
	}

	// 更新CODE状态
	async updateCodeStatus(data){
		this.checkKeyExists(data,'third_user_id');
		try{
			await this.models.mysql.user_thirdparty.update({
				info: sequelize.literal(`json_set(info,'$.code_status','0')`)
			}, {
				where: {
				id:data.third_user_id,
				state: 1,
				}
			});
			return true;
		}catch(e){
			console.log(e);
		}
	}

	//根据third_user_id获取用户的真实user_id
	async findUserByThirdUserId(data){
		this.checkKeyExists(data, 'third_user_id');

		let select = {
			raw: true,
			attributes: ['id','user_id','username','type','info','state'],
			where: {
				id:data.third_user_id,
				state: 1
			}
		};
		return await this.models.mysql.user_thirdparty.findOne(select);
	}

	//查找userOauth数据
	async findUserOauth(data){
		if(data.code){
			let select = {
				raw: true,
				where: {
				info:sequelize.literal(`info->'$.code' = '${data.code}' and info->'$.code_status' = '1' `+
					`and info->'$.code_expires_time' > ${moment().unix()}`)
				}
			};
			return await this.models.mysql.user_thirdparty.findOne(select);
		}else if(data.refresh_token){
			let select = {
				raw: true,
				where: {
				info:sequelize.literal(`info->'$.refresh_token' = '${data.refresh_token}'`)
				}
			};
			return await this.models.mysql.user_thirdparty.findOne(select);
		}
	}

	//更新RefreshToken
	async updateRefreshTokenById(data){
		this.checkKeyExists(data,'id','refresh_token');
		// console.log(data.refresh_expire);
		let update= {
			info:sequelize.literal(`json_set(info,'$.refresh_token','${data.refresh_token}')`)
		};
		let condition={
			where:{
				id:data.id,
				state: 1
			}
		}
		let res = await this.models.mysql.user_thirdparty.update(update,condition)
		return res;
	}

	//修改推送状态
	async updateWXpushById(data){
		this.checkKeyExists(data,'id','status'); 
		// console.log(data.refresh_expire);
		let update= {
			info:sequelize.literal(`json_set(info,'$.weChat_push','${data.status}')`)
		};
		let condition={
			where:{
				id:data.id,
				state: 1
			}
		}
		let res = await this.models.mysql.user_thirdparty.update(update,condition)
		return res;
	}

	//根据第三方表的username和type查询第三方用户表
	async findOauthUserByUsernameAndType(data) {
		this.checkKeyExists(data, 'username', 'type');

		let select = {
			where: {
				username: data.username,
				type: data.type,
				state: 1
			}
		};
		let res = await this.models.mysql.user_thirdparty.find(select);
		return res;
	}

	//根据第三方表的id绑定主用户
	async updateThirdUserById(data) {
		this.checkKeyExists(data, 'user_id', 'id');
		let update={
			user_id: data.user_id
		}
		let condition = {
			where: {
				id: data.id
			}
		};
		let res = await this.models.mysql.user_thirdparty.update(update,condition);
		return res;
	}

	//根据用户表的user_id查询第三方用户表
	async findThirdUserByUserId(data) {
		this.checkKeyExists(data, 'user_id');
		let select = {
			where: {
				user_id: data.user_id
			}
		};
		let res = await this.models.mysql.user_thirdparty.findAll(select);
		return res;
	}

	//根据第三方用户表的id查询第三方用户表的信息
	async findThirdUserById(data){
		let select = {
			where: {
				id:data.id
			}
		};
		return await this.models.mysql.user_thirdparty.findOne(select);
	}

	//根据第三方用户表的username和type查询第三方用户表的信息
	async findThirdUserByUsernameType(data){
		let select = {
			where: {
				username:data.username,
				type:data.type,
			}
		};
		return await this.models.mysql.user_thirdparty.findOne(select);
	}
  
	//根据第三方用户表的username和type查询第三方用户表的信息
	async findThirdUserByUserIdType(data){
		let select = {
			where: {
				user_id:data.user_id,
				type:data.type
			}
		};
		return await this.models.mysql.user_thirdparty.findOne(select);
	}
}
module.exports = UserDao;