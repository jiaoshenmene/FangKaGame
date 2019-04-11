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
var NetWorkManager = require("NetWorkManager");

//声明
//type 1 表示自己  2 表示其他位置

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
        hitCardsPfb:{
            default:[],
            type:cc.Prefab
        },
        gangpengPfb:{
            default:[],
            type:cc.Prefab
        },
        actionSelectPfb:cc.Prefab,
        actionImages:{
            default:[],
            type:cc.SpriteFrame
        },
        actionSplashPfb:cc.Prefab,
        splashImages:{
            default:[],
            type:cc.SpriteFrame
        },
        cardImages:cc.SpriteAtlas
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.posCount = 4;
        this.selfPos = 2;
        this.headRoot = {};
        this.headSpUi = {};
        this.nameUi = {};
        this.scoreUi = {};
        this.selectaActionUi = cc.find("actionselectui",this.node);//动作选择UI
        for(var pos = 0;pos<this.posCount;pos++){
            this.headRoot[pos] = cc.find("headwig"+pos+"/head",this.node);
            this.headSpUi[pos] = cc.find("headwig"+pos+"/head/headframe/head",this.node);
            this.nameUi[pos] = cc.find("headwig"+pos+"/head/name",this.node);
            this.scoreUi[pos] = cc.find("headwig"+pos+"/head/score",this.node);
        }
        this.handCardsUi = cc.find("handcards",this.node);//手里牌的ui根节点
        this.hitCardsUi = cc.find("hitcards",this.node);//出牌的Ui根节点
        this.gangpegnCardsUi = cc.find("gangpengcards",this.node);//杠碰的牌
        this.splashsUi = cc.find("splashs",this.node);//杠碰闪烁提示
        this.turnTime = cc.find("turntime",this.node);//指针
        this.pInfos = {};//保存玩家信息

        Handler.instance().logicCom = this;

        this.handCardsPos = this.createHandCardPos();
        this.hitCardsPos = this.createHitCardPos();
        this.gangpengCardsPos = this.createGangpegnCardPos();
        this.splashPos = this.createSplashPos();

        this.selfHandCard = new Array(34);
        this.hitCards = {};
        for(var i = 0;i<34;i++) {
            this.selfHandCard[i] = {};//{11:{ui:}};
        }
        this.handCards = new Array(this.posCount);//[{cardIndex,ui}]
        this.clearToStart();
    },
    clearToStart(){
        for(var pos = 0;pos<this.posCount;pos++) {
            this.headRoot[pos].active = false;
            this.nameUi[pos].getComponent(cc.Label).string = "";
            this.scoreUi[pos].getComponent(cc.Label).string = "";
            this.hitCards[pos] = {};
            var cards = this.handCards[pos] = new Array(14);
            cards.fill(null);
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
    createHitCardPos(){//创建所有位置打出去牌的位置
        var posArray = new Array(this.posCount);
        posArray[0] = {startPos:{x:175,y:70},offset:{x:-35,y:0},lineOffset:{x:0,y:42}};
        posArray[1] = {startPos:{x:-180,y:150},offset:{x:0,y:-29},lineOffset:{x:-47,y:0}};
        posArray[2] = {startPos:{x:-175,y:-80},offset:{x:35,y:0},lineOffset:{x:0,y:-41}};
        posArray[3] = {startPos:{x:180,y:-150},offset:{x:0,y:29},lineOffset:{x:47,y:0}};
        var hitCardsPos = new Array(this.posCount);
        for(var pos = 0;pos<this.posCount;pos++){
            var cardPos = new Array(25);
            hitCardsPos[pos] = cardPos;
            for(var index = 0;index<25;index++){
                var position = cardPos[index] = {};
                var config = posArray[pos];
                var line = parseInt(index/10);
                var lineIndex = index%10;
                position.x = config.startPos.x + lineIndex * config.offset.x + config.lineOffset.x * line;
                position.y = config.startPos.y + lineIndex * config.offset.y + config.lineOffset.y * line;

            }
        }
        return hitCardsPos;
    },
    createGangpegnCardPos(){//创建杠碰牌的位置
        var posArray = new Array(this.posCount);
        posArray[0] = {startPos:{x:294,y:208},offset:{x:-130,y:0}};
        posArray[1] = {startPos:{x:-449,y:253},offset:{x:0,y:-98}};
        posArray[2] = {startPos:{x:-576,y:-347},offset:{x:200,y:0}};
        posArray[3] = {startPos:{x:452,y:-193},offset:{x:0,y:98}};
        var gangpengPos = {};
        for(var pos = 0;pos<this.posCount;pos++){
            var positions = gangpengPos[pos] = [];
            for(var i = 0;i<4;i++){
                var position = {};
                position.x = posArray[pos].startPos.x +posArray[pos].offset.x * i;
                position.y = posArray[pos].startPos.y +posArray[pos].offset.y * i;
                positions.push(position);
            }
        }
        return gangpengPos;
    },
    createSplashPos(){
        var posArray = new Array(this.posCount);
        posArray[0] = {x:0,y:150};
        posArray[1] = {x:-400,y:0};
        posArray[2] = {x:0,y:-150};
        posArray[3] = {x:400,y:0};

        return posArray;
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
    createHitCardUi(pos,cardIndex){
        var preStr = ["h","l","h","r"];
        var pfb = this.hitCardsPfb[pos];
        var cardUi = cc.instantiate(pfb);
        var sp = this.cardImages.getSpriteFrame(preStr[pos]+Majiang.smCard(cardIndex));
        cardUi.getComponent(cc.Sprite).spriteFrame = sp;
        return cardUi;
    },
    createGangpengCardUi(pos,cardIndex,type){//1 表示碰  2表示杠
        var preStr = ["h","l","h","r"];
        var gangpengUi = cc.instantiate(this.gangpengPfb[pos]);
        var cards = gangpengUi.children;
        for(var i = 0;i<cards.length;i++){
            var card = cards[i];
            var sp = this.cardImages.getSpriteFrame(preStr[pos]+Majiang.smCard(cardIndex))
            card.getComponent(cc.Sprite).spriteFrame = sp;
        }
        type == 1?cards[3].active = false:cards[3].active = true;
        return gangpengUi;
    },
    addHitCardUi(pos,cardIndex){
        var hitCardUi = this.createHitCardUi(pos,cardIndex);
        //设置位置
        var index = Object.keys(this.hitCards[pos]).length;
        var postion = this.hitCardsPos[pos][index];
        hitCardUi.x = postion.x;hitCardUi.y = postion.y;
        var zIndex = 0;
        if(pos == 0 || pos == 3){
            zIndex = 25 - index;
        }
        if(pos == 1 || pos == 2){
            zIndex = index;
        }
        hitCardUi.setLocalZOrder(zIndex);
        this.hitCardsUi.addChild(hitCardUi);
        this.hitCards[pos][cardIndex] = {ui:hitCardUi,cardIndex:cardIndex};
    },
    addGangpengCardUi(pos,cardIndex,type,index){
        var gangpengUi = this.createGangpengCardUi(pos,cardIndex,type);
        var position = this.gangpengCardsPos[pos][index];
        gangpengUi.x = position.x;
        gangpengUi.y = position.y;
        this.gangpegnCardsUi.addChild(gangpengUi);
    },
    addSplashUi(pos,type){
        var map = {1:0,2:1,3:1,4:1,5:2,6:2};
        var splashsUi = cc.instantiate(this.actionSplashPfb);
        splashsUi.getComponent(cc.Sprite).spriteFrame = this.splashImages[map[type]];
        var position = this.splashPos[pos];
        splashsUi.x = position.x;
        splashsUi.y = position.y;
        this.splashsUi.addChild(splashsUi);
        splashsUi.getComponent(cc.Animation).on("finished",function () {
            splashsUi.removeFromParent(true);
        })
    },
    getScreenPos(selfLogicPos,logicPos){
        var myPos = selfLogicPos;
        var delta = new Number(myPos) - 2;
        var screenPos = new Number(logicPos) - delta;
        screenPos =  screenPos<0?4+screenPos:screenPos;
        screenPos =  screenPos>=4?screenPos-4:screenPos;
        return screenPos;
    },

    showHead(pId,scrPos,imgUrl,name){
        this.headRoot[scrPos].active = true;
        var sp = this.headSpUi[scrPos].getComponent(cc.Sprite);
        var nameLab = this.nameUi[scrPos].getComponent(cc.Label);
        CreatorHelper.changeSpriteFrameWithServerUrl(sp,imgUrl);
        nameLab.string = name;
        var info = UnitTools.getOrCreateJsonInJson(pId,this.pInfos);
        info.pos = scrPos;
    },
    hideHead(pId){
        var info = this.pInfos[pId];
        if(UnitTools.isNullOrUndefined(info))return;
        var pos = info.pos;
        this.headRoot[pos].active = false;
        this.nameUi[pos].getComponent(cc.Label).string = "";
        this.scoreUi[pos].getComponent(cc.Label).string = "";
    },
    adjustSelfHandCard(){
        var cardCount = 0;
        for(var i = 33;i>=0;i--){
            var cards = this.selfHandCard[i];
            for(var cardIndex in cards){
                cardIndex = parseInt(cardIndex);
                var ui = cards[cardIndex].ui;
                var index = 12 - cardCount;
                cardCount+=1;
                var pos = this.handCardsPos[2][index];
                ui.x = pos.x;ui.y = pos.y;
            }
        }
    },
    adjustHandCard(pos){
        var handCards = this.handCards[pos];
        var startIndex = 12;
        for(var idx in handCards){
            var card = handCards[idx];
            if(card == null)continue;
            var position = this.handCardsPos[pos][startIndex];
            card.ui.x = position.x;
            card.ui.y = position.y;
            card.ui.setLocalZOrder(startIndex);
            startIndex-=1;
        }
    },
    touchCard(scrPos,cardIndex,type){
        var cardUi = this.createHandCardUi(scrPos,cardIndex);
        var pos = this.handCardsPos[scrPos][13];
        cardUi.x = pos.x;cardUi.y = pos.y;
        this.handCardsUi.addChild(cardUi);
        var handCars = this.handCards[scrPos];
        handCars[13] = {cardIndex:cardIndex,ui:cardUi};
        if(type == 1){
            var tIndex = Majiang.tIndex(cardIndex);
            this.selfHandCard[tIndex][cardIndex] = {ui:cardUi};
            this.bindCardEvt(cardIndex,cardUi);
        }
    },
    turn(scrPos,time = 20){
         if(this.timeSche)this.unschedule(this.timeSche);
         var rotations = [180,90,0,-90];
         this.turnTime.getChildByName("point").rotation = rotations[scrPos];
         //超时tick
        this.turnTime.getChildByName("text").getComponent(cc.Label).string = time;

        this.timeSche = function () {
            time-=1;
            this.turnTime.getChildByName("text").getComponent(cc.Label).string = time;
        }.bind(this)
        this.schedule(this.timeSche,1,19,0);
    },
    hitCard(scrPos,cardIndex,type){
        this.addHitCardUi(scrPos,cardIndex);
        if(type == 1){
            var tIndex = Majiang.tIndex(cardIndex);
            var ui = this.selfHandCard[tIndex][cardIndex].ui;
            ui.removeFromParent(true);
            delete  this.selfHandCard[tIndex][cardIndex];
            this.adjustSelfHandCard();
        }else  if(type == 2){
            var handCards = this.handCards[scrPos];
            for(var idx in handCards){
                var card = handCards[idx];
                if(card == null)continue;
                card.ui.removeFromParent(true);
                handCards[idx] = null;
                break;
            }
            this.adjustHandCard(scrPos);
        }
    },
    bindCardEvt(cardIndex,cardUi){
        var self = this;
        cardUi.cardIndex = cardIndex;
        cardUi.popUp = false;
        CreatorHelper.setNodeClickEvent(cardUi,function () {
            if(cardUi.popUp == true){
                //出牌
                cc.log("出牌:"+cardIndex);
                NetWorkManager.onConnectedToGame(function (client) {
                    var data = {};
                    data.cardIndex = cardIndex;
                    data.actionId = self.actionId;
                    client.proxy.hitCard(data,function (data) {
                        cc.log(data);
                    })
                })
            }else{//自己弹起，其他的牌都下去
                for(var tIndex in this.selfHandCard){
                    var cards = this.selfHandCard[tIndex];
                    for(var cIdx in cards){
                        var ui = cards[cIdx].ui;
                        if(!ui.popUp)continue;
                        ui.y-=40;
                        ui.popUp = false;
                    }
                }
                cardUi.y+=40;
                cardUi.popUp = true;
            }
        }.bind(this))
    },
    showActionSelectUi(actions){
        var selectAction = function (actionType,tIndex) {//调用服务器action选择
            
        }
        this.selectaActionUi.removeAllChildren(true);
        var map = {1:1,2:2,3:2,4:2,5:3,6:3};
        //添加过
        var passUi = cc.instantiate(this.actionSelectPfb);
        passUi.getComponent(cc.Sprite).spriteFrame = this.actionImages[0];
        passUi.getChildByName("card").active = false;
        this.selectaActionUi.addChild(passUi);
        CreatorHelper.setNodeClickEvent(passUi,function () {
            cc.log("选择了Action:");
            cc.log("actionType:"+0);
            cc.log("tIndex:"+0);
            selectAction(0,0);
        })

        for(var actionType in actions){
            var action = actions[actionType];
            var details = [];
            if(!(action instanceof Array)){
                details.push(action);
            }else{
                details = action;
            }
            for(var idx in details){
                var detail = details[idx];//pos tIndex
                var tIndex = detail.tIndex;
                var selectUi = cc.instantiate(this.actionSelectPfb);
                //修改图标 修改麻将
                selectUi.getComponent(cc.Sprite).spriteFrame = this.actionImages[map[actionType]];
                selectUi.getChildByName("card").getComponent(cc.Sprite).spriteFrame = this.cardImages.getSpriteFrame(Majiang.cards[tIndex]);
                this.selectaActionUi.addChild(selectUi);
                CreatorHelper.setNodeClickEvent(selectUi,function (actionType,tIndex) {
                    cc.log("选择了Action:");
                    cc.log("actionType:"+actionType);
                    cc.log("tIndex:"+tIndex);
                    selectAction(actionType,tIndex);
                }.bind(this,actionType,tIndex))
            }
        }
    },
    normalStart(){
        //显示头像
        var self = this;
        var inRoomInfo = User.loginToGameData.inRoomInfo;
        cc.log("gameLogic->normalStart->loginToGameData:%o",User.loginToGameData);
        var heads = inRoomInfo.heads;
        User.playerId = inRoomInfo.playerId;
        User.pos = inRoomInfo.pos;
        UnitTools.forEach(heads,function (pos,pInfo) {
            self.showHead(pInfo.playerId,self.getScreenPos(User.pos,pos),pInfo.headimgurl,pInfo.nickname);
        })
        var frames = inRoomInfo.frames;
        //处理frames里的消息(历史消息)
        for(var idx in frames){
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
        //----------------头像测试-------------------------
        this.showHead(2,0,"http://i4.fuimg.com/583278/00e2ef22ec67b9b0.jpg","鸡蛋");
        this.showHead(3,1,"http://i4.fuimg.com/583278/00e2ef22ec67b9b0.jpg","鸡蛋");
        this.showHead(4,2,"http://i4.fuimg.com/583278/00e2ef22ec67b9b0.jpg","鸡蛋");
        this.showHead(5,3,"http://i4.fuimg.com/583278/00e2ef22ec67b9b0.jpg","鸡蛋");

        //-----------------手里牌测试----------------------

        for(var i = 0;i<14;i++){
            var cardIndex = Majiang.cards[i];
            var cardUi = this.createHandCardUi(2,cardIndex);
            var pos = this.handCardsPos[2][i];
            cardUi.x = pos.x;cardUi.y = pos.y;
            this.handCardsUi.addChild(cardUi);
            var tIndex = Majiang.tIndex(cardIndex);
            this.selfHandCard[tIndex][''+cardIndex] = {ui:cardUi};
            this.bindCardEvt(cardIndex,cardUi);

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
            cardUi.setLocalZOrder(14-i);
            this.handCardsUi.addChild(cardUi);
        }

        //-----------------打牌测试----------------------
        for(var i = 0;i<25;i++){
            var randomIndex = UnitTools.random(0,Majiang.cards.length-1);
            var cardIndex = Majiang.cards[randomIndex];
            for(var pos = 0;pos < this.posCount;pos++){
                this.addHitCardUi(pos,cardIndex);
            }
        }

        //-----------------action选择测试--------------------
        var actions = {};
        actions[1] = {pos:2,tIndex:0};//创造了一个碰
        actions[2] = [{pos:2,tIndex:1},{pos:2,tIndex:2}];
        this.showActionSelectUi(actions);

        //---------------杠碰牌测试--------------------
        for(var pos = 0;pos<4;pos++){
            for(var i = 0;i<4;i++){
                var randomIndex = UnitTools.random(0,Majiang.cards.length-1);
                var cardIndex = Majiang.cards[randomIndex];
                this.addGangpengCardUi(pos,cardIndex,2,i);
            }
        }

        //---------------spash测试--------------------
        for(var pos = 0;pos<4;pos++){
           this.addSplashUi(pos,1);
        }
    },
    update (dt) {
        for(var idx  in Handler.instance().eventQueue){
            var frame = Handler.instance().eventQueue[idx];
            Handler.instance()["handle"+frame.evetnName](frame.data);
        }
        Handler.instance().eventQueue = [];//清空消息队列
    },
});
