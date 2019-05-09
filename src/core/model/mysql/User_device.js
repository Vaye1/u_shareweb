const MysqlBase = require('iot-cloud-core').DB.MysqlBase;
const Sequelize = require('sequelize');
class User_device extends MysqlBase {
    init() {
        let model = this.createTable("user_device", {
            nickname: {
                type: Sequelize.CHAR(45)
            },
            role: {
                type: Sequelize.CHAR(10)
            },
            status: {
                type: Sequelize.BOOLEAN(2)
            },
            info: {
                type: Sequelize.JSON
            },
            device_id: {
                type: Sequelize.INTEGER()
            },
            user_id: {
              type: Sequelize.INTEGER()
            }
        }, {
            timestamps: true,
            createdAt: 'create_time',
            updatedAt: 'update_time',
            freezeTableName: true,
          indexes:[
            {
              fields: ['device_id']
            },
            {
              fields: ['user_id']
            }
          ]
        });
        return model;
    }
  createRelationShip(models) {
    models.user_device.belongsTo(models.device, { foreignKey: { name: 'device_id', allowNull: false }, as: 'device' });
    models.user_device.belongsTo(models.user, { foreignKey: { name: 'user_id', allowNull: false }, as: 'user' });
  }
}
module.exports = User_device;