
var User = require("User");
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

    headlestartCards(data){
        var cardIndexs = data.cardIndexs;
        for (var i = 0;i < 13;i++){
            var cardIndex = cardIndexs[i];
            var cardUi = this.logicCom.createHandCardUi(2,cardIndex);
            var pos = this.logicCom.handCardsPoa[2][i];
            cardUi.x = pos.x;
            cardUi.y = pos.y;
            this.logicCom.handCardsUi.addChild(cardUi);

            var cardUi = this.logicCom.createHandCardUi(0,cardIndex);
            var pos = this.logicCom.handCardsPos[0][i];
            cardUi.x = pos.x;cardUi.y = pos.y;
            this.logicCom.handCardsUi.addChild(cardUi);

            var cardUi = this.logicCom.createHandCardUi(1,cardIndex);
            var pos = this.logicCom.handCardsPos[1][i];
            cardUi.x = pos.x;cardUi.y = pos.y;
            this.logicCom.handCardsUi.addChild(cardUi);


            var cardUi = this.logicCom.createHandCardUi(3,cardIndex);
            var pos = this.logicCom.handCardsPos[3][i];
            cardUi.x = pos.x;cardUi.y = pos.y;
            cardUi.setLocalZOrder(14-i);
            this.logicCom.handCardsUi.addChild(cardUi);
        }
    }




}

module.exports = Handler;
Handler.g = null;

Handler.service = {};
Handler.service.inPos = function (data,cb) {
    console.log("收到服务器端消息：inPos");
    console.log(data);
    Handler.instance().handleinPos(data);
    // Handler.instance().eventQueue.push({eventName: "inPos",data:data});

}

Handler.service.startCards = function (data,cb) {
    console.log("收到startCards%o",data);
    Handler.instance().eventQueue.push({eventName: "startCards",data:data});
}