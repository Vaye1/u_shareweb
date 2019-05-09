const MysqlBase = require('iot-cloud-core').DB.MysqlBase;
const Sequelize = require('sequelize');
class Log extends MysqlBase{
	init(){
        let model = this.createTable("user",{
			username:{
				type:Sequelize.CHAR(45),
				allowNull: false,
				unique:"uk_name"
			},
			password:{
				type:Sequelize.CHAR(45),
				allowNull: false
			},
			nickname:{
				type:Sequelize.CHAR(45),
				allowNull: false,
				defaultValue:""
			},
			head:{
				type:Sequelize.CHAR(255),
				allowNull: false,
				defaultValue:""
			},
			mobile:{
				type:Sequelize.CHAR(20)
			},
			email:{
				type:Sequelize.CHAR(100)
			},
			loginTime:{
				type:Sequelize.DATE()
			},
			info:{
				type:Sequelize.JSON(),
				allowNull: false
			},
			salt:{
				type:Sequelize.CHAR(10),
				allowNull:false
			}
		},
		{
			timestamps: true,
			createdAt:'create_time',
			updatedAt:'update_time',
			hooks: {
				afterFind: function(user, options) {
					if(user && user.info)
						user.info = JSON.parse(user.info)
				}
			},
			freezeTableName: true,
			indexes:[
                {
                    fields: ['loginTime']
                },
                {
                    fields: ['create_time']
                }
            ]
		});
		return model;
	}
}
module.exports = Log;