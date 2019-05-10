const MysqlBase = require('iot-cloud-core').DB.MysqlBase;
const Sequelize = require('sequelize');
class Product extends MysqlBase {
  init() {
    let model = this.createTable("product", {
      product_name: {
        type: Sequelize.CHAR(50),
      },
      product_key: {
        type: Sequelize.CHAR(50),
        allowNull: false,
      },
      expire_time: {
        type: Sequelize.DATE()
      },
      info: {
        type: Sequelize.JSON(),
        allowNull: true
      }
    },{
      timestamps: true,
      createdAt: 'create_time',
      updatedAt: 'update_time',
      indexes:[
        {
          unique: true,
          fields: ['product_key']
        }
      ],
      freezeTableName: true,
    });
    return model;
  }

}
module.exports = Product;