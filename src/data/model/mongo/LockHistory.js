const MongoBase = require('iot-cloud-core').DB.MongoBase;
class LockHistoryModel extends MongoBase {
  init() {
    let model = this.createTable('lock_history', {
      device_id:{type:Number},
      type:{type:String},
      mode:{type:Number},
      value:{type:JSON},
      time:{type:Date},
      create_time:{type:Date,default:Date.now},
      info:{type:JSON}
    });
    model.index({"type":1,"value":1});
    return model;
  }
}
module.exports = LockHistoryModel;