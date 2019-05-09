const DaoBase = require('iot-cloud-core').BASE.DaoBase;
const mongoose = require('mongoose');
const moment = require('moment');
class DataHistoryDao extends DaoBase{

  //添加历史数据
  //data接收Public中返回的data数据
  async addLockHistory(data){
    try{
      return await this.models.mongo.lock_history.create(data);
    }catch(e){
      console.log(e);
      return false;
    }
  }

  //获取不同种类的历史记录
  async getLockHistory(data){
    this.checkKeyExists(data,'device_id','type','page_size');
    let update = {
        device_id:data.device_id,
        type: data.type,
    };
    if(data.mode){
      update.mode = data.mode;
    }
    if(data.start_id){
      update._id = {
        $lt:mongoose.Types.ObjectId(data.start_id)
      }
    }
    let projection = {
      type:1,
      mode:1,
      value:1,
      time:1,
      create_time:1,
      info:1,
    };
    return await this.models.mongo.lock_history.find(update,projection).limit(Number(data.page_size)).sort({create_time:-1});
  }
    //删除历史数据
  async delHistory(data){
    let update={};
    if (!data.id&&!data.device_id) {
      return false;
    }
    if (data.id) {
      update={
        _id:mongoose.Types.ObjectId(data.id)
      }
    }
    if (data.device_id) {
      update={
        device_id:data.device_id
      };
    }
    let delHistory = await this.models.mongo.lock_history.remove(update);
    //返回delHistory
    return true;
  }
  //根据开门钥匙获取开门记录
  async getHistoryByKey(data){
    this.checkKeyExists(data,'key','device_id','page_size','start_id','type');
    let key_string = data.key.map(item=>{
      return item.key_id.toString()+item.key_type.toString();
    });
    let update = {
      "device_id": data.device_id,
      // "type": 'open',
      "type": {$in:['open','hijack']},
      "time":{$gt:moment().format('YYYY-MM-DD 00:00:00')}
      // "info.key_string": {$in: key_string},
    };
    if(data.type === 'bind'){
      // 获取绑定的
      update["info.key_string"] = {$in: key_string}
    }else{
      // 获取绑定之外的
      update["info.key_string"] = {$nin: key_string}
    }
    //为0时才插入
    if (data.start_id) {
      update._id = {
        $lt: mongoose.Types.ObjectId(data.start_id)
      }
    }
    let projection = {
      type: 1,
      mode: 1,
      value: 1,
      create_time: 1,
      time: 1,
    };
    return await this.models.mongo.lock_history.find(update,projection).limit(Number(data.page_size)).sort({create_time:-1});
  }
}
module.exports = DataHistoryDao;
