const MysqlBase = require('iot-cloud-core').DB.MysqlBase;
const Sequelize = require('sequelize');
class WX_Info extends MysqlBase{
  init(){
    let model = this.createTable("WX_Info",{
      thirduser_id: {
        type: Sequelize.INTEGER(),
        allowNull: false
      },
      username: {
        type: Sequelize.CHAR(),
      },
      type: {
        type: Sequelize.CHAR(),
      },
      info: {
        type: Sequelize.JSON()
      },
      state: {
        type: Sequelize.INTEGER(),
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
module.exports = WX_Info;