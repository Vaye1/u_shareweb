const DaoBase = require('iot-cloud-core').BASE.DaoBase;
const sequelize = require('sequelize');
const moment=require('moment');
const config = require('../controller/config');

class ShareUserDao extends DaoBase{
  //创建一个分享用户
  async createShareUser(data){
    this.checkKeyExists(data,"user_id","device_id","phoneNumber");
    return await this.models.mysql.share_user.create({
        user_id: data.user_id,
        device_id: data.device_id,
        shareuser_id: data.shareuser_id?data.shareuser_id:null,
        phoneNumber: data.phoneNumber,
        info: data.info?data.info:{},
        state:data.state?data.state:1
    });
  }
  //根据手机号码和设备id查询一条记录
  async findShareUserByDeviceIdAndNumber(data){
    this.checkKeyExists(data,"device_id","phoneNumber");
    let update = {
      raw:true,
      where:{
        device_id:data.device_id,
        phoneNumber: data.phoneNumber,
      }
    }
    return await this.models.mysql.share_user.findOne(update);
  }
  //根据id查询一条记录
  async findShareUserById(data){
    this.checkKeyExists(data,"id");
    let update = {
      raw:true,
      where:{
        id:data.id
      }
    }
    return await this.models.mysql.share_user.findOne(update);
  }
  //根据设备id和手机号查询一条记录
  async findShareUserByPhoneNumber(data){
    this.checkKeyExists(data,"device_id","phoneNumber");
    let update = {
      raw:true,
      where:{
        device_id:data.device_id,
        phoneNumber:data.phoneNumber,
      }
    }
    return await this.models.mysql.share_user.findOne(update);
  }
  //根据设备id查询所有记录
  async findShareUserByDeviceId(data){
    this.checkKeyExists(data,"device_id");
    let update = {
      raw:true,
      where:{
        device_id:data.device_id,
      }
    }
    return await this.models.mysql.share_user.findAll(update);
  }
  //根据id更新分享用户信息
  async updateShareUserById(data){
    this.checkKeyExists(data,'id',"info");
    return await this.models.mysql.share_user.update(
      {
        info:data.info
      },
      {
        where:{
          id:data.id
        }
      }
    );
  }
  //根据id绑定用户
  async bindShareUserById(data){
    this.checkKeyExists(data,'id',"shareuser_id");
    return await this.models.mysql.share_user.update({
        shareuser_id:data.shareuser_id
      },
      {
        where:{
          id:data.id
        }
    });
  }
  //根据device_id删除分享用户
  async delShareUserByDeviceId(data){
    this.checkKeyExists(data,'device_id');
    let update = {
      where:{
        device_id:data.device_id,
      }
    }
    return await this.models.mysql.share_user.destroy(update);
  }
  //根据id删除分享用户
  async delShareUserById(data){
    this.checkKeyExists(data,'id');
    let update = {
      where:{
        id:data.id,
      }
    }
    return await this.models.mysql.share_user.destroy(update);
  }
  //根据shareuser_id和device_id删除分享用户
  async delShareUserByShareuserId(data){
    this.checkKeyExists(data,'shareuser_id','device_id');
    let update = {
      where:{
        device_id:data.device_id,
        shareuser_id:data.shareuser_id,
      }
    }
    return await this.models.mysql.share_user.destroy(update);
  }
  //根据shareuser_id和device_id解绑
  async unbindShareUserByShareuserId(data){
    this.checkKeyExists(data,'shareuser_id','device_id');
    return await this.models.mysql.share_user.update({
        shareuser_id:null
      },
      {
        where:{
            device_id:data.device_id,
            shareuser_id:data.shareuser_id,
        }
    });
  }

}
module.exports = ShareUserDao;