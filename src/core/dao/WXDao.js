/**
 * 微信dao
 * @type {Mongoose}
 */
const mongoose = require('mongoose');
const sequelize = require('sequelize');
const DaoBase = require('iot-cloud-core').BASE.DaoBase;
class WXDao extends DaoBase {
  async findWXInfoByOpenidAndType(data){
    let res=await this.models.mysql.WX_Info.findOne({
        where:{
          type:data.type,
          username:data.openid
        }
    });
    return res;
  }
  async findWXMsgByThirdId(data){
    let res=await this.models.mysql.WX_Info.findAll({
        where:{
          thirduser_id:data.thirduser_id
        }
    });
    return res;
  }
  async findWXInfoByThirdId(data){
    let res=await this.models.mysql.WX_Info.findOne({
        where:{
          type:data.type,
          thirduser_id:data.thirduser_id
        }
    });
    return res;
  }

  async updateWXStateById(data) {
    let update={
        state: data.state
    }
    let condition = {
      where: {
        id: data.id
      }
    };
    let res = await this.models.mysql.WX_Info.update(update,condition);
    return res;
  }
  
  async findOrCreateWXByUsername(data){
    return await this.models.mysql.WX_Info.findOrCreate({
        where:{
            username:data.username,
            type:data.type,
        },
        defaults:{
            thirduser_id:data.thirduser_id,
            username:data.username,
            type:data.type,
            info:data.info,
            state:data.state?data.state:1,
        }
    });
  }
  async findOrCreateWXByThirduserId(data){
    return await this.models.mysql.WX_Info.findOrCreate({
        where:{
            thirduser_id:data.thirduser_id,
            type:data.type,
        },
        defaults:{
            thirduser_id:data.thirduser_id,
            username:data.username,
            type:data.type,
            info:data.info,
            state:data.state?data.state:1,
        }
    });
  }
  async updateWXInfoById(data) {
    this.checkKeyExists(data, 'id', 'info');
    let update={
        info: data.info
    }
    let condition = {
      where: {
        id: data.id
      }
    };
    let res = await this.models.mysql.user_thirdparty.update(update,condition);
    return res;
  }
}
module.exports = WXDao;