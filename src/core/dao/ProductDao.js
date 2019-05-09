/**
 * 产品dao
 * @type {Mongoose}
 */
const mongoose = require('mongoose');
const sequelize = require('sequelize');
const DaoBase = require('iot-cloud-core').BASE.DaoBase;
class ProductDao extends DaoBase {
  //根据product_key获取产品信息
  async findProductByKey(data){
    this.checkKeyExists(data,'product_key','product_name');
    return await this.models.mysql.product.findOrCreate({where:{product_key:data.product_key},defaults:{product_key:data.product_key,product_name:data.product_name}});
  }
  //根据product_key获取产品信息
  async findProductByProductKey(data){
    this.checkKeyExists(data,'product_key');
    return await this.models.mysql.product.findOne({
    	where:{product_key:data.product_key}
    });
  }
  //根据product_id获取产品信息
  async findProductByid(data){
    this.checkKeyExists(data,'product_id');
    return await this.models.mysql.product.findOne({
    	where:{id:data.product_id}
    });
  }
  //获取产品表所有信息
  async findProducts(data){
    return await this.models.mysql.product.findAll({});
  }
  async updateProductInfoById(data) {
    this.checkKeyExists(data, 'id', 'info');
    let update={
        info: data.info
    }
    let condition = {
      where: {
        id: data.id
      }
    };
    let res = await this.models.mysql.product.update(update,condition);
    return res;
  }
}
module.exports = ProductDao;