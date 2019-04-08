
class User {

}

User.account = null; //账号
User.pass = null;   // 密码
User.playerId = null; //玩家账号
User.nickame = "";   //名字
User.headUrl = "";    //头像地址
User.fangka = null;     //房卡
User.sex = null;        //性别
User.pos = null;    //位置
User.loginToGameData = null;    //登录到游戏服务器的数据
User.isSelfPos = function (pos) {
    if (User.pos == pos) return true;
    return false;
};
module.exports = User;



