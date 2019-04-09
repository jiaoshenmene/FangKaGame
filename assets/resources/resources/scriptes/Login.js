// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

var UmengNative = require("UmengNative")
var UnitTools = require("UnitTools");
var Config = require("Config");
var PlatForm = require("PlatForm");
var TestLogin = require("TestLogin");
var LoginManager = require("LoginManager");
var Handler = require("Handler");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        xieyiCheck: cc.Toggle,//协议按钮
        weixinLoginBn: cc.Node,
        testLoginCom:TestLogin,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {


        
        if (!PlatForm.isAnroid() && !PlatForm.isIOS()) {
            this.testLoginCom.node.active = true;
            this.testLoginCom.setLoginEvent(function (account) {
                console.log("登陆按钮响应");
                console.log(account);
                LoginManager.testLogin(account);
            });
        }
        this.weixinLoginBn.on(cc.Node.EventType.TOUCH_START, function (args) {
            if (!this.xieyiCheck.isChecked)return;
            // UmengNative.weixinLogin(function (loginData) {
            //     cc.log("微信登录结果：")
            //     var openid = loginData.openid;
            //     var access_token = loginData.access_token;
            //     var refresh_token = loginData.refresh_token;

            //     UnitTools.request(Config.weixinLoginUrl, {
            //             openid: openid,
            //             access_token: access_token,
            //             refresh_token: refresh_token
            //         },
            //         function (err,data) {
            //
            //         },5000);
            // })

            var openid = "poiuytrewq";
            var access_token = "lkjhgfdsa";
            var refresh_token = "mnbvcxz";


            UnitTools.request(Config.weixinLoginUrl, {
                    openid: openid,
                    access_token: access_token,
                    refresh_token: refresh_token
                },
                function (err,data) {

                },5000);
        }, this);
    },

    start () {

    },

    // update (dt) {},
});
