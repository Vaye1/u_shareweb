const ProviderManager = require('iot-cloud-core').BASE.ProviderManager;
const Core = require("./core/CoreProvider")
const Data = require("./data/DataProvider")
class PublicManager extends ProviderManager{
	constructor(){
		super();
		this.put("Core", Core);
		this.put("Data", Data);
	}
}
module.exports = new PublicManager();