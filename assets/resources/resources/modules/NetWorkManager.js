/**
 * Created by litengfei on 2018/1/18.
 */
var AutoReconnectWsRpcClient = require("AutoReconnectWsRpcClient");
var User = require("User");
var EventEmitter = require("EventEmitter")
var Handler = require("Handler");
class NetWorkManager{
    static connectAndAuthToHall(account,pass,url) {//cb 2params baseinfo service
        if (NetWorkManager.g_HallService === null) {
            NetWorkManager.g_HallService = new AutoReconnectWsRpcClient();
            NetWorkManager.g_HallService.connect(url);
            NetWorkManager.g_HallService.onClose(function () {
                //连接中断
                NetWorkManager.g_HallServiceIsLogin = false;
                NetWorkManager.events.emit("closeFromHall");
                NetWorkManager.connectAndAuthToHall(account,pass,url);
            })
        }
        NetWorkManager.g_HallService.onReady(function (service) {
            service.proxy.login(account,pass,function (data) {
                if(data.ok&&data.suc){
                    console.log("onReady hall");
                    NetWorkManager.g_HallServiceIsLogin = true;
                    User.account = account;
                    User.pass = pass;
                    User.nickName = data.info.nickname;
                    User.headUrl = data.info.headimgurl;
                    User.fangka = data.info.score;
                    User.sex = data.info.sex;
                    NetWorkManager.events.emit("loginToHall",service);
                }
            })
        })
    }

    static onConnectedToHall(cb){//cb 1param service
        console.log("onConnectedToHall hall");
        if(NetWorkManager.g_HallServiceIsLogin){
            cb(NetWorkManager.g_HallService);
            return;
        }
        NetWorkManager.events.on("loginToHall",cb);
    }

    static offConnectedToHall(cb){
        NetWorkManager.events.off(cb);
    }

    static onClosedFromHall(cb){//cb 1param service
        NetWorkManager.events.on("closeFromHall",cb);
    }

    static  offClosedFromHall(cb){
        NetWorkManager.events.off(cb);
    }

    static clearHallService() {//清理当前大厅的连接
        NetWorkManager.events = new EventEmitter();
        NetWorkManager.g_HallServiceIsLogin = false;
        if (NetWorkManager.g_HallService) NetWorkManager.g_HallService.clear();
    }

    // ---------------------- 游戏服务网络 ---------------------------------

    static connectAndAuthToGame(account,pass,url) { //cb 2params baseinfo service
        if (NetWorkManager.g_GameService === null) {
            NetWorkManager.g_GameService = new AutoReconnectWsRpcClient();
            NetWorkManager.g_GameService.addRpc(Handler.service);
            NetWorkManager.g_GameService.connect(url);
            NetWorkManager.g_GameService.onClose(function () {
                //连接中断
                NetWorkManager.g_GameServiceIsLogin = false;
                NetWorkManager.events.emit("closeFromHall");
                NetWorkManager.connectAndAuthToHall(account,pass,url);
            })
        }
        NetWorkManager.g_GameService.onReady(function (service) {
            service.proxy.login(account,pass,function (data) {
                if(data.ok&&data.suc){
                    NetWorkManager.g_GameServiceIsLogin = true;
                    User.account = account;
                    User.pass = pass;
                    User.nickName = data.info.nickname;
                    User.headUrl = data.info.headimgurl;
                    User.fangka = data.info.score;
                    User.sex = data.info.sex;
                    User.loginToGameData = data;
                    NetWorkManager.gamevents.emit("loginToGame",service);
                }
            })
        })
    }

    static onConnectedToGame(cb){//cb 1param service
        if (NetWorkManager.g_GameServiceIsLogin){
            cb(NetWorkManager.g_GameService);
            return;
        }
        NetWorkManager.gamevents.on("loginToGame",cb);
    }

    static offConnectedToGame(cb){
        NetWorkManager.gamevents.off(cb);
    }

    static onClosedFromGame(cb){//cb 1param service
        NetWorkManager.gamevents.on("closeFromHall",cb);
    }

    static offClosedFromGame(cb){
        NetWorkManager.gamevents.off(cb);
    }

    static clearGameService(){//清理当前大厅的链接
        NetWorkManager.gamevents = new EventEmitter();
        NetWorkManager.g_GameServiceIsLogin = false;
        if (NetWorkManager.g_GameService) NetWorkManager.g_GameService.clear();
    }


}
NetWorkManager.g_HallService = null;
NetWorkManager.g_HallServiceIsLogin = false;
NetWorkManager.events = new EventEmitter();

NetWorkManager.g_GameService = null;
NetWorkManager.g_GameServiceIsLogin = false;
NetWorkManager.gamevents = new EventEmitter();


module.exports = NetWorkManager;