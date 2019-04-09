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
var Majiang = require("Chess").Majiang;

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
        handCardsPfb:{
            default:[],
            type:cc.Prefab
        },
        cardImages:cc.SpriteAtlas
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

        this.handCardsUi = cc.find("handcards",this.node);  //手里牌的ui的根结点


        this.pInfos = {};//保存玩家信息
        this.clearToStart();
        Handler.instance().logicCom = this;

        this.handCardsPos = this.createHandCardPos();
        this.createHitCardPos();
        this.selfHandCard = new Array(34);
        for (var i = 0; i < 34;i++){
            this.selfHandCard[i] = {};//11:{ui:};
        }
    },

    clearToStart(){
        for (var pos = 0;pos<this.posCount;pos++){
            this.headRoot[pos].active = false;
            this.nameUi[pos].getComponent(cc.Label).string = "";
            this.scoreUi[pos].getComponent(cc.Label).string = "";
        }
    },
    createHandCardPos(){//创建所有位置手里牌的位置
        var posArray = new Array(this.posCount);
        posArray[0] = {startPos:{x:294,y:208},offset:{x:-40,y:0},lastOffset:{x:-20,y:0}};
        posArray[1] = {startPos:{x:-429,y:253},offset:{x:0,y:-29},lastOffset:{x:0,y:-20}};
        posArray[2] = {startPos:{x:-576,y:-347},offset:{x:82,y:0},lastOffset:{x:20,y:0}};
        posArray[3] = {startPos:{x:429,y:-193},offset:{x:0,y:29},lastOffset:{x:0,y:20}};

        var handCardsPos = new Array(this.posCount);
        for(var pos = 0;pos<this.posCount;pos++){
            var cardPos = new Array(14);
            handCardsPos[pos] = cardPos;
            for(var index = 0;index<14;index++){
                var position = cardPos[index] = {};
                var config = posArray[pos];
                position.x = config.startPos.x + index * config.offset.x;
                position.y = config.startPos.y + index * config.offset.y;

                if(index == 13){//最后摸的牌
                    position.x+= config.lastOffset.x;
                    position.y+= config.lastOffset.y;
                }
            }
        }
        return handCardsPos;
    },

    createHitCardPos(){ //创建所有位置打出去牌的位置

    },
    createHandCardUi(pos,cardIndex){
        var pfb = this.handCardsPfb[pos];
        var cardUi = cc.instantiate(pfb);
        if(pos == 2){
            //修改sprteFrame
            var sp = this.cardImages.getSpriteFrame(Majiang.smCard(cardIndex))
            cardUi.getComponent(cc.Sprite).spriteFrame = sp;
        }
        return cardUi;

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

    adjustSelfHandCard(){
        var cardCount = 0;
        for (var i = 33; i >= 0;i--){
            var cards = this.selfHandCard[i];
            for (var cardIndex in cards){
                cardIndex = parseInt(cardIndex);
                var ui = cards[cardIndex].ui;
                var index = 12 - cardIndex;
                cardCount+=1;
                var pos = this.handCardsPos[2][index];
                ui.x = pos.x;
                ui.y = pos.y;
            }
        }
    },

    normalStart(){
        // 显示头像
        var self = this;
        var inRoomInfo = User.loginToGameData.inRoomInfo;
        cc.log("gameLogic->normalStart->loginToGameData:%o",User.loginToGameData);
        var heads = inRoomInfo.heads;
        User.playerId = inRoomInfo.playerId;
        User.pos = inRoomInfo.pos;
        UnitTools.forEach(heads,function (pos,pInfo) {
            self.showHead(pInfo.playerId,self.getScreenPos(User.pos,pos),pInfo.headimgurl,pInfo.nickname);
        });

        var frames = inRoomInfo.frames;
        //处理frames里的消息（历史消息）
        for (var idx in frames){
            var frame = frames[idx];
            Handler.instance()["handle"+frame.eventName](frame.data);
        }
        //处理，消息队列里的消息

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

        //-----------------手里牌测试----------------------
        for(var i = 0;i<14;i++){
            var cardUi = this.createHandCardUi(2,19);
            var pos = this.handCardsPos[2][i];
            cardUi.x = pos.x;cardUi.y = pos.y;
            this.handCardsUi.addChild(cardUi);

            var cardUi = this.createHandCardUi(0,19);
            var pos = this.handCardsPos[0][i];
            cardUi.x = pos.x;cardUi.y = pos.y;
            this.handCardsUi.addChild(cardUi);

            var cardUi = this.createHandCardUi(1,19);
            var pos = this.handCardsPos[1][i];
            cardUi.x = pos.x;cardUi.y = pos.y;
            this.handCardsUi.addChild(cardUi);


            var cardUi = this.createHandCardUi(3,19);
            var pos = this.handCardsPos[3][i];
            cardUi.x = pos.x;cardUi.y = pos.y;
            cardUi.zIndex = 14 - i;
            this.handCardsUi.addChild(cardUi);
        }

    },

    update (dt) {
        console.log("eventQueue = %o",Handler.instance().eventQueue);
        for(var idx  in Handler.instance().eventQueue){
            var frame = Handler.instance().eventQueue[idx];
            console.log("handle"+frame.evetnName);

            Handler.instance()["handle"+frame.evetnName](frame.data);
        }
        Handler.instance().eventQueue = [];//清空消息队列
    },
});
