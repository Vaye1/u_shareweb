const DaoBase = require('iot-cloud-core').BASE.DaoBase;
const sequelize = require('sequelize');
const moment=require('moment');
const config = require('../controller/config');

class SettingDao extends DaoBase{
  //创建一条设置
  async createSetMsg(data){
    this.checkKeyExists(data,"user_id","device_id");
    return await this.models.mysql.Setting.create({
        user_id: data.user_id,
        device_id: data.device_id,
        type: data.type,
        value:data.value,
        state:data.state?data.state:1,
        info: data.info?data.info:{},
    });
  }
  //根据设备id和用户id获取设置信息
  async findSetMsgByDeviceIdUserId(data){
    this.checkKeyExists(data,"device_id","user_id");
    let update = {
      raw:true,
      where:{
        device_id: data.device_id,
        user_id:data.user_id,
      }
    }
    return await this.models.mysql.Setting.findOne(update);
  }
  //根据设备id、用户id以及类型获取设置信息
  async findSetMsgByDeviceIdUserIdType(data){
    this.checkKeyExists(data,"device_id","user_id","type");
    let update = {
      raw:true,
      where:{
        device_id: data.device_id,
        user_id:data.user_id,
        type:data.type,
      }
    }
    return await this.models.mysql.Setting.findOne(update);
  }
  //根据设备id、用户id和type修改设置
  async updateSetMsgByDeviceIdUserId(data){
    this.checkKeyExists(data,"device_id","user_id","type","value");
    let update = {
      updateMsg: {
        value: data.value,
      },
      updateWhere: {
        where: {
          device_id: data.device_id,
          user_id: data.user_id,
          type: data.type,
        }
      }
    };
    return await this.models.mysql.Setting.update(update.updateMsg,update.updateWhere);
  }
  //根据用户id获取设置信息
  async findSetMsgByUserId(data){
    this.checkKeyExists(data,"user_id");
    let update = {
      raw:true,
      where:{
          user_id:data.user_id,
      }
    }
    return await this.models.mysql.Setting.findAll(update);
  }

  //根据用户id和设备ID获取设置信息
  async findSetMsgByUserIdDeviceId(data){
    this.checkKeyExists(data,"user_id","device_id");
    let update = {
      raw:true,
      where:{
        user_id:data.user_id,
        device_id:data.device_id,
      }
    }
    return await this.models.mysql.Setting.findAll(update);
  }

  //根据设备id删除记录
  async delSetMsgByDeviceId(data){
    this.checkKeyExists(data,"device_id");
    let update = {
      where:{
        device_id:data.device_id,
      }
    }
    return await this.models.mysql.Setting.destroy(update);
  }
  //根据设备id和用户id删除记录
  async delSetMsgByDeviceIdUserId(data){
    this.checkKeyExists(data,"device_id","user_id");
    let update = {
      where:{
        device_id:data.device_id,
        user_id:data.user_id,
      }
    }
    return await this.models.mysql.Setting.destroy(update);
  }
}
module.exports = SettingDao;