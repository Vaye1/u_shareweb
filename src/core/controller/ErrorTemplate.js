const errorConfig={
	'auth':[30001,'无效权限'],
	'tokenExpired':[30002,'token expired'],
	'sqlerror':[10001,'sql操作失败'],
	'paramsNull':[10002,'必传参数不存在'],
	'setpropNotFound':[30008,'设置类型不存在'],

	//用户有关
	'ProductNotFound':[51001, '该产品不存在'],

	//用户有关
	'userIsReg':[40001, '用户已存在'],
	'usernameOrPasswordWrong':[40002, '账号或密码错误'],
	'userNotFound':[50001, '该用户不存在'],
	'setpropError':[50007, '设置属性错误'],

	//绑定,分享有关
	'undefined':[50002,'没有找到要操作对象'],
	'userAlreadyBound':[50003,'您已绑定过该设备了'],
	'inviteNotFound':[50004,'邀请不存在'],
	'confirmedAlready':[50005,'邀请已接受过了'],
	'inviteCodeError':[50006,'code无效，请重新登录'],
	'unbind':[50010,'解绑失败，设备已解绑或不存在'],
	'inviteExpire':[50011,'邀请失效'],
	'connectFailed':[60001,'connect failed'],

	//设备管理
	'deviceNotFound': [80005, '该设备不存在'],
	'InfoNotFound': [80006, '该设备无详情'],
	'statusNotFound': [80007, '该设备没有设备状态'],
	'historyNotFound': [80008, '该设备没有历史记录(mongo)'],
	'deviceUnbind': [80010, '未绑定该设备'],
	'pushNotFound':[80011,'推送设置不存在'],
	'tempPwdError':[80013,'设置临时密码错误'],
	'publicKeyError':[80012,'无效加密参数'],
	'signError':[80015,'临时密码签名错误'],
	'setOptionError':[80014,'推送设置失败'],
	'fySetError':[80016,'飞燕设置失败'],
	'fyUnbindError':[80017,'飞燕解绑失败'],
	'UnbindError':[80018,'设备解绑失败'],

	//钥匙有关
	'keyNotFound': [80101, '开门记录不存在或已删除'],
	'keyBound': [80102, '开门记录已被绑定'],
	'keyUnbind': [80103, '记录已解绑'],
	'keySetFailed': [80103, '虚拟钥匙权限设置失败'],

	//虚拟用户相关错误
	'virtualUserNotFound': [81001, '虚拟用户不存在或已被删除'],
	'recordValueNotFound': [81002, '开门钥匙id不存在或已被删除'],
	'keyAlreadyBind': [81003, '虚拟钥匙已被绑定'],
	'virtualUserNotBind': [81004, '虚拟用户与虚拟钥匙绑定关系不存在'],
	'virtualUserAlreadyBind': [81005, '虚拟用户已被绑定'],

	//Oauth验证相关错误
	'Oauth_Name_Is_Not_Found': [80201, '授权名称不存在'],
	'Oauth_Username_Is_Not_Found': [80202, '授权用户不存在'],
	'Oauth_Code_Is_Not_Found': [80203, '授权码不存在'],
	'Oauth_Token_Is_Not_Found': [80204, '授权token不存在'],

	//第三方用户相关错误
	'thirdUserNotFound': [80301, '第三方用户不存在或已被删除'],
	'WXNotAuthor': [80302, '微信未授权'],

	//推送相关错误
	'deviceNotPush': [80401, '设备未开启推送'],

	//分享用户相关错误
	'shareUserIsBind': [80501, '分享用户已经绑定'],
	'AESDecryptIsNot': [80502, '授权码无效'],
	'phoneNumberUnlike': [80503, '手机号码不一致'],
	'shareUserIsMore': [80504, '共享用户不能超过20个'],
	'delShareUserError': [80505, '删除分享用户失败'],
	'bindShareUserError': [80506, '分享用户绑定失败'],
};

class ErrorTemplate{
	static error(data){
		let mb= errorConfig[data];
		this.error(mb[1], mb[0]);
	}
}
module.exports = ErrorTemplate;