// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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
        outAnimationClip: cc.AnimationClip,
        inAnimationClip: cc.AnimationClip

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var animation = this.node.addComponent(cc.Animation);
        animation.addClip(this.outAnimationClip,"out");
        animation.addClip(this.inAnimationClip,"in");

        this.node.on(cc.Node.EventType.TOUCH_START,function (args) {
            animation.play("in")

        },this);

        this.node.on(cc.Node.EventType.TOUCH_END,function (args) {
            animation.play("out")
        },this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL,function (args) {
            animation.play("out")
        },this);

    },

    // update (dt) {},
});
