// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var CreatorHelper = require("CreatorHelper");
var UnitTools = require("UnitTools");
var User = require("User");
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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.posCount = 4;
        this.headRoot = {};
        this.headSpUi = {};
        this.nameUi = {};
        this.scoreUi = {};
        for (var pos = 0;pos<this.posCount;pos++){
            this.headRoot[pos] = cc.find("headwig"+pos+"/head",this.node);
            this.headSpUi[pos] = cc.find("headwig"+pos+"/head/headframe/head",this.node);
            this.nameUi[pos] = cc.find("headwig"+pos+"/head/name",this.node);
            this.scoreUi[pos] = cc.find("headwig"+pos+"/head/score",this.node);
        }
        this.pInfos = {};//保存玩家信息
        this.clearToStart();

        Handler.instance().logicCom = this;
    },

    clearToStart(){
        for (var pos = 0;pos<this.posCount;pos++){
            this.headRoot[pos].active = false;
            this.nameUi[pos].getComponent(cc.Label).string = "";
            this.scoreUi[pos].getComponent(cc.Label).string = "";
        }
    },

    getScreenPos(selfLogicPos,logicPos){
        var myPos = selfLogicPos;
        var delta = new Number(myPos) - 2;
        var screenPos = new Number(logicPos) - delta;
        screenPos = screenPos<0?4+screenPos:screenPos;
        screenPos = screenPos>=4?screenPos-4:screenPos;
        return screenPos;

    },

    showHead(pId,scrPos,imgUrl,name){
        this.headRoot[scrPos].active = true;
        var sp = this.headSpUi[scrPos].getComponent(cc.Sprite);
        var nameLab = this.nameUi[scrPos].getComponent(cc.Label);
        CreatorHelper.changeSpriteFrameWithServerUrl(sp,imgUrl);
        nameLab.string = name;
        var info = UnitTools.getOrCreateJsonInJson(pId,this.pInfos);
        info.pos =scrPos;

    },

    hideHead(pId){
        var info = this.pInfos[pId];
        if (UnitTools.isNullOrUndefined(info))return;
        var pos = info.pos;
        this.headRoot[pos].active = false;
        this.nameUi[pos].getComponent(cc.Label).string = "";
        this.scoreUi[pos].getComponent(cc.Label).string = "";

    },

    normalStart(){
        // 显示头像
        var self = this;
        var inRoomInfo = User.loginToGameData.inRoomInfo;
        var heads = inRoomInfo.heads;
        User.playerId = inRoomInfo.playerId;
        User.pos = inRoomInfo.pos;
        UnitTools.forEach(heads,function (pos,pInfo) {
            self.showHead(pInfo.playerId,self.getScreenPos(User.pos,pos),pInfo.headimgurl,pInfo.nickname);
        });

    },


    start () {
        this.normalStart();
        // this.test();

    },

    test(){
        console.log("start");
        this.showHead(2,0,"http://i4.fuimg.com/583278/00e2ef22ec67b9b0.jpg","鸡蛋");
        this.showHead(3,1,"http://i4.fuimg.com/583278/00e2ef22ec67b9b0.jpg","鸡蛋");
        this.showHead(4,2,"http://i4.fuimg.com/583278/00e2ef22ec67b9b0.jpg","鸡蛋");
        this.showHead(5,3,"http://i4.fuimg.com/583278/00e2ef22ec67b9b0.jpg","鸡蛋");
    }

    // update (dt) {},
});
