const ControllerBase = require('iot-cloud-core').BASE.ControllerBase;
const PushData = require('iot-cloud-core').BASE.ControllerDecorator.PushData;
const config = require('./config');
const moment = require('moment');
const ServiceManager = require('iot-cloud-fs');
const Method = require('./public/Method');
const template = require('./ErrorTemplate');
const NoAuth = require('iot-cloud-core').BASE.ControllerDecorator.NoAuth;
const FYPublic = require('../public/FYPublic');

class CommunicationController extends ControllerBase {
    afterInit() {
        this.FYPublic = new FYPublic;
    }

    @PushData("FYDevice")
    async FYDeviceAction(data) {
        console.log("data-=================================");
        console.log(data);
        let fymsg={
            message:data,
            dataType:"PUSH",
            action:"push",
            mode:"fy_device",
            cType: "FYDevice",
        }
        ServiceManager.execAPPPush("20014", fymsg);
        data=JSON.parse(data.message);
        if (data.hasOwnProperty("bind")) {
            let iotId=data.iotId;
            let fybindmsg=data.bind;
            let idents=data.identityInfos;
            let productKey=data.productKey;
            let DeviceMsg=await this.FYPublic.getDeviceMsg({core:this.public.core,iotId:data.iotId,productKey:productKey});
            //调用飞燕接口获取设备信息之后的返回值，如果返回成功执行，返回失败结束
            if (DeviceMsg) {
                let productRes = await this.public.core.findProductByKey({product_key:productKey,product_name:config.defaultProductName});
                let product = productRes[0];
                let param = {
                    device_id:iotId,
                    device_name:DeviceMsg.name,
                    //mac:data.iotId,
                    parent_id:0,
                    product_id:product.id,
                    status:0,
                    device_state: data.action !== 'offline',
                    info:{
                      "options": {"open": 1, "ring": 1, "alarm": 1, "TemPwd": 1, "hijack": 1}, 
                      "nickname": config.defaultDeviceName,
                      "setting": {"weChat_push": 0}
                    }
                };
                let device = await this.public.core.findDeviceByPkAndName({product_key:productKey,device_name:DeviceMsg.name});
                device = device[0];
                if(!device){
                    device = await this.public.core.regDevice(param);
                }
                for (let i = 0; i < idents.length; i++) {
                    console.log("循环次数"+i);
                    //获取绑定信息
                    let usermsg = await this.public.core.findUserByUsername({username:idents[i].identityId});
                    if (usermsg) {
                        let bindmsg=await this.public.core.findBindInfo({user_id:usermsg.id,device_id:device.id});
                        //没有绑定信息
                        if (bindmsg==null || bindmsg.status==0) {
                            if (fybindmsg) {
                                if (idents[i].owned==1) {
                                    console.log("管理员绑定");
                                    //解绑其他管理员  
                                    await this.public.core.delBindByDeviceId({device_id:device.id});
                                    await this.dao.get('lock').expireInviteByDeviceId({device_id:device.id});
                                    await this.public.data.delHistory({device_id:device.id});
                                    await this.public.core.delSetMsgByDeviceId({device_id:device.id});
                                    await this.dao.get('virtualuser').delVirtualUserByDevice({device_id:device.id});
                                    await this.public.core.delShareUserByDeviceId({device_id:device.id});
                                    let bind = await this.public.core.userBind({user_id:usermsg.id,device_id:device.id,role:'SA'});
                                    if(bind){
                                        // await this.public.FY.TriggerService({iotId:device.device_id,identifier:"Bind",args:{result:1}});
                                        await this.FYPublic.TriggerService({
                                            core:this.public.core,
                                            iotId:iotId,
                                            identifier:"Bind",
                                            args:{result:1}
                                        });
                                        await this.public.core.createSetMsg({
                                            user_id: usermsg.id,
                                            device_id: device.id,
                                            type: "weChat_push",
                                            value:0,
                                            state:1,
                                            info: {}
                                        });
                                        //添加虚拟用户
                                        // let param = {
                                        //   nickname:"管理员",
                                        //   device_id:device.id,
                                        //   user_id:usermsg.id
                                        // };
                                        // let VirtualUser = await this.dao.get('virtualuser').adminVirtualUser(param);
                                        //重置推送设置,重置设备昵称
                                        await this.public.core.setDeviceInfo({id:device.id,info:{nickname:config.defaultDeviceName,options:config.defaultOptions}});
                                    }
                                }else{
                                    console.log("普通用户绑定")
                                    if(usermsg.mobile){
                                        let shareUser=await this.public.core.findShareUserByPhoneNumber({
                                            device_id: device.id,
                                            phoneNumber:usermsg.mobile
                                        })
                                        if (shareUser) {
                                            await this.public.core.bindShareUserById({
                                                id:shareUser.id,
                                                shareuser_id:usermsg.id
                                            })
                                        }
                                    }
                                    //普通用户绑定
                                    await this.public.core.userBind({user_id:usermsg.id,device_id:device.id,role:'A'});
                                    await this.public.core.createSetMsg({
                                        user_id: usermsg.id,
                                        device_id: device.id,
                                        type: "weChat_push",
                                        value:0,
                                        state:1,
                                        info: {}
                                    });
                                }
                            }else{
                                if (idents[i].owned==1) {
                                    console.log("管理员解绑1");
                                    await this.public.core.delSetMsgByDeviceId({device_id:device.id});
                                    await this.dao.get('virtualuser').delVirtualAndKeyByDevice({device_id:device.id});
                                    await this.dao.get('virtualuser').delVirtualUserByDevice({device_id:device.id});
                                    await this.public.core.delShareUserByDeviceId({device_id:device.id});
                                    //解绑所有用户
                                    await this.public.core.delBindByDeviceId({device_id:device.id});
                                    //邀请表无效化
                                    await this.dao.get('lock').expireInviteByDeviceId({device_id:device.id});
                                    //删除历史记录
                                    await this.public.data.delHistory({device_id:device.id});
                                    //设备信息初始化
                                    await this.public.core.setDeviceInfo({id:device.id,info:{nickname:config.defaultDeviceName,options:config.defaultOptions}});
                                }else{
                                    console.log("普通用户解绑2");
                                    await this.public.core.delShareUserByShareuserId({shareuser_id:usermsg.id,device_id:device.id})
                                    await this.dao.get('virtualuser').deleteVirtualUserBindById({device_id:device.id,user_id:usermsg.id});
                                    await this.public.core.delBindByDeviceIdAndUserId({device_id:device.id,user_id:usermsg.id});
                                    await this.public.core.delSetMsgByDeviceIdUserId({device_id:device.id,user_id:usermsg.id});
                                }
                            }
                        }else{//有绑定信息
                            if (fybindmsg) {
                                let role=bindmsg.role=="SA"?1:0;
                                if (role!=idents[i].owned) {
                                    if (idents[i].owned==1) {
                                        console.log("管理员绑定1");
                                        //解绑其他管理员
                                        await this.public.core.delBindByDeviceId({device_id:device.id});
                                        await this.dao.get('lock').expireInviteByDeviceId({device_id:device.id});
                                        await this.public.core.delSetMsgByDeviceId({device_id:device.id});
                                        await this.public.core.delShareUserByDeviceId({device_id:device.id});
                                        await this.public.data.delHistory({device_id:device.id});
                                        await this.dao.get('virtualuser').delVirtualUserByDevice({device_id:device.id});
                                        let bind = await this.public.core.userBind({user_id:usermsg.id,device_id:device.id,role:'SA'});
                                        if(bind){
                                            // await this.public.FY.TriggerService({iotId:device.device_id,identifier:"Bind",args:{result:1}});
                                            await this.FYPublic.TriggerService({
                                                core:this.public.core,
                                                iotId:iotId,
                                                identifier:"Bind",
                                                args:{result:1}
                                            });
                                            //添加虚拟用户
                                            // let param = {
                                            //   nickname:"管理员",
                                            //   device_id:device.id,
                                            //   user_id:usermsg.id
                                            // };
                                            // let VirtualUser = await this.dao.get('virtualuser').adminVirtualUser(param);
                                            //
                                            await this.public.core.createSetMsg({
                                                user_id: usermsg.id,
                                                device_id: device.id,
                                                type: "weChat_push",
                                                value:0,
                                                state:1,
                                                info: {}
                                            });
                                            //重置推送设置,重置设备昵称
                                            await this.public.core.setDeviceInfo({id:device.id,info:{nickname:config.defaultDeviceName,options:config.defaultOptions}});
                                        }
                                    }else{
                                        console.log("普通用户绑定1");
                                        if(usermsg.mobile){
                                            let shareUser=await this.public.core.findShareUserByPhoneNumber({
                                                device_id: device.id,
                                                phoneNumber:usermsg.mobile
                                            })
                                            if (shareUser) {
                                                await this.public.core.bindShareUserById({
                                                    id:shareUser.id,
                                                    shareuser_id:usermsg.id
                                                })
                                            }
                                        }
                                        //普通用户绑定
                                        await this.public.core.userBind({user_id:usermsg.id,device_id:device.id,role:'A'});
                                        await this.public.core.createSetMsg({
                                            user_id: usermsg.id,
                                            device_id: device.id,
                                            type: "weChat_push",
                                            value:0,
                                            state:1,
                                            info: {}
                                        });
                                    }
                                }
                            }else{
                                if (idents[i].owned==1) {
                                    console.log("管理员解绑");
                                    await this.dao.get('virtualuser').delVirtualAndKeyByDevice({device_id:device.id});
                                    await this.dao.get('virtualuser').delVirtualUserByDevice({device_id:device.id});
                                    await this.public.core.delSetMsgByDeviceId({device_id:device.id});
                                    await this.public.core.delShareUserByDeviceId({device_id:device.id});
                                    //解绑所有用户
                                    await this.public.core.delBindByDeviceId({device_id:device.id});
                                    //邀请表无效化
                                    await this.dao.get('lock').expireInviteByDeviceId({device_id:device.id});
                                    //删除历史记录
                                    await this.public.data.delHistory({device_id:device.id});
                                    //设备信息初始化
                                    await this.public.core.setDeviceInfo({id:device.id,info:{nickname:config.defaultDeviceName,options:config.defaultOptions}});
                                }else{
                                    console.log("普通用户解绑");
                                    await this.public.core.delShareUserByShareuserId({shareuser_id:usermsg.id,device_id:device.id})
                                    await this.public.core.delSetMsgByDeviceIdUserId({device_id:device.id,user_id:usermsg.id});
                                    await this.dao.get('virtualuser').deleteVirtualUserBindById({device_id:device.id,user_id:usermsg.id});
                                    await this.public.core.delBindByDeviceIdAndUserId({device_id:device.id,user_id:usermsg.id});
                                }
                            }
                        }
                    }
                }
            }
        }else{
            //没有设备则新建一个设备
            let productRes = await this.public.core.findProductByKey({product_key:data.productKey,product_name:config.defaultProductName});
            let product = productRes[0];
            let param = {
              device_id:data.iotId,
              device_name:data.deviceName,
              //mac:data.iotId,
              parent_id:0,
              product_id:product.id,
              status:0,
              device_state: data.action !== 'offline',
              info:{
                "options": {"open": 1, "ring": 1, "alarm": 1, "TemPwd": 1, "hijack": 1},
                "nickname": config.defaultDeviceName,
                "setting": {"weChat_push": 0}
              }
            };
            let device = await this.public.core.findDeviceByPkAndName({product_key:product.product_key,device_name:data.deviceName});
            device = device[0];
            if(!device){
              device = await this.public.core.regDevice(param);
            }
            if (data.identifier) {
                let newHis = {
                    device_id: device.id,
                    type: config.eventIdentifier[data.identifier].name,
                    mode: data.value.LockType ? data.value.LockType : config.eventIdentifier[data.identifier].mode,
                    value: data.value,
                    time: data.time,
                };
                if(data.identifier === 'DoorOpenNotification' || data.identifier === 'HijackingAlarm'){
                    // newHis.value = data.value.KeyID;
                    newHis.info = {key_string:data.value.KeyID.toString()+data.value.LockType.toString()}
                }
                let history = await this.public.data.addLockHistory(newHis);
                let info;
                try{
                    info=JSON.parse(device.info);
                }
                catch(err) {
                    info = device.info;
                };
                if(info && info.options && info.options[history.type]){
                    // 推送消息
                    // await Method.sendMsg.call(this,data.identifier,history);
                }
                if (config.WXpushIdentifier.indexOf(data.identifier)>=0&&info.setting&&info.setting.weChat_push==1){
                    let virtualuser;
                    if (data.identifier=="DoorOpenNotification"||data.identifier=="HijackingAlarm") {
                        virtualuser=await this.dao.get('virtualuser').getBindByKey({device_id:device.id,key_id:data.value.KeyID,key_type:data.value.LockType});
                        if (virtualuser) {
                            if(virtualuser.key_limit==3){
                                data.identifier="HijackingAlarm";
                            }
                            virtualuser=await this.dao.get('virtualuser').findVirtualUserById({device_id:device.id,virtualuser_id:virtualuser.virtualuser_id});
                        }
                        data.virtualuser=virtualuser?virtualuser:{nickname:"ID:"+data.value.KeyID};
                        virtualuser=virtualuser?virtualuser:{};
                    }else if(data.identifier=="DoorbellNotification"){
                        data.deviceName=info.nickname;
                    }
                    let deviceUser=await this.public.core.findBindUserByDeviceId({device_id:device.id});
                    for (let i = 0; i < deviceUser.length; i++) {
                        // let UserInfo= await this.public.core.searchById({uid:deviceUser[i].user_id});
                        // if (UserInfo.info.setting&&UserInfo.info.setting.weChat_push==1) {
                            let UserWXSet= await this.public.core.findSetMsgByDeviceIdUserIdType({user_id:deviceUser[i].user_id,device_id:device.id,type:"weChat_push"});
                            if (UserWXSet&&UserWXSet.value==1) {
                                if (data.identifier=="HijackingAlarm"&&deviceUser[i].user_id==virtualuser.user_id) {
                                }else if(data.identifier=="TemporaryPasswordNotification"&&deviceUser[i].role!="SA"){
                                }else{
                                    let ThirdUserMsg=await this.public.core.getThirdUserMsg({user_id:deviceUser[i].user_id,type:"wx"});
                                    if (ThirdUserMsg && JSON.parse(ThirdUserMsg.info).weChat_push==1) {
                                        let WXMsg=await this.public.core.findWXInfoByThirdId({thirduser_id:ThirdUserMsg.id,type:"wx_mp"});
                                        if(WXMsg&&WXMsg.state==1){
                                            let wxmsg=await this.public.FY.WXmsg({openid:WXMsg.username,data:data});
                                            await ServiceManager.execute("wxpush","push_wx", {appid:"10004_mp",msg:wxmsg});
                                        }
                                    }
                                }
                            }
                        // }
                    }
                }
            }
            //属性记录
            if(data.items){
                //修改属性表
                await this.dao.get('comm').updateProps({device_id:device.id,items:data.items});
            }
            //状态变更 上线/下线
            if(data.status){
                if(data.action === 'online' || data.action === 'offline'){
                    let device_state = Number(data.status.value);
                    this.public.core.updateDeviceState({device_id:device.id,device_state:device_state,login_time:moment()});
                }
            }
        }
        //飞燕平台期望数据{"code":200,"message":"success","data":"OK"}
        //如果URL接口未正确返回数据格式或HTTP CODE返回非200，那么平台会采用退避策略重新推送该消息，最多推送16次。
        return { sourceData: true, data: {"code":200,"message":"success","data":"OK"} };
    }

    
    @NoAuth
    async TmallGenieServiceAction(data) {
        console.log("data");
        console.log(data.params);
        let extra=JSON.parse(data.params.extra);
        // let extra=data.params.extra;
        let slotEntities=data.params.slotEntities;
        let DeviceList = await this.public.core.findDeviceListByUser({user_id:extra.user_id});
        if (DeviceList.length==0) {
            return { sourceData: true, data: { reply: "您还未绑定设备，无法查询" } };
        }
        let type;
        let incident;
        let DeviceId;
        for (let slotEntitie of slotEntities){
            if (slotEntitie.intentParameterName=="find") {
                type="find"
            }else if(slotEntitie.intentParameterName=="open"){
                incident="open"
            }else if(slotEntitie.intentParameterName=="Battery"){
                incident="Battery"
            }else if(slotEntitie.intentParameterName=="device_id"){
                DeviceId=slotEntitie.originalValue
            }
        }
        console.log(type,incident,DeviceId)
        if (type=="find") {
            if (incident=="open") {
                if (DeviceList.length==1) {
                    let device_id=DeviceList[0].device_id;
                    let msg = await this.public.FY.TmallGenie_History(device_id);
                    if (msg) {
                        return { sourceData: true, data: { reply: msg ,resultType:"RESULT"} };
                    }else{
                        return { sourceData: true, data: { reply: "您的设备还没有开门记录" ,resultType:"RESULT"} };
                    }
                }else if (DeviceList.length>1) {
                    let msg;
                    let DeviceListInfo={};
                    for (let j = 0; j < DeviceList.length; j++) {
                        let k=j+1;
                        if (msg) {
                            DeviceListInfo[Number(k)]=DeviceList[j].device_id;
                            msg=msg+"设备"+k+":"+DeviceList[j].device_name+",";
                        }else{
                            DeviceListInfo[Number(k)]=DeviceList[j].device_id;
                            msg="设备"+k+":"+DeviceList[j].device_name+",";
                        }
                    }
                    if (DeviceId) {
                        msg = await this.public.FY.TmallGenie_History(DeviceListInfo[DeviceId]);
                        if (msg) {
                            return { sourceData: true, data: { reply: msg ,resultType:"RESULT"} };
                        }else{
                            return { sourceData: true, data: { reply: "您的设备还没有开门记录" ,resultType:"RESULT"} };
                        }
                    }else{
                        return { sourceData: true, data: { reply: '您有多个设备,请选择,'+msg,resultType:"CONFIRM"} };
                    }
                }
            }else if (incident=="Battery") {
                if (DeviceList.length==1) {
                    let BatteryPercentage=await this.dao.get('lock').getStateByIdAndProp({device_id:DeviceList[0].device_id,prop_identifier:['BatteryPercentage']})
                    if (BatteryPercentage.length==0) {
                        return { sourceData: true, data: { reply: "无电量信息" ,resultType:"RESULT"} };
                    }
                    return { sourceData: true, data: { reply: `您的设备还剩余百分之`+BatteryPercentage[0].prop_value+"的电量" ,resultType:"RESULT"} };
                }else if (DeviceList.length>1) {
                    let msg;
                    let DeviceListInfo={};
                    for (let j = 0; j < DeviceList.length; j++) {
                        let k=j+1;
                        if (msg) {
                            DeviceListInfo[k]=DeviceList[j].device_id;
                            msg=msg+"设备"+k+":"+DeviceList[j].device_name+",";
                        }else{
                            DeviceListInfo[k]=DeviceList[j].device_id;
                            msg="设备"+k+":"+DeviceList[j].device_name+",";
                        }
                    }
                    if (DeviceId) {
                        let BatteryPercentage=await this.dao.get('lock').getStateByIdAndProp({device_id:DeviceListInfo[DeviceId],prop_identifier:['BatteryPercentage']})
                        if (BatteryPercentage.length==0) {
                            return { sourceData: true, data: { reply: "您的设备还没有电量信息" ,resultType:"RESULT"} };
                        }
                        return { sourceData: true, data: { reply: `您的设备还剩余百分之`+BatteryPercentage[0].prop_value+"的电量" ,resultType:"RESULT"} };
                    }else{
                        return { sourceData: true, data: { reply: '您有多个设备,请选择,'+msg,resultType:"CONFIRM"} };
                    }
                }
            }
        }else {
            return { sourceData: true, data: { reply: '还没有领悟你要说的呢',resultType:"RESULT"} };
        }
    }
    
    @PushData("WX")
    async WXserverAction(data) {
        console.log("微信公众关注信息")
        console.log("data")
        let OpenidList=data.xml.FromUserName;
        let EventList=data.xml.Event;
        for (let i = 0; i < OpenidList.length; i++) {
            let Openid=OpenidList[i];
            let Event=EventList[i]?EventList[i]:EventList[0];
            if (Event=="subscribe") {
                console.log("subscribe");
                let WXInfo=await this.public.core.findWXInfoByOpenidAndType({
                    type:"wx_mp",
                    openid:Openid
                })
                if (WXInfo) {
                    if (!WXInfo.state==1) {
                        await this.public.core.updateWXStateById({id:WXInfo.id,state:1})
                    }
                }else{
                    let WXmsg=await this.public.core.getWXInfo({type:"wx_mp",thirdmsg:Openid});
                    if (!WXmsg.errcode) {
                        let ThirdUserInfo=await this.public.core.findThirdUserByUsernameType({username:WXmsg.unionid,type:"wx"})
                        if (!ThirdUserInfo) {
                            ThirdUserInfo=await this.public.core.createThirdUsers({
                                user_id:null,
                                username:WXmsg.unionid,
                                type:"wx",
                                info:WXmsg,
                            })
                        }
                        await this.public.core.findOrCreateWXByUsername({
                            thirduser_id:ThirdUserInfo.id,
                            username:Openid,
                            type:"wx_mp",
                            info:WXmsg,
                        })
                    }
                }
            }else if (Event=="unsubscribe") {
                console.log("unsubscribe");
                let WXInfo=await this.public.core.findWXInfoByOpenidAndType({
                    type:"wx_mp",
                    openid:Openid
                })
                if (WXInfo) {
                    if (WXInfo.state!=0) {
                        await this.public.core.updateWXStateById({id:WXInfo.id,state:0})
                    }
                }
            }
        }
    }
}

module.exports = CommunicationController;