const Provider = require('iot-cloud-core').BASE.Provider;

const db_LockHistory = require('./model/mongo/LockHistory');

const dao_dataHistory = require('./dao/DataHistoryDao');

const public_class = require('./public/Public');

class DataProvider extends Provider{
	constructor(dbManager){
		super("data",dbManager);

		this.registerModel(db_LockHistory);

		this.registerDao("dataHistory",dao_dataHistory);

		this.setPublicClass(public_class);
	}
}
module.exports = DataProvider;