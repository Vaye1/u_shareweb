const PublicFunBase = require('iot-cloud-core').BASE.PublicFunBase;
class Public extends PublicFunBase{
	/*
	*	设置系统参数
	*/


	//data文件夹下的Public.js调用data文件夹中的OptionsDao.js文件中的方法
// async setOption(data){
//   	console.log('PublicsetOption');

//    	await this.dao.get('options').setOption();
	   	//					   ↑		  ↑
	   	//					   ↑	OptionsDao.js中的setOption方法
	   	// 所有的Dao要使用需要在DataProvider中进行注册否则无法调用   
	    
	// }
	//         括号内data接收controller中返回的数据

	//添加历史数据
	async addHistory(data){
		let addHistory = await this.dao.get('datapublic').addHistory(data);
		return addHistory;

	}
	//获得历史数据
	async getHistoryList(data){
		//变量接收getHistoryList
		let getHistoryList = await this.dao.get('datapublic').getHistoryList(data);
		//返回getHistoryList
		return getHistoryList;

	}
	//获取历史数据（聚合函数）
	async getHistoryByAggregaate(data){
		let getHistoryByAggregaate= await this.dao.get('datapublic').getHistoryByAggregaate(data);
		return getHistoryByAggregaate;
	}


	//删除历史数据
	async delHistory(data){
		//变量接收delHistory
		let delHistory = await this.dao.get('dataHistory').delHistory(data);
		//返回delHistory
		return delHistory;
	}



	//设置Option
	async setOption(key,value,expire = null){
		//变量接收setOption
		let setOption = await this.dao.get('dataOption').setOption(key,value,expire);
		//返回setOption
		return setOption;
		
	}

	//获得Option
	async getOption(key){
		//变量接收getOption
		let getOption = await this.dao.get('dataOption').getOption(key);
		//返回getOption
		return getOption;
	}

	async getOptions(...keys){
        let getOptions = await this.dao.get('dataOption').getOption(keys);
        return getOptions;

    }


    async addTestHistory(){
	     return await this.dao.get('datapublic').addTestHistory();
    }

    async addLockHistory(data){
	    return await this.dao.get('dataHistory').addLockHistory(data);
    }

    async getLockHistory(data){
      return await this.dao.get('dataHistory').getLockHistory(data);
    }

    async getHistoryByKey(data){
      return await this.dao.get('dataHistory').getHistoryByKey(data);
    }
}
module.exports = Public;