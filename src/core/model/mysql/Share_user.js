const MysqlBase = require('iot-cloud-core').DB.MysqlBase;
const Sequelize = require('sequelize');
class Share_user extends MysqlBase{
  init(){
    let model = this.createTable("share_user",{
      device_id: {
        type: Sequelize.INTEGER(),
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER(),
        allowNull: false
      },
      shareuser_id: {
        type: Sequelize.INTEGER(),
      },
      phoneNumber: {
        type: Sequelize.CHAR(20),
      },
      info: {
        type: Sequelize.JSON(),
      },
      state: {
        type: Sequelize.BOOLEAN(2),
        allowNull: false
      },
    },{
      'timestamps': true,
      createdAt: 'create_time',
      updatedAt: 'update_time',
      freezeTableName: true,
    });
    return model;
  }
}
module.exports = Share_user;