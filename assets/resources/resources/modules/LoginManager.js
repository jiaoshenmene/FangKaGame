
var UnitTools = require("UnitTools");
var Config = require("Config");
var NetWorkManager = require("NetWorkManager");



class LoginManager {
    weixinLogin(){

    }

    // 调用服务器的测试登陆接口， 创建或者返回一个测试账号登陆的结果
    static testLogin(account){
        console.log("account + " + account);
        UnitTools.request(Config.testLoginUrl,{account:account},function (err,data) {
            if (err){
                console.log("登陆错误");
                console.log(data);
                return;
            }
            console.log(data);
            //连接大厅服务器
            data = JSON.parse(data);
            NetWorkManager.connectAndAuthToHall(data.account,data.pass,"ws://"+data.hallUrl);
            NetWorkManager.onConnectedToHall(function () {
                cc.director.loadScene("hall");
            })



        },5000);


    }

}

module.exports = LoginManager;