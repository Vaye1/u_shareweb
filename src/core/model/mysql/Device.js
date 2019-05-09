const MysqlBase = require('iot-cloud-core').DB.MysqlBase;
const Sequelize = require('sequelize');
class Device extends MysqlBase {
    init() {
        let model = this.createTable("device", {
            device_id: {
                type: Sequelize.CHAR(100),
                allowNull: false,
                unique:true
            },
            product_id: {
                type: Sequelize.CHAR(50),
                allowNull: false
            },
            device_name: {
                type: Sequelize.CHAR(45)
            },
            mac: {
                type: Sequelize.CHAR(45)
            },
            parent_id: {
                type: Sequelize.INTEGER()
            },
            device_state: {
                type: Sequelize.BOOLEAN(2)
            },
            status: {
                type: Sequelize.BOOLEAN(2)
            },
            login_time: {
                type: Sequelize.DATE()
            },
            info: {
                type: Sequelize.JSON()
            }
        },{
            timestamps: true,
            createdAt: 'create_time',
            updatedAt: 'update_time',
			hooks: {
                afterFind: function(device, options) {
                    if(device&&device.info)
                        device.info = JSON.parse(device.info)
                }
            },
            indexes:[
                {
                    unique: false, 
                    fields: ['product_id']
                },
                {
                    unique: false, 
                    fields: ['mac']
                }
            ],
			freezeTableName: true,
        });
        return model;
    }

}
module.exports = Device;