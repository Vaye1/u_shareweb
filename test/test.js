let request = require('supertest')('http://192.168.2.254:3000/openapi/public/10001');
const assert = require('power-assert');
describe("测试用户模块",()=>{
	it("注册正常",(done)=>{
		request.post("/user/reg").send({username:"felix",pwd:"1123123"}).end((err, res) => {
			if (err) return done(err);
			let statusCodeError = `请求状态错误:${res.statusCode}`;
			assert(res.statusCode === 200,statusCodeError);
			const result = res.body;
			assert(result.code === 0,result.msg);
			assert(result.data.username != undefined);
			assert(result.data.nickname != undefined);
			assert(result.data.head != undefined);
			assert(result.data.utoken != undefined);
			return done();
		});
	});

	it("登录",(done)=>{
		request.post("/user/login").send({username:"felix",pwd:"1123123"}).end((err, res) => {
			if (err) return done(err);
			let statusCodeError = `请求状态错误:${res.statusCode}`;
			assert(res.statusCode === 200,statusCodeError);
			const result = res.body;
			assert(result.code === 0,result.msg);
			assert(result.data.username != undefined);
			assert(result.data.nickname != undefined);
			assert(result.data.head != undefined);
			assert(result.data.utoken != undefined);
			token = result.data.utoken;
			return done();
		});
	});


	it("自动登录",(done)=>{
		request.post("/user/verLogin")
		.set('authorization', 'JWT '+token)
		.send({token:token}).end((err, res) => {
			if (err) return done(err);
			let statusCodeError = `请求状态错误:${res.statusCode}`;
			assert(res.statusCode === 200,statusCodeError);
			const result = res.body;
			assert(result.code === 0,result.msg);
			assert(result.data.utoken != undefined);
			return done();
		});
	});


});