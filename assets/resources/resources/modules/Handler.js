
var User = require("User");
var Majiang = require("Chess").Majiang;

class Handler {
    constructor(){
        this.logicCom = null;//游戏组件
        this.eventQueue = [];// 消息队列
    }

    static instance(){
        if (Handler.g == null)Handler.g = new Handler();
        return Handler.g;
    }

    handleinPos(data){
        //显示头像
        var srcPos = this.logicCom.getScreenPos(User.pos,data.pos);
        this.logicCom.showHead(data.playerId,srcPos,data.headimgurl,data.nickname);
    }

    handlestartCards(data){
        var cardIndexs = data.cardIndexs;
        for(var i = 0;i<13;i++){
            var cardIndex = cardIndexs[i];
            var cardUi = this.logicCom.createHandCardUi(2,cardIndex);
            var pos = this.logicCom.handCardsPos[2][i];
            cardUi.x = pos.x;cardUi.y = pos.y;
            this.logicCom.handCardsUi.addChild(cardUi);

            var tIndex = Majiang.tIndex(cardIndex);
            this.logicCom.selfHandCard[tIndex][''+cardIndex] = {ui:cardUi};
            this.logicCom.bindCardEvt(cardIndex,cardUi);

            var cardUi = this.logicCom.createHandCardUi(0,cardIndex);
            var pos = this.logicCom.handCardsPos[0][i];
            cardUi.x = pos.x;cardUi.y = pos.y;
            this.logicCom.handCardsUi.addChild(cardUi);
            this.logicCom.handCards[0][i] = {ui: cardUi,cardIndex:cardIndex};

            var cardUi = this.logicCom.createHandCardUi(1,cardIndex);
            var pos = this.logicCom.handCardsPos[1][i];
            cardUi.x = pos.x;cardUi.y = pos.y;
            this.logicCom.handCardsUi.addChild(cardUi);
            this.logicCom.handCards[1][i] = {ui: cardUi,cardIndex:cardIndex};

            var cardUi = this.logicCom.createHandCardUi(3,cardIndex);
            var pos = this.logicCom.handCardsPos[3][i];
            cardUi.x = pos.x;cardUi.y = pos.y;
            cardUi.zIndex = 14-i;
            this.logicCom.handCardsUi.addChild(cardUi);
            this.logicCom.handCards[2][i] = {ui: cardUi,cardIndex:cardIndex};
        }
        this.logicCom.adjustSelfHandCard();
    }

    handletouchCard(data){
        console.log("handletouchCard" + data);

        var pos = data.pos;
        var cardIndex_s = data.cardIndex_s;
        var scrPos = this.logicCom.getScreenPos(User.pos,pos);
        var type = User.pos == pos ? 1 : 2;
        this.logicCom.touchCard(scrPos,cardIndex_s,type);
    }

    handletoHitCard(data){
        var pos = data.pos;
        var scrPos = this.logicCom.getScreenPos(User.pos,pos);
        this.logicCom.turn(scrPos);
        this.logicCom.actionId = data.actionId;
    }

    handlehitCard(data){
        var pos = data.pos;
        var cardIndex = data.cardIndex;
        var scrPos = this.logicCom.getScreenPos(User.pos,pos);
        var type = User.pos == pos ? 1 : 2;
        this.logicCom.hitCard(scrPos,cardIndex,type);
    }



}

module.exports = Handler;
Handler.g = null;

Handler.service = {};
Handler.service.inPos = function (data,cb) {
    console.log("收到服务器端消息：inPos");
    console.log(data);
    // Handler.instance().handleinPos(data);
    Handler.instance().eventQueue.push({eventName: "inPos",data:data});

}


Handler.service.startCards = function (data,cb) {
    cc.log("收到startCards消息：%o",data);
    Handler.instance().eventQueue.push({evetnName:"startCards",data:data});
    //Handler.instance().handlestartCards(data);
}

Handler.service.touchCard = function (data,cb) {
    cc.log("收到touchCard消息：%o",data);
    Handler.instance().eventQueue.push({evetnName:"touchCard",data:data});

}

Handler.service.toHitCard = function (data,cb) {
    cc.log("收到toHitCard消息：%o",data);
    Handler.instance().eventQueue.push({evetnName:"toHitCard",data:data});

}
Handler.service.hitCard = function (data,cb) {
    cc.log("收到hitCard消息：%o",data);
    Handler.instance().eventQueue.push({evetnName:"hitCard",data:data});

}