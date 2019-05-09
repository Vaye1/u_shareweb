const ControllerBase = require('iot-cloud-core').BASE.ControllerBase;
const NoAuth = require('iot-cloud-core').BASE.ControllerDecorator.NoAuth;
const ServiceManager = require('iot-cloud-fs');

class ProductController extends ControllerBase {
  	afterInit() {
		this.ProductInfo=this.getConfig().ProductInfo;
  	}
	/** 获取产品详情 √√√
	 * 获取产品详情
	 * @returns
		 
	*/
  	@NoAuth
  	async getProductAction(data){
		if (data.params.product_key) {
			let ProductMsg = await this.public.core.findProductByProductKey({product_key:data.params.product_key});
			if (!ProductMsg) {
				//报错
				// this.error("没有找到产品信息",50001);
				let info={
					assets:this.ProductInfo[data.params.product_key]?this.ProductInfo[data.params.product_key].url:this.ProductInfo.default.url
				};
				let res={
					product_id:null,
					product_name:null,
					product_key:data.params.product_key,
					product_info: info
				}
				return res;
			}
			if(ProductMsg.info==null || ProductMsg.info=="{}" || ProductMsg.info==""){
				await this.public.core.updateProductInfoById({
					id:ProductMsg.id,
					info:{
						assets:this.ProductInfo[data.params.product_key]&&this.ProductInfo[data.params.product_key].url?this.ProductInfo[data.params.product_key].url:this.ProductInfo.default.url
					},
				})
				ProductMsg.info={assets:this.ProductInfo[data.params.product_key]&&this.ProductInfo[data.params.product_key].url?this.ProductInfo[data.params.product_key].url:this.ProductInfo.default.url};
			}
			let res={
				product_id:ProductMsg.id,
				product_name:ProductMsg.product_name,
				product_key:ProductMsg.product_key,
				product_info: ProductMsg.info? JSON.parse(ProductMsg.info):{}
			}
			return res;
		}else if (data.params.product_id) {
			let ProductMsg = await this.public.core.findProductByid({product_id:data.params.product_id});
			if (!ProductMsg) {
				//报错
				// this.error("没有找到产品信息",50001);
				let info={
					assets:this.ProductInfo.default.url
				}
				let res={
					product_id:data.params.product_id,
					product_name:null,
					product_key:null,
					product_info: info
				}
				return res;
			}
			if(ProductMsg.info==null || ProductMsg.info=="{}" || ProductMsg.info==""){
				await this.public.core.updateProductInfoById({
					id:ProductMsg.id,
					info:{
						assets:this.ProductInfo[ProductMsg.product_key]&&this.ProductInfo[ProductMsg.product_key].url?this.ProductInfo[ProductMsg.product_key].url:this.ProductInfo.default.url
					}
				})
				ProductMsg.info = {assets:this.ProductInfo[ProductMsg.product_key]&&this.ProductInfo[ProductMsg.product_key].url?this.ProductInfo[ProductMsg.product_key].url:this.ProductInfo.default.url};
			}
			let res={
				product_id:ProductMsg.id,
				product_name:ProductMsg.product_name,
				product_key:ProductMsg.product_key,
				product_info: ProductMsg.info? JSON.parse(ProductMsg.info):{}
			}
			return res;
		}else{
			this.error("必传参数不存在",10002);
		}
		return res;
	}
	
	/** 获取产品列表 √√√
	 * 获取产品列表
	 * @returns
		 
	*/
	@NoAuth
	async getProductsAction(data){
		let ProductsMsg=await this.dao.get('product').findProducts({});
		let ProductsList=[];
		for(let i = 0; i < ProductsMsg.length; i++){
			let ProductMsg=ProductsMsg[i];
			if(ProductMsg.info==null || ProductMsg.info=="{}" || ProductMsg.info==""){
				ProductMsg.info={};
				await this.public.core.updateProductInfoById({
					id:ProductMsg.id,
					info:{
						assets:this.ProductInfo[ProductMsg.product_key]&&this.ProductInfo[ProductMsg.product_key].url?this.ProductInfo[ProductMsg.product_key].url:this.ProductInfo.default.url
					},
				})
				ProductMsg.info={assets:this.ProductInfo[ProductMsg.product_key]&&this.ProductInfo[ProductMsg.product_key].url?this.ProductInfo[ProductMsg.product_key].url:this.ProductInfo.default.url};
			}else{
				ProductMsg.info=JSON.parse(ProductMsg.info);
				ProductMsg.info.assets=this.ProductInfo[ProductMsg.product_key]&&this.ProductInfo[ProductMsg.product_key].url?this.ProductInfo[ProductMsg.product_key].url:this.ProductInfo.default.url;
			}
			let ProductInfo={
				product_id:ProductMsg.id,
				product_name:ProductMsg.product_name,
				product_key:ProductMsg.product_key,
				product_info: ProductMsg.info? ProductMsg.info:{}
			}
			ProductsList.push(ProductInfo)
		}
		return ProductsList;
	}
}

module.exports = ProductController;