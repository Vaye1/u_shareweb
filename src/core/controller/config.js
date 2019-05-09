const debug = true;
const config = {
	private_key:111111,//登录验证私钥
	shareUser_AES_key:'0123456789abcdef0123456789abcdef',//分享用户AES加密的key
    //用户权限
    role: {
		0: 'SA', //管理员
		1: 'A', //普通用户
		SA: 0, //管理员
		A: 1, //普通用户
		},
		CryptoJS_AES:{
			key:"01234567890123456789abcdefabcdef",
			refresh_key:"abcdefabcdef01234567890123456789"
		}
};

module.exports = config;