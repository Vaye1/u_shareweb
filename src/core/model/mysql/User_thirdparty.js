const MysqlBase = require('iot-cloud-core').DB.MysqlBase;
const Sequelize = require('sequelize');
class User_device extends MysqlBase {
    init() {
        let model = this.createTable("user_thirdparty", {
            user_id: {
                type: Sequelize.INTEGER(),
                allowNull: true
            },
            username: {
                type: Sequelize.CHAR(64),
                allowNull: false
            },
            type: {
                type: Sequelize.CHAR(20),
                allowNull: false
            },
            info:{
                type:Sequelize.JSON(),
                allowNull: false
            },
            state:{
                type:Sequelize.CHAR(),
                allowNull: false
            }   
        },
        {
            timestamps: true,
            createdAt: 'create_time',
            updatedAt: 'update_time',
            freezeTableName: true,
            indexes:[
                {
                    unique: false, 
                    name:"thirduser",
                    fields: ['username','user_id','type']
                },
                {
                    unique: true, 
                    name:"usertype",
                    fields: ['username','type']
                }
            ]
        });
        return model;
    }
}
module.exports = User_device;
