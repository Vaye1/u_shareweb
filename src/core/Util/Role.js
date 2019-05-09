class Role{
	constructor(){
		this._role = new Map();
		this._repeatCheck = new Array();
		this._roleValue = new Map();
		this._formalRole = new Map();		
	}

	setDao(dao){
		this._dao = dao;
	}

	addRole(action,...role){
		if(this._repeatCheck.includes(action)){
			console.error(`[RoleManager]action:${action} is exists`);
		}else{
			this._repeatCheck.push(action);
			role.forEach((value)=>{
				if(this._role.has(value)){
					this._role.get(value).push(action);
				}else{
					this._role.set(value,Array.of(action));
				}
			});
			this._repeatCheck.forEach((role,index)=>{
				this._roleValue.set(role,Math.pow(2,index));
			});
			
			this._role.forEach((value,key)=>{
				let v = 0;
				value.forEach((action)=>{
					v += parseInt(this._roleValue.get(action),10);
				})
				this._formalRole.set(key,v)
			});
		}
	}


	async checkRole(data,action){
		let res=await this._dao.get('device').findRoleByUserId({user_id:data.user_id,device_id:data.device_id});
		if (res) {
			for (let i = 0; i < action.length; i++) {
				if(this._formalRole.has(res) && this._roleValue.has(action[i])){
					if(this._formalRole.get(res) & this._roleValue.get(action[i])){
						return true;
					}
				}
			}
			
		}
		return false;
	}
}
module.exports = Role;