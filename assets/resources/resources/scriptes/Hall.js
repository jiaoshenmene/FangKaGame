// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var NetWorkManager = require("NetWorkManager");
var CreatorHelper = require("CreatorHelper");
var User = require("User");

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
        headSprite:cc.Sprite, //头像图片
        playerName:cc.Label, //玩家名字
        playerId:cc.Label,      //玩家Id
        fangkaNum:cc.Label,   //房卡数量
        createRoomBn:cc.Node,  //
        enterRoomBn:cc.Node,
        checkQingyise:cc.Toggle,
        checkZimo:cc.Toggle,//只允许自摸
        createConfirm:cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var self = this;
        CreatorHelper.setNodeClickEvent(this.createConfirm,function () {
            console.log("点击创建");
            var custom = {};
            custom.qingyise = self.checkQingyise.isChecked;
            custom.zimo = self.checkZimo.isChecked;
            //调用服务器方法，来创建房间
            NetWorkManager.onConnectedToHall(function (hallService) {
                hallService.proxy.createRoom(custom,function (data) {
                    console.log(data);
                    if (data.ok&&data.suc){
                        NetWorkManager.connectAndAuthToGame(User.account,User.pass,data.url);
                        NetWorkManager.onConnectedToGame(function () {//连接游戏服务器
                            var loginData = User.loginToGameData;
                            if (loginData.isInGame){//在游戏里，跳转到游戏界面
                                cc.director.loadScene("game");
                            } else { // 不在服务器，提示创建失败
                                NetWorkManager.clearGameService();
                            }

                        });
                    } else { // 创建失败提示

                    }
                });
            })
        });
        // ------------------------ 加入房间 ------------------------------
        var self = this;
        this.clickCount = 0;

        var clearInput = function () {
            self.clickCount = 0;
            for(var num = 0;num<=5;num++){
                var numUi = cc.find(""+num,self.shownumsUi);
                var numLab = cc.find("txt",numUi).getComponent(cc.Label);
                numLab.string = "";
            }
        };
        this.shownumsUi = cc.find("joinroot/joinbg/shownums",this.node);

        CreatorHelper.setNodeClickEvent(this.enterRoomBn,function () {//点击加入，清空界面
            clearInput();

        })

        this.inputnumsUi = cc.find("joinroot/joinbg/inputnums",this.node);
        for (var num=0;num<=9;num++){
            var numUi = cc.find(""+num,this.inputnumsUi);
            CreatorHelper.setNodeClickEvent(numUi,function (evt) {
                var clickNum = evt.name;
                console.log("点击了：");
                console.log(clickNum);
                var numUi = cc.find(""+self.clickCount,self.shownumsUi);
                var numLab = cc.find("txt",numUi).getComponent(cc.Label);
                numLab.string = clickNum;
                self.clickCount+=1;
                if (self.clickCount == 6){//大厅服务加入房间

                }

            });
        }

        var reinputUi = cc.find("reinput",this.inputnumsUi);
        var deleteUi = cc.find("delete",this.inputnumsUi);
        CreatorHelper.setNodeClickEvent(reinputUi,function (evt) {
            console.log("点击了重输");
            clearInput();
        })
        CreatorHelper.setNodeClickEvent(deleteUi,function (evt) {
            console.log("点击了删除");
            if (self.clickCount == 0)return;
            self.clickCount-=1;
            var numUi = cc.find(""+self.clickCount,self.shownumsUi);
            var numLab = cc.find("txt",numUi).getComponent(cc.Label);
            numLab.string = "";
        })
    },


    start () {
        var self = this;
        NetWorkManager.onConnectedToHall(function (hallService) {
            hallService.proxy.getPlayerBaseInfo(function (data) {
                if (data.ok && data.suc) { // 成功
                    var baseInfo = data.info;
                    self.playerName.string = baseInfo.nickname;
                    self.playerId.string = baseInfo.id;
                    self.fangkaNum.string = baseInfo.score;
                    var headimgurl = baseInfo.headimgurl;
                    //头像
                    CreatorHelper.changeSpriteFrameWithServerUrl(self.headSprite,headimgurl);


                } else {    // 失败

                }
            });
        })

    },

    // update (dt) {},
});
