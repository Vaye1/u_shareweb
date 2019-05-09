
const MysqlBase = require('iot-cloud-core').DB.MysqlBase;
const Sequelize = require('sequelize');
class Setting extends MysqlBase{
  init(){
    let model = this.createTable("Setting",{
      user_id: {
        type: Sequelize.INTEGER(),
        allowNull: false
      },
      device_id: {
        type: Sequelize.INTEGER(),
        allowNull: false
      },
      type: {
        type: Sequelize.CHAR(),
      },
      value: {
        type: Sequelize.JSON(),
      },
      state: {
        type: Sequelize.BOOLEAN(2),
        allowNull: false
      },
      info:{
        type:Sequelize.JSON
      }
    },{
      'timestamps': true,
      createdAt: 'create_time',
      updatedAt: 'update_time',
      freezeTableName: true,
    });
    return model;
  }
}
module.exports = Setting;