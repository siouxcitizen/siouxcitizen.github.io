// forked from siouxcitizen's "CreateJS 0.6.1 前回コードから戦闘もどき機能追加" http://jsdo.it/siouxcitizen/1mJ8
//
//自分のスマホから操作できるゲーム目指して。。。(自分のスマホでの動き怪しくなってきましたが。。。)
//自分のスマホからだとAボタンが連打になってしまいやすい。。。
//
//
//前回の　[最初の画面から下に行った2画面目の「しかばね」と戦えるようにしてみました]　の単純な戦闘機能に加えて、
//敵に強さにレベルを複数用意した上で、倒したその敵からボーンをもらい、
//集めたボーンから作る秘薬で勇者をレベルアップというシステムを追加してみました。
//
//テストとかパラメーターのバランス取りなんかはほとんどやってません。。。
//バグ多いかも
//
//
//決定ボタン→仮想キーのAボタン、またはキーボードのZボタン
//Bボタン→仮想キーのBボタン、またはキーボードのBボタン→勇者キャラの移動スピード変更
//
//
//1画面目
//決定ボタンで僧侶に話しかけることができます　僧侶が説明的な感じでシステム説明します。。。
//何もないところで決定ボタンを押すと勇者のステータスが表示されます
//
//2画面目
//決定ボタンで敵「しかばね」と戦闘できます
//2画面目での勇者の場所が変わると出てくる「しかばね」のレベルも変化わります
//「ボスしかばね」を倒すとゲーム終了となります
//「しかばね」は強さのレベルによらず全て同じ画像です。。。
//
//3画面目
//決定ボタンで魔女に話しかけることができます
//ボーンが十分にあればボーンで秘薬を作成・使用して勇者のレベルアップができます
//何もないところで決定ボタンを押すと勇者のステータスが表示されます
//
//
//ついでに、
//指摘された反対になっていたAボタンとBボタンの位置を修正
//CreateJSの0.61ではなくEaselJSの0.61であるようにタイトルを修正
//
var stage;
var message;
var queue;
var manifest;

//var loadingMessage;
var isBattle = false;
var isBattleOver = false;
var isShikabane = true;
var battleGraphics;
var battleBackGroundRect;
var battleMessage;
var btlYuushaTurn = false;
var enemyHP = 30;

var isTalking = false;
var talkingGraphics;
var talkingBackGroundRect;
var talkingMessage;

var mapState = 0; //マップ１用、マップ２用、マップ３用

//ボタン用画像
var leftButtonBmp;     //左ボタン画像
var rightButtonBmp;    //右ボタン画像
var upButtonBmp;       //上ボタン画像
var downButtonBmp;     //下ボタン画像
var aButtonBmp;        //Aボタン画像
var bButtonBmp;        //Bボタン画像

var prevDirection = 0;
var direction = 4; //歩いていく方向 （0～3：下上左右  4:止）
var keyFlags = [false, false, false, false];

var graphics;
var backGroundRect;
var mapGround;
var mapData;
var mapObstacleData;
//スプライトシートによる勇者アニメーション用
var yuusha;
var yuushaParam;
var charaX = 0;
var charaY = 0;
var charaSpeed = 4;

var priest;
var witch;
var shikabane;
var enemyParam;

var isGameOver = false;
var isGameClear = false;

var field;
//マップチップの描画指定を行なう配列
//実際の値は　関数　setMapData()　で設定
var firstMapData;
var firstMapObstacleData;
var secondMapData;
var secondMapObstacleData;
var thirdMapData;
var thirdMapObstacleData;
//マップ番号　どの配列を使ってマップチップの描画を行なうか判定用
var mapNumber = 1;

var yuushaLevelPara;
//yuushaParam　→　(lifePoint, maxLifePoint, attackPoint, defencePoint, bone)
yuushaLevelParam =  [[  50,  50,   7,   3,   0],
                     [ 100, 100,   9,   5,   0],
                     [ 150, 150,  11,   7,   0],
                     [ 200, 200,  13,   9,   0],
                     [ 250, 250,  15,  11,   0],
                     [ 300, 300,  18,  14,   0],
                     [ 350, 350,  21,  17,   0],
                     [ 400, 400,  24,  21,   0],
                     [ 450, 450,  27,  23,   0],
                     [ 500, 500,  35,  31,   0] ];

window.onload = init;

function init() {
    var myCanvas = document.getElementById('myCanvas');
    stage = new createjs.Stage(myCanvas);
    createjs.Touch.enable(stage); 

    message = new createjs.Text("Now Loading...", "32px Arial", "#ffffff");
    stage.addChild(message);
    message.x = 0;
    message.y = 0;

    stage.update();

    setManifest();
    queue = new createjs.LoadQueue(false);
    queue.loadManifest(manifest,true);
    queue.addEventListener("fileload",handleFileLoad);  
    queue.addEventListener("complete",handleComplete);

}

function handleFileLoad(event){
}

function handleComplete(event){

    //マップチップの描画指定を行なう配列をセット
    setMapData();

    //背景塗りつぶし用矩形
    graphics = new createjs.Graphics();
    graphics.beginFill("#000000");
    graphics.drawRect(0,0,450,450);
    graphics.endFill();
    backGroundRect = new createjs.Shape(graphics);
    backGroundRect.x = 0;
    backGroundRect.y = 0;
    stage.addChild(backGroundRect);

    mapData = firstMapData;
    mapObstacleData = firstMapObstacleData; 

    mapGround =new createjs.Container;
    var mapSpriteSheet = new createjs.SpriteSheet({
        images: [queue.getResult("mapImg")],
        frames: { width: 16, height: 16 }
    });
    field = new createjs.BitmapAnimation(mapSpriteSheet);

    var x = 0, y = 0; 
    while (y < mapData.length){
        while (x < mapData[y].length){
            var map = field.clone();
            map.setTransform(x*32, y*32);
            map.gotoAndStop(mapData[y][x]);
            map.scaleX = map.scaleY = 2;
            mapGround.addChild(map);
            x += 1;
        }
        x = 0;
        y += 1;
    }
    stage.addChild(mapGround);

    //勇者パラメータ設定(表示用以外のパラメータ設定)
    //var Yuusha = function(lifePoint, maxLifePoint, attackPoint, defencePoint, bone)
    //より
    yuushaParam = new Yuusha(yuushaLevelParam[0][0], 
                             yuushaLevelParam[0][1], 
                             yuushaLevelParam[0][2], 
                             yuushaLevelParam[0][3], 
                             yuushaLevelParam[0][4]); 

    //勇者アニメーション用のスプライトシートを作成
    var spriteSheet = new createjs.SpriteSheet({
        images: [queue.getResult("yuushaImg")],
        //↓manifestによるロードを使わず、以下のように直接画像のパスを指定しても動きました
        //images: ["http://jsrun.it/assets/n/x/7/h/nx7he.png"],
        frames: { width:16, height:16 },
        animations: {
            down: { frames: [0, 1], frequency: 5 },
            up: { frames: [2, 3], frequency: 5 },
            left: { frames: [6, 7], frequency: 5 },
            right: { frames: [4, 5], frequency: 5 }
        }
    });
    yuusha = new createjs.BitmapAnimation(spriteSheet);
    yuusha.scaleX = yuusha.scaleY = 2;
    stage.addChild(yuusha);
    yuusha.gotoAndPlay("down");

    //僧侶アニメーション用のスプライトシートを作成
    var sprtShtForPriest = new createjs.SpriteSheet({
        images: [queue.getResult("priestImg")],
        frames: { width:16, height:16 },
        animations: {
            down: { frames: [0, 1], frequency: 5 },
            up: { frames: [2, 3], frequency: 5 },
            left: { frames: [6, 7], frequency: 5 },
            right: { frames: [4, 5], frequency: 5 }
        }
    });
    priest = new createjs.BitmapAnimation(sprtShtForPriest);
    priest.scaleX = priest.scaleY = 2;
    priest.gotoAndPlay("down");
    priest.x = 256;
    priest.y = 32;
    mapGround.addChild(priest);

    //魔女アニメーション用のスプライトシートを作成
    var sprtShtForWitch = new createjs.SpriteSheet({
        images: [queue.getResult("witchImg")],
        frames: { width:16, height:16 },
        animations: {
            down: { frames: [0, 1], frequency: 5 },
            up: { frames: [2, 3], frequency: 5 },
            left: { frames: [6, 7], frequency: 5 },
            right: { frames: [4, 5], frequency: 5 }
        }
    });
    witch = new createjs.BitmapAnimation(sprtShtForWitch);
    witch.scaleX = witch.scaleY = 2;
    witch.gotoAndPlay("right");
    witch.x = 128;
    witch.y = 512;
    //mapGround.addChild(witch);

    //しかばねアニメーション用のスプライトシートを作成
    var sprtShtForShikabane = new createjs.SpriteSheet({
        images: [queue.getResult("shikabaneImg")],
        frames: { width:16, height:16 },
        animations: {
            down: { frames: [0, 1], frequency: 5 },
            up: { frames: [2, 3], frequency: 5 },
            left: { frames: [6, 7], frequency: 5 },
            right: { frames: [4, 5], frequency: 5 }
        }
    });
    shikabane = new createjs.BitmapAnimation(sprtShtForShikabane);
    shikabane.scaleX = shikabane.scaleY = 2;
    shikabane.gotoAndPlay("down");
    shikabane.x = 256;
    shikabane.y = 256;
    //mapGround.addChild(shikabane);

    //会話メッセージ用黒背景
    talkingGraphics = new createjs.Graphics();
    talkingGraphics.setStrokeStyle(2).beginStroke("#FFFFFF");
    talkingGraphics.beginFill("#000000");
    //talkingGraphics.drawRoundRect(0,0,340,150,10);
    talkingGraphics.drawRoundRect(0,0,440,270,10);
    talkingGraphics.endFill();
    talkingBackGroundRect = new createjs.Shape(talkingGraphics);
    //会話メッセージ表示用Textオブジェクトを生成・設定 
    talkingMessage = new createjs.Text("", "20px Arial", "#FFFFFF");

    //戦闘画面＆メッセージ用黒背景
    battleGraphics = new createjs.Graphics();
    battleGraphics.setStrokeStyle(2).beginStroke("#FFFFFF");
    battleGraphics.beginFill("#000000");
    battleGraphics.drawRoundRect(0,0,440,270,10);
    battleGraphics.endFill();
    battleBackGroundRect = new createjs.Shape(battleGraphics);
    //会話メッセージ表示用Textオブジェクトを生成・設定 
    battleMessage = new createjs.Text("", "20px Arial", "#FFFFFF");

    //アニメーションさせるキャラの最初の座標を設定
    charaX = 192; //  //32の倍数
    charaY = 192; //  //32の倍数
    //↑かわりに近い32の倍数値を使用
    //↑キャララクターとマップの画像は32＊32単位で表示しているため
    //charaX = 209; //450/2 -16  //32の倍数でない  //いくら4を増減しても32で割り切れないので没
    //charaY = 209; //450/2 -16  //32の倍数でない  //いくら4を増減しても32で割り切れないので没
    yuusha.x = charaX;
    yuusha.y = charaY;

    //ボタン作成
    //左ボタン作成
    leftButtonBmp = new createjs.Bitmap(queue.getResult("leftButtonImg"));
    leftButtonBmp.x = 10;
    leftButtonBmp.y = 330;
    leftButtonBmp.scaleX = leftButtonBmp.scaleY = 4;
    leftButtonBmp.alpha = 0.6;
    leftButtonBmp.addEventListener('mousedown',onPressLeftButton,false);
    stage.addChild(leftButtonBmp);

    //右ボタン作成
    rightButtonBmp = new createjs.Bitmap(queue.getResult("rightButtonImg"));
    rightButtonBmp.x = 150;
    rightButtonBmp.y = 330;
    rightButtonBmp.scaleX = rightButtonBmp.scaleY = 4;
    rightButtonBmp.alpha = 0.6;
    rightButtonBmp.addEventListener('mousedown',onPressRightButton,false);
    stage.addChild(rightButtonBmp);

    //上ボタン作成
    upButtonBmp = new createjs.Bitmap(queue.getResult("upButtonImg"));
    upButtonBmp.x = 80;
    upButtonBmp.y = 280;
    upButtonBmp.scaleX = upButtonBmp.scaleY = 4;
    upButtonBmp.alpha = 0.6;
    upButtonBmp.addEventListener('mousedown',onPressUpButton,false);
    stage.addChild(upButtonBmp);

    //下ボタン作成
    downButtonBmp = new createjs.Bitmap(queue.getResult("downButtonImg"));
    downButtonBmp.x = 80;
    downButtonBmp.y = 380;
    downButtonBmp.scaleX = downButtonBmp.scaleY = 4;
    downButtonBmp.alpha = 0.6;
    downButtonBmp.addEventListener('mousedown',onPressDownButton,false);
    stage.addChild(downButtonBmp);

    //Aボタン作成
    aButtonBmp = new createjs.Bitmap(queue.getResult("aButtonImg"));
    //aButtonBmp.x = 270;
    //aButtonBmp.y = 330;
    aButtonBmp.x = 370;
    aButtonBmp.y = 330;
    aButtonBmp.scaleX = aButtonBmp.scaleY = 4;
    aButtonBmp.alpha = 0.6;
    aButtonBmp.addEventListener('mousedown',onPressAButton,false);
    stage.addChild(aButtonBmp);
    
    //Bボタン作成
    bButtonBmp = new createjs.Bitmap(queue.getResult("bButtonImg"));
    //bButtonBmp.x = 370;
    //bButtonBmp.y = 330;
    bButtonBmp.x = 270;
    bButtonBmp.y = 330;
    bButtonBmp.scaleX = bButtonBmp.scaleY = 4;
    bButtonBmp.alpha = 0.6;
    bButtonBmp.addEventListener('mousedown',onPressBButton,false);
    stage.addChild(bButtonBmp);

    //メッセージをリリースして再配置
    stage.removeChild(message);
    message.text = ""
    stage.addChild(message);
    //message.x = 0;
    //message.y = 0;

    //30FPSでスタート
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addListener(this);

    //キーが押された時のイベントリスナーの登録
    document.addEventListener('keydown', handleKeyDown, false);
    //キーが離された時のイベントリスナーの登録
    document.addEventListener('keyup', handleKeyUp, false);
}

//キーボードのキーが押された時の処理
function handleKeyDown(event) {
    if (event.keyCode==40 || event.keyCode==83) {//↓ s ボタン        
        if (isBattle) return;  //戦闘中は移動できない
        keyFlags[0] = true;
    } else if (event.keyCode==38 || event.keyCode==87) {//↑ w ボタン
        if (isBattle) return;
        keyFlags[1] = true;
    } else if (event.keyCode==37 || event.keyCode==65) {//← a ボタン
        if (isBattle) return;
        keyFlags[2] = true;
    } else if (event.keyCode==39 || event.keyCode==68) {//→ d ボタン
        if (isBattle) return;
        keyFlags[3] = true;
    } else if (event.keyCode==66) {//b ボタン
        changeCharaSpeed();
    } else if (event.keyCode==90 || event.keyCode==190) {//z . ボタン
        talkToNPC();
    }
}
//talkToNPC()
//ビットマップボタンが押された時の処理
function onPressLeftButton(event) {
    //戦闘中は移動させない
    if (isBattle) return;
    keyFlags[2] = true;
    event.addEventListener("mouseup", releaseLeftButton);
}
function onPressRightButton(event) {
    if (isBattle) return;
    keyFlags[3] = true;
    event.addEventListener("mouseup", releaseRightButton);
}
function onPressUpButton(event) {
    if (isBattle) return;
    keyFlags[1] = true;
    event.addEventListener("mouseup", releaseUpButton);
}
function onPressDownButton(event) {
    if (isBattle) return;
    keyFlags[0] = true;
    event.addEventListener("mouseup", releaseDownButton);
}
function onPressAButton(event) {
    talkToNPC();
    event.addEventListener("mouseup", releaseAButton);
}

//操作キャラの移動スピードを変化させます
function onPressBButton(event) {
    changeCharaSpeed();
    event.addEventListener("mouseup", releaseBButton);
}

//キーボードのキーが離された時の処理
function handleKeyUp(event) {
    if (event.keyCode==40 || event.keyCode==83) {//↓ s ボタン
        keyFlags[0] = false;
    } else if (event.keyCode==38 || event.keyCode==87) {//↑ w ボタン
        keyFlags[1] = false;
    } else if (event.keyCode==37 || event.keyCode==65) {//← a ボタン
        keyFlags[2] = false;
    } else if (event.keyCode==39 || event.keyCode==68) {//→ d ボタン
        keyFlags[3] = false;
    } else if (event.keyCode==66) {//b ボタン
        message.text = "";
    } else if (event.keyCode==90 || event.keyCode==190) {//z . ボタン
    }
}
//ビットマップボタンがリリースされた時の処理
function releaseLeftButton(event) {
    keyFlags[2] = false;
}
function releaseRightButton(event) {
    keyFlags[3] = false;
}
function releaseUpButton(event) {
    keyFlags[1] = false;
}
function releaseDownButton(event) {
    keyFlags[0] = false;
}
function releaseAButton(event) {
}
function releaseBButton(event) {
    message.text = "";
}

function changeCharaSpeed() {
    if (isGameOver) return; //ゲームオーバー時は操作できないようにする
   
    if ((mapNumber == 1 || mapNumber == 3) && mapState == 1) { //マップ1またはマップ3で会話中にBボタン押下で会話ウィンドウを閉じる
        closeTalkingScene(); 
        mapState = 0;
        return;
    }

    //操作キャラがマップチップにちょうどおさまっているときのみ操作可能
    //座標の計算のずれをふせぐため(たぶん)
    if ((charaX % 32) == 0 && (charaY % 32) == 0) {
        if (charaSpeed == 4) {
            charaSpeed = 8;
            message.text = "B ダッシュ !";
        } else if (charaSpeed == 8) {
            charaSpeed = 16;
            message.text = "通常の３倍の動き!!!";
        } else if (charaSpeed == 16) {
            charaSpeed = 4;
            message.text = "通常の移動速度になりました";
        } 
    }
}

function talkToNPC() {

    //操作キャラがマップチップにちょうどおさまっているときのみ操作可能
    //座標の計算のずれをふせぐため(たぶん)
    if ((charaX % 32) == 0 && (charaY % 32) == 0) {
        if (isGameOver) return; //ゲームオーバー時は操作できないようにする

        var x;
        var y;
        x = Math.floor(charaX/32);
        y = Math.floor(charaY/32); //

        var talkingMessageTxt;

        //マップ１の処理　スタート■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        if (mapNumber == 1) {
                if (mapState == 0) {
                    closeTalkingScene(); 
	            //マップ1で僧侶に話しかけた場合
	            if ((x == 8 && y == 2 && prevDirection == 1) || (x == 7 && y == 1 && prevDirection == 3)) {
                        isTalking = true;
                        //会話メッセージを表示
                        talkingMessageTxt = "おお、よくぞまいった" + "\n"
                                          + "勇者ブレイヴ!!!" + "\n"
                                          + "\n"
                                          + "そなたにはぜひ村で暴れまわっている" + "\n"
                                          + "「しかばね」のボスを倒して欲しい" + "\n"
                                          + "ここより下側の「しかばね」の巣窟の奥に" + "\n"
                                          + "「ボスしかばね」はいるようじゃ" + "\n"
                                          + "(2画面目)" + "\n"
                                          + "\n"
                                          + "「しかばね」を倒すと手に入るボーンを" + "\n"
                                          + "能力強化の秘薬と交換することが可能じゃ" + "\n"
                                          + "(3画面目)" + "\n"
                                          + "\n";

                        initTalkingScene(talkingMessageTxt);
                        mapState = 1;
                    } else { //話しかける以外の場所で決定ボタン押下時
                        isTalking = true;
                        //勇者ステータスを表示
                        talkingMessageTxt = "ステータス" + "\n"
                                          + "名前：勇者ブレイヴ" + "\n"
                                          + "\n"
                                          + "レベル：  " + yuushaParam.level + "\n"
                                          + "最大ライフポイント：   " + yuushaParam.maxLifePoint + "\n"
                                          + "攻撃力：  " + yuushaParam.attackPoint + "\n"
                                          + "防御力：  " + yuushaParam.defencePoint + "\n"
                                          + "\n"
                                          + "所持ボーン：  " + yuushaParam.bone + "\n"
                                          + "\n"
                                          + "ノックアウト回数：  " + yuushaParam.knockoutCnt + "\n"
                                          + "\n";
                        initTalkingScene(talkingMessageTxt);
                        mapState = 1;
                    }
                } else if (mapState == 1) {
                    closeTalkingScene(); 
                    mapState = 0;
                }

        //マップ１の処理　エンド■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        
        //マップ２の処理　スタート■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        } else if (mapNumber == 2) {
                if (!isBattle) {
                    isTalking = false;
                    initBattleScene("しかばねがあらわれた！！！" + "\n\n\n" + "勇者ライフポイント "+ yuushaParam.maxLifePoint + "/" + yuushaParam.lifePoint + "\n");

                    if (x == 8) { 

                        enemyParam = new Enemy("レベル１しかばね", 35, 35, 5, 4, 10);

                    } else if (x < 8){

                        enemyParam = new Enemy("レベル２しかばね", 40, 40, 10, 8, 20);

                    } else if ( (x == 14 || x == 15) && (y == 9 || y == 10) ) {

                        enemyParam = new Enemy("ボスしかばね", 85, 85, 30, 25, 160);
                        //enemyParam = new Enemy("ボスしかばね", 1, 1, 2, 2, 160); //テスト用

                    } else if ((8 < x && x < 17) && (5 < y && y < 14) ) {

                        enemyParam = new Enemy("レベル４しかばね", 65, 65, 20, 16, 80);

                    } else if (x > 8) {

                        enemyParam = new Enemy("レベル３しかばね", 50, 50, 15, 12, 40);

                    }
                    isBattle = true;

                } else if (isBattle && !isBattleOver) {
                    var damage;
                    //var damage = Math.floor(Math.random()*10);
                    if(yuushaParam.battleYuushaTurn) {
                        if (enemyParam.lifePoint < 0) {
                            battleMessage.text = "しかばねをたおした！" + "\n"
                                               + "勇者は"+ enemyParam.bone + "ボーンをていにいれた！！" + "\n"
                                               + "\n"
                                               + "勇者ライフポイント "+ yuushaParam.maxLifePoint + "/" + yuushaParam.lifePoint + "\n"
                                               + "\n";

                            yuushaParam.bone = yuushaParam.bone + enemyParam.bone;
                            yuushaParam.lifePoint = yuushaParam.maxLifePoint; //戦闘終了後は体力回復
                            //しかばね画像をリリース
                            stage.removeChild(shikabane);
                            isBattleOver = true;

                            if (enemyParam.name =="ボスしかばね") {
                                battleMessage.text = battleMessage.text 
                                                   + "\n" 
                                                   + "ボスしかばねを倒した！！！！" 
                                                   + "\n" 
                                                   + "\n" 
                                                   +"☆★☆★GAME CLEAR★☆★☆"
                                isGameOver = true;
                            }  
                            return; 
                        }
                        //yuushaParam.attackPoint  = yuushaLevelParam[yuushaParam.level-1][2]
                        //yuushaParam.defencePoint = yuushaLevelParam[yuushaParam.level-1][3]
                        damage = yuushaParam.attackPoint - enemyParam.defencePoint + Math.floor(Math.random()*5);
                        if (damage < 0) {
                            damage = 0;
                        }

                        battleMessage.text = "勇者の攻撃" + "\n"
                                           + enemyParam.name  + "は"+ damage + "のダメージをうけた" + "\n"
                                           + "\n"
                                           + "勇者ライフポイント "+ yuushaParam.maxLifePoint + "/" + yuushaParam.lifePoint + "\n"
                                           + "\n";
                        enemyParam.lifePoint = enemyParam.lifePoint - damage;  

                        //しかばね画像を点滅させてダメージをあたえた表現にしています
                        shikabane.visible = false; 
                        setTimeout(function(){ shikabane.visible = true; }, 130);
             
                        yuushaParam.battleYuushaTurn = false;
                    } else {
                        damage = enemyParam.attackPoint - yuushaParam.defencePoint + Math.floor(Math.random()*5);
                        if (damage < 0) {
                            damage = 0;
                        }

                        yuushaParam.lifePoint = yuushaParam.lifePoint - damage;
                        if(yuushaParam.lifePoint <= 0) yuushaParam.lifePoint = 0;

                        battleMessage.text = enemyParam.name  + "の攻撃" + "\n"
                                           + "勇者は" + damage + "のダメージをうけた" + "\n"
                                           + "\n"
                                           + "勇者ライフポイント "+ yuushaParam.maxLifePoint + "/" + yuushaParam.lifePoint + "\n"
                                           + "\n";

                        if(yuushaParam.lifePoint == 0) {
                            battleMessage.text = battleMessage.text
                                               + "勇者はノックアウトされてしまった！" + "\n"
                                               + "しかばねにボーンすべてをとられてしまった！！" + "\n"
                                               + "しかばねは満足そうに去っていった！！！" + "\n"
                                               + "\n";
                            //isGameOver = true;
                            yuushaParam.bone = 0;
                            yuushaParam.knockoutCnt = yuushaParam.knockoutCnt + 1;
                            yuushaParam.lifePoint = yuushaParam.maxLifePoint; //戦闘終了後は体力回復
                            //しかばね画像をリリース
                            stage.removeChild(shikabane);
                            isBattleOver = true;
                            return; 
                        }
                        yuushaParam.battleYuushaTurn = true;
                    }
                
                } else if (isBattleOver) {
                    closeBattleScene();
                    isBattleOver = false;
                }
        //マップ２の処理　エンド■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        
        //マップ３の処理　スタート■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        } else if (mapNumber == 3) {

                if (mapState == 0) {
	            //マップ3で魔女に話しかけた場合
	            if ((x == 4 && y == 15 && prevDirection == 0) || (x == 5 && y == 16 && prevDirection == 2) || (x == 4 && y == 17 && prevDirection == 1)) {
	                if ( yuushaParam.level < yuushaLevelParam.length) {
                            isTalking = true;
                            //会話メッセージを表示
                            talkingMessageTxt = "不思議なボーンでつくる" + "\n"
                                              + "秘薬はいらんかね？" + "\n"
                                              + "レベル" + yuushaParam.level + "秘薬： " + (yuushaParam.level * 20) +"ボーン" + "\n"
                                              + "\n"
                                              + "所持ボーン： " + yuushaParam.bone + "\n"
                                              + "";
                            initTalkingScene(talkingMessageTxt);
                            mapState = 1;
	                } else {
                            isTalking = true;
                            //会話メッセージを表示
                            talkingMessageTxt = "そなたはもう十分に強い！" + "\n"
                                              + "これ以上の秘薬はもう必要ないだろう" + "\n"
                                              + "\n"
                                              + "";
                            initTalkingScene(talkingMessageTxt);
                            mapState = 2;
	                }
                    } else { //マップ3で魔女に話しかる以外の場所で決定ボタン押下時
                        isTalking = true;
                        //勇者ステータスを表示
                        talkingMessageTxt = "ステータス" + "\n"
                                          + "名前：勇者ブレイヴ" + "\n"
                                          + "\n"
                                          + "レベル：" + yuushaParam.level + "\n"
                                          + "最大ライフポイント：" + yuushaParam.maxLifePoint + "\n"
                                          + "攻撃力：" + yuushaParam.attackPoint + "\n"
                                          + "防御力：" + yuushaParam.defencePoint + "\n"
                                          + "\n"
                                          + "所持ボーン：  " + yuushaParam.bone + "\n"
                                          + "\n"
                                          + "ノックアウト回数：  " + yuushaParam.knockoutCnt + "\n"
                                          + "\n";
                        initTalkingScene(talkingMessageTxt);
                        mapState = 2;
                    }
                } else if (mapState == 1) {

                    if (yuushaParam.bone >= (yuushaParam.level * 20)) {

                        //勇者のレベルを上げる前にレベルをもとにした所持ボーンの減算を行なっておく
                        yuushaParam.bone = yuushaParam.bone - (yuushaParam.level * 20);

                        //yuushaParam　→　(lifePoint, maxLifePoint, attackPoint, defencePoint, bone)
                        yuushaParam.level = yuushaParam.level + 1;
                        yuushaParam.lifePoint    = yuushaLevelParam[yuushaParam.level-1][0]
                        yuushaParam.maxLifePoint = yuushaLevelParam[yuushaParam.level-1][1]
                        yuushaParam.attackPoint  = yuushaLevelParam[yuushaParam.level-1][2]
                        yuushaParam.defencePoint = yuushaLevelParam[yuushaParam.level-1][3]

                        talkingMessage.text = "レベル" + (yuushaParam.level - 1) + "秘薬をてにいれた!" + "\n"
                                            + "勇者はレベル" + (yuushaParam.level - 1) + "秘薬を使用した!!" + "\n"
                                            + "\n"
                                            + "勇者はレベル" + yuushaParam.level + "になった!!!" + "\n"
                                            + "\n"
                                            + "ライフポイントが" + yuushaParam.maxLifePoint + "になった!" + "\n"
                                            + "攻撃力が" + yuushaParam.attackPoint + "になった!" + "\n"
                                            + "防御力が" + yuushaParam.defencePoint + "になった!" + "\n"
                                            + "\n"
                                            + "";
                    } else {
                        talkingMessage.text = "秘薬のためのボーンが" + "\n"
                                            + "たりないようだ" + "\n"
                                            + "";
                    }
                    mapState = 2;
                } else if (mapState == 2) {
                    closeTalkingScene(); 
                    mapState = 0;
                }
                  //mapState　→　0: 初期状態, 1 : 話しかけた状態, 2 : 購入決定状態, 3 :購入キャンセル状態
        } 
        //マップ３の処理　エンド■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
       
    }
}

function initTalkingScene(msgTxt) {
    //会話メッセージ用の黒背景を表示
    //talkingBackGroundRect.x = 70;
    //talkingBackGroundRect.y = 10;
    talkingBackGroundRect.x = 5;
    talkingBackGroundRect.y = 5;
    stage.addChild(talkingBackGroundRect);

    //会話メッセージを表示
    talkingMessage.text = msgTxt;
    talkingMessage.x = 20;
    talkingMessage.y = 20;
    stage.addChild(talkingMessage);
}

function closeTalkingScene() {
    //会話メッセージ用の黒背景表示をリリース
    stage.removeChild(talkingBackGroundRect);

    //会話メッセージをリリース
    stage.removeChild(talkingMessage);

    isTalking = false;
    mapState = 0;
}

function initBattleScene(msgTxt) {
    //isBattle = true;
    isBattleOver = false;

    //戦闘メッセージ用の黒背景を表示
    battleBackGroundRect.x = 5;
    battleBackGroundRect.y = 5;
    stage.addChild(battleBackGroundRect);

    //会話メッセージを表示
    battleMessage.text = msgTxt;
    battleMessage.x = 20;
    battleMessage.y = 20;
    stage.addChild(battleMessage);

    //しかばねのHPを初期化
    enemyHP = 30;
    //しかばね画像を表示
    shikabane.x = 215;
    shikabane.y = 145;
    stage.addChild(shikabane);
}

function closeBattleScene() {
    //戦闘メッセージ用の黒背景表示をリリース
    stage.removeChild(battleBackGroundRect);

    //戦闘メッセージをリリース
    stage.removeChild(battleMessage);

    isBattle = false;
}

function tick(){

    if ((charaX % 32) == 0 && (charaY % 32) == 0) { //操作キャラ・マップチップは縦横32ドットより
        direction = 4; //止まる

        //とりあえずこの方法で勇者座標から配列インデックスを設定
        var x;
        var y;
        x = Math.floor(charaX/32);
        y = Math.floor(charaY/32); //
        //↑Math.floorで小数点以下切り捨て

        if(keyFlags[0]) { //↓ s ボタン
            //方向ボタンが押された場合は会話メッセージをクローズ
            if(isTalking) closeTalkingScene();
            if (prevDirection != 0) {
                yuusha.gotoAndPlay("down");
                prevDirection = 0;
            }
            if (charaY <= 640-charaSpeed-32 && mapObstacleData[y+1][x] == 0){ //32はキャラチップ1つ分の高さ
            //移動スピード8の場合
            //if (charaY <= 632-32 && mapObstacleData[y+1][x] == 0){ //32はキャラチップの高さ 
            //縦640と移動スピード8から　640-8=632より
            //移動スピード4の場合
            //if (charaY <= 636-32 && mapObstacleData[y+1][x] == 0){ //32はキャラチップの高さ
            //縦640と移動スピード4から　640-4=636より
                //↑32＊20→640
                //↑マップチップ1個分のピクセル数＊マップチップ指定配列の縦方向数
                direction = 0;
            }
        } else if (keyFlags[1]) { //↑ w ボタン
            //方向ボタンが押された場合は会話メッセージをクローズ
            if(isTalking) closeTalkingScene();
	    if (prevDirection != 1) { 
                yuusha.gotoAndPlay("up");
                prevDirection = 1;
            }
            if (charaY >= charaSpeed && mapObstacleData[y-1][x] == 0) { //縦の上方向に移動スピード分の高さがあれば移動
            //移動スピード8の場合
            //if (charaY >= 8 && mapObstacleData[y-1][x] == 0) { //縦の上方向に移動スピード8分の高さがあれば移動
            //移動スピード4の場合
            //if (charaY >= 4 && mapObstacleData[y-1][x] == 0) { //縦の上方向に移動スピード4分の高さがあれば移動
                direction = 1;
            }
        } else if (keyFlags[2]) { //← a ボタン
            //方向ボタンが押された場合は会話メッセージをクローズ
            if(isTalking) closeTalkingScene();
	    if (prevDirection != 2) {
                yuusha.gotoAndPlay("left");
                prevDirection = 2;
            }
	    if (charaX >= charaSpeed && mapObstacleData[y][x-1] == 0) { //左横に移動スピード分の幅があれば移動
            //移動スピード8の場合
	    //if (charaX >= 8 && mapObstacleData[y][x-1] == 0) { //左横に移動スピード8分の幅があれば移動
            //移動スピード4の場合
	    //if (charaX >= 4 && mapObstacleData[y][x-1] == 0) { //左横に移動スピード4分の幅があれば移動
                direction = 2; 
            }
        } else if (keyFlags[3]) { //→ d ボタン
            //方向ボタンが押された場合は会話メッセージをクローズ
            if(isTalking) closeTalkingScene();
	    if (prevDirection != 3) {
                yuusha.gotoAndPlay("right");
                prevDirection = 3;
            }
	    if (charaX <= 640-charaSpeed-32 && mapObstacleData[y][x+1] == 0) { //32はキャラチップ1つ分の幅
            //移動スピード8の場合
	    //if (charaX <= 632-32 && mapObstacleData[y][x+1] == 0) { //32はキャラチップの幅
            //横640と移動スピード8から　640-8=632より
            //移動スピード4の場合
	    //if (charaX <= 636-32 && mapObstacleData[y][x+1] == 0) { //32はキャラチップの幅
            //横640と移動スピード4から　640-4=636より
                //↑32＊20→640
                //↑マップチップ1個分のピクセル数＊マップチップ指定配列の横方向数
                direction = 3;
            }
        }

    }

    //マップ遷移
    changeMap(x,y);

    //次のマスまで操作キャラを自動的に歩かせる(と仮定して座標計算)
    if(direction == 0) {
        charaY += charaSpeed;
    } else if (direction == 1) {
        charaY -= charaSpeed;
    } else if (direction == 2) {
        charaX -= charaSpeed;
    } else if (direction == 3) {
        charaX += charaSpeed;
    }
    if (direction < 4) moveMap(); //マップをスクロール

    stage.update();
}

//マップ遷移
function changeMap(x,y) {
    
    if (mapNumber == 1) {
	    //マップ1からマップ2へ遷移時
	    if (x == 8 && y == 19) {
	        //表示するマップ情報をもつ配列をセット
	        mapData = secondMapData;
	        mapObstacleData = secondMapObstacleData;
	        //操作キャラの座標を設定
	        charaX = 256; //32*8
	        charaY = 32;  //32*(0+1)
	        //グラフィックチップ、キャラチップを再表示
	        mapNumber = 2;
	        drawGraphicChip();
	        moveMap(); //マップをスクロール
                mapState = 0;
	    }
    } else if (mapNumber == 2) {
            //マップ2からマップ1へ遷移時
            if (x == 8 && y == 0) {
                //表示するマップ情報をもつ配列をセット
                mapData = firstMapData;
                mapObstacleData = firstMapObstacleData;
                //操作キャラの座標を設定
                charaX = 256; //32*8
                charaY = 576; //32*(19-1)
                //グラフィックチップ、キャラチップを再表示
                mapNumber = 1;
                drawGraphicChip();
                moveMap(); //マップをスクロール
                mapState = 0;
            //マップ2からマップ3へ遷移時
            } else if (x == 8 && y == 19) {
                //表示するマップ情報をもつ配列をセット
                mapData = thirdMapData;
                mapObstacleData = thirdMapObstacleData;
                //操作キャラの座標を設定
                charaX = 256; //32*8
                charaY = 32;  //32*(0+1)
                //グラフィックチップ、キャラチップを再表示
                mapNumber = 3;
                drawGraphicChip();
                moveMap(); //マップをスクロール
                mapState = 0;
            }
    } else if (mapNumber == 3) {
            //マップ3からマップ2へ遷移時
            if (x == 8 && y == 0) {
                //表示するマップ情報をもつ配列をセット
                mapData = secondMapData;
                mapObstacleData = secondMapObstacleData;
                //操作キャラの座標を設定
                charaX = 256; //32*8
                charaY = 576; //32*(19-1)
                //グラフィックチップ、キャラチップを再表示
                mapNumber = 2;
                drawGraphicChip();
                moveMap(); //マップをスクロール
                mapState = 0;
            }
    }
}

//マップをスクロール
function moveMap() {

    //(x, y) = (192,192)は勇者キャラクターをcanvas上に配置した座標
    //そこから勇者キャラクターが計算上移動した分をさしひいて、
    //スクロールさせるマップ画像の左上座標を導出する
    mapGround.x = 192-charaX;
    mapGround.y = 192-charaY;

}

function drawGraphicChip() {

    //一度すべてのstageのChildを開放してからもう一度表示オブジェクトをaddChildしなおす
    stage.removeAllChildren(); 
    //一つ前のマップの画像を保持し続けないようにremoveする(たぶん)
    mapGround.removeAllChildren();

    //背景再配置
    stage.addChild(backGroundRect);

    //マップ再配置
    var x = 0, y = 0; 
    while (y < mapData.length){
        while (x < mapData[y].length){
            var map = field.clone();
            map.setTransform(x*32, y*32);
            map.gotoAndStop(mapData[y][x]);
            map.scaleX = map.scaleY = 2;
            mapGround.addChild(map);
            x += 1;
        }
        x = 0;
        y += 1;
    }
    stage.addChild(mapGround);

    //勇者キャラクタ再配置
    stage.addChild(yuusha);

    //マップ1のときのみ僧侶キャラクタ再配置
    if (mapNumber == 1) {
        mapGround.addChild(priest);
    //マップ2のときのみしかばねキャラクタ再配置
    } else if (mapNumber == 2) {
        //しかばねがまだ倒されていない場合のみ再表示
        //if (isShikabane) mapGround.addChild(shikabane);
    //マップ3のときのみ魔女キャラクタ再配置
    } else if (mapNumber == 3) {
        mapGround.addChild(witch);
    }

    //ボタン再配置
    stage.addChild(leftButtonBmp);
    stage.addChild(rightButtonBmp);
    stage.addChild(upButtonBmp);
    stage.addChild(downButtonBmp);
    stage.addChild(aButtonBmp);
    stage.addChild(bButtonBmp);

    //メッセージ再配置
    stage.addChild(message);
}

var Yuusha = function(lifePoint, maxLifePoint, attackPoint, defencePoint, bone) {
    this.lifePoint = lifePoint;
    this.maxLifePoint = maxLifePoint;
    this.attackPoint = attackPoint;
    this.defencePoint = defencePoint;
    this.battleMessage = "";
    this.battleYuushaTurn = true; //true:勇者の攻撃ターン　false:敵の攻撃ターン
    this.bone = bone;
    this.level = 1;
    this.knockoutCnt = 0;
}

Yuusha.prototype.battle = function(tekiLifePoint, tekiMaxLifePoint, tekiAttackPoint, tekiDefensePoint) {
    
}

var Enemy = function(name, lifePoint, maxLifePoint, attackPoint, defencePoint, bone) {
    this.name = name;
    this.lifePoint = lifePoint;
    this.maxLifePoint = maxLifePoint;
    this.attackPoint = attackPoint;
    this.defencePoint = defencePoint;
    this.bone = bone;
}

//Enemy.prototype.battle = function(tekiLifePoint, tekiMaxLifePoint, tekiAttackPoint, tekiDefensePoint) {
//    
//}

function setMapData() {

//0:芝生　1:砂　2:石畳　3:フローリング　4:橋（縦）　5:橋（横）　6:木（小）　7:木（大）　8:サボテン　9:水
//10:壁（石）　11:壁（木）　12:壁（武器屋）　13:壁（防具屋）　14:壁（宿屋）　15:壺　16:タンス　17:石像　18:真っ暗

firstMapData =     [ [ 0, 6, 9,18,10,10,10,10,10,18, 2,18,11,11,11,11,18, 9, 6, 0],
                     [ 0, 0, 9,18,16,16, 2, 2, 2,18, 2,18, 3, 3,15,16,18, 9, 0, 0],
                     [ 0, 0, 9,18, 2, 2, 2, 2, 2,18, 2,18, 3, 3, 3, 3,18, 9, 9, 0],
                     [ 7, 0, 9,18, 2, 2, 2, 2, 2,18, 2,18, 3, 3, 3, 3,18, 9, 9, 0],
                     [ 0, 0, 9,18,10,10,10,10, 2,13, 2,14, 3,11,11,11,18, 9, 9, 0],
                     [ 0, 0, 9,18, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,18, 9, 9, 0],
                     [ 0, 0, 9,18, 2, 2, 2, 2, 2, 2, 2,12,10,10,10,10,18, 9, 9, 0],
                     [ 0, 0, 9,18, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,16,18, 9, 9, 0],
                     [ 0, 0, 9,18, 2, 2, 2, 2, 2, 2, 2,18, 2, 2, 2, 2,18, 9, 9, 0],
                     [ 1, 0, 9,18,17,15, 2,17, 2, 2,17,18, 2, 2, 2, 2,18, 9, 9, 0],
                     [ 1, 1, 9,10,10,10,10,10, 2, 2,10,10,10,10,10,10,10, 9, 9, 0],
                     [ 1, 1, 9, 9, 9, 9, 9, 9, 4, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0],
                     [ 1, 1, 0, 0, 0, 9, 9, 0, 0, 0, 0, 6, 0, 0, 0, 7, 9, 9, 9, 4],
                     [ 1, 1, 1, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0],
                     [ 8, 1, 1, 1, 9, 9, 9, 9, 0, 0, 1, 1, 0, 0, 6, 0, 9, 9, 0, 0],
                     [ 1, 1, 1, 9, 9, 9, 9, 9, 4, 9, 4, 9, 1, 1, 1, 0, 9, 9, 0, 0],
                     [ 1, 1, 1, 9, 9, 9, 9, 9, 4, 9, 4, 9, 1, 1, 1, 0, 9, 0, 0, 0],
                     [ 1, 1, 1, 9, 9, 9, 9, 9, 4, 9, 9, 9, 1, 1, 1, 0, 9, 0, 0, 0],
                     [ 1, 1, 1, 9, 9, 9, 9, 9, 4, 9, 9, 9, 1, 1, 1, 0, 9, 9, 9, 6],
                     [ 9, 9, 9, 9, 9, 9, 9, 9, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9] ];

firstMapObstacleData = 
                   [ [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                     [ 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0],
                     [ 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0],
                     [ 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0],
                     [ 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0],
                     [ 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
                     [ 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                     [ 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
                     [ 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0],
                     [ 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0],
                     [ 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                     [ 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                     [ 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0],
                     [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                     [ 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0],
                     [ 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0],
                     [ 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
                     [ 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0],
                     [ 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1],
                     [ 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] ];

secondMapData = 
                   [ [ 9, 9, 9, 9, 9, 9, 9, 9, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
                     [ 0, 0, 0, 9, 9, 9, 9, 9, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
                     [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
                     [ 1, 0, 0, 9, 9, 9, 9, 9, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1],
                     [ 1, 0, 0, 9, 9, 9, 9, 9, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0],
                     [ 1, 0, 0, 9, 9, 9, 9, 9, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0],
                     [ 1, 0, 0, 9, 9, 9, 9, 9, 4, 9, 1, 1, 1, 1, 1, 1, 1, 0, 9, 0],
                     [ 1, 0, 0, 9, 9, 9, 9, 9, 4, 9, 1, 9, 9, 9, 9, 9, 9, 0, 9, 1],
                     [ 1, 0, 0, 9, 9, 9, 9, 9, 4, 9, 1, 9, 9, 9, 2, 2, 9, 0, 9, 0],
                     [ 1, 0, 0, 9, 9, 9, 9, 9, 0, 9, 1, 1, 0, 0, 3, 3, 9, 0, 0, 0],
                     [ 1, 1, 0, 9, 9, 9, 9, 9, 4, 9, 1, 0, 0, 1, 3, 3, 9, 0, 0, 0],
                     [ 1, 1, 0, 9, 9, 9, 9, 9, 4, 9, 1, 9, 9, 9, 2, 2, 9, 0, 9, 0],
                     [ 1, 1, 0, 9, 9, 9, 9, 9, 4, 9, 0, 9, 9, 9, 9, 9, 9, 0, 9, 0],
                     [ 1, 1, 0, 9, 9, 9, 9, 9, 4, 9, 0, 1, 1, 1, 1, 1, 1, 0, 9, 1],
                     [ 1, 1, 0, 9, 9, 9, 9, 9, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1],
                     [ 1, 1, 0, 9, 9, 9, 9, 9, 0, 0, 0, 0, 1, 1, 1, 0, 5, 1, 1, 1],
                     [ 1, 1, 0, 9, 9, 9, 9, 9, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
                     [ 1, 1, 0, 0, 0, 0, 0, 0, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
                     [ 1, 0, 0, 9, 9, 9, 9, 9, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
                     [ 9, 9, 9, 9, 9, 9, 9, 9, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9] ];
secondMapObstacleData = 
                   [ [ 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                     [ 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                     [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                     [ 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                     [ 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                     [ 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                     [ 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
                     [ 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
                     [ 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
                     [ 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                     [ 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                     [ 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
                     [ 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
                     [ 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
                     [ 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                     [ 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                     [ 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                     [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                     [ 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                     [ 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] ];

thirdMapData =     [ [ 9, 9, 9, 9, 9, 9, 9, 9, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
                     [ 9, 9, 9, 9, 9, 9, 9, 9, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
                     [ 9, 9, 9, 9, 9, 9, 9, 9, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
                     [ 9, 9, 9, 9, 9, 9, 9, 9, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
                     [ 9, 9, 9, 9, 9, 9, 9, 9, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                     [ 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 4, 9, 9, 9, 9, 9, 9, 9, 9, 0],
                     [ 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 4, 9, 9, 9, 9, 9, 9, 9, 9, 4],
                     [ 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 4, 9, 9, 9, 9, 9, 9, 9, 9, 4],
                     [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 9, 9, 9, 9, 9, 9, 9, 9, 4],
                     [ 0, 6, 9,18,10,10,10,10,10,18, 2,18,11,11,11,11,18, 9, 6, 0],
                     [ 0, 0, 9,18,16,16, 2, 2, 2,18, 2,18, 3, 3,15,16,18, 9, 0, 0],
                     [ 0, 0, 9,18, 2, 2, 2, 2, 2,18, 2,18, 3, 3, 3, 3,18, 9, 9, 0],
                     [ 7, 0, 9,18, 2, 2, 2, 2, 2,18, 2,18, 3, 3, 3, 3,18, 9, 9, 0],
                     [ 0, 0, 9,18,10,10,10,10, 2,13, 2,14, 3,11,11,11,18, 9, 9, 0],
                     [ 0, 0, 9,18, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,18, 9, 9, 0],
                     [ 0, 0, 9,18, 2, 2, 2, 2, 2, 2, 2,12,10,10,10,10,18, 9, 9, 0],
                     [ 0, 0, 9,18, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,16,18, 9, 9, 0],
                     [ 0, 0, 9,18, 2, 2, 2, 2, 2, 2, 2,18, 2, 2, 2, 2,18, 9, 9, 0],
                     [ 1, 0, 9,18,17,15, 2,17, 2, 2,17,18, 2, 2, 2, 2,18, 9, 9, 0],
                     [ 1, 1, 1,10,10,10,10,10,10,10,10,10,10,10,10,10,10, 0, 0, 0] ];

thirdMapObstacleData = 
                   [ [ 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                     [ 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                     [ 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                     [ 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                     [ 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                     [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                     [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                     [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                     [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                     [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                     [ 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0],
                     [ 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0],
                     [ 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0],
                     [ 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0],
                     [ 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
                     [ 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                     [ 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
                     [ 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0],
                     [ 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0],
                     [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0] ];
}

function setManifest(){

    manifest = [
        {id: "yuushaImg", type:"image", src: "http://jsrun.it/assets/n/x/7/h/nx7he.png" },

        {id: "witchImg", type:"image", src: "http://jsrun.it/assets/o/o/q/D/ooqDn.png" },

        {id: "priestImg", type:"image", src: "http://jsrun.it/assets/n/N/o/U/nNoU9.png" },

        {id: "shikabaneImg", type:"image", src: "http://jsrun.it/assets/i/n/z/v/inzvo.png" },

        {id: "mapImg", type:"image", src: "http://jsrun.it/assets/w/c/m/E/wcmEC.png" },

        {id:"leftButtonImg", 
         type:"image", 
         src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAVklEQVQ4ja2TMQ4AIAjE+v9Pn4MLIkZQTFiENkEEQLcDKKoDhC+y4WGfkzQFVXi5j5IZ+CjIwqGgAm+CKrwIXuBewXcLLY/YMsaWj1SRhFPISgz3t84DFIz6FDNASPsAAAAASUVORK5CYII="},

        {id:"rightButtonImg", 
         type:"image", 
         src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAV0lEQVQ4jb3TwQ4AEAwD0P7/T9cBl6Wj0oSTsL0MAwCsAwDVuoyrSTtRzWsMyQl0AQ7SAg5yBW6IBZwQG+iQJ0Ahf4HoCNElRs8YNdJTK8vSjOS1l33nARoy+hQuSDBSAAAAAElFTkSuQmCC"},

        {id:"upButtonImg", 
         type:"image", 
         src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAWklEQVQ4jb2SwQoAIAhD3///tJ0KUjPbISFQ55ZaAKYaYGyBOy2sKsj8UJOBTzkP+JurToKA5M/EbeYMXwKdhR3H65KLTvrkQ+0bOYgo5OtH+i+g7mC9gmqADalv+hRh7HQBAAAAAElFTkSuQmCC"},

        {id:"downButtonImg", 
         type:"image", 
         src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAYElEQVQ4jc2TQQoAIAgE9/+ftkMQalq6XQoCzXUSLQAQdgEQGKexVx6TrCEfAJTBJE9AF2K02qlANr0f4wnidaaJN0gU36ZA2f62sMyksvQdtM6yplUaG07BCwqxt+88AIVA+hSZ+rCyAAAAAElFTkSuQmCC"},

        {id:"aButtonImg", 
         type:"image", 
         src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAU0lEQVQ4jbWSWwoAIAgE5/6Xtr8wI1+Y4IfiDrIKIN0AhKMo5NZ1xBriAqLtXIDuuzNfAKXeOCA0LQMIn+cFyPzENT8GyIgtZA5QEVuzyTjvXWQBOLwGF55pZ7YAAAAASUVORK5CYII="},

        {id:"bButtonImg", 
         type:"image", 
         src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAASUlEQVQ4jWNgYGD4Ty5gYGD4z4DCIQHD9SFrxmsTDkMwDMCpkBIDcMkNUgMIRhu5LkCJOnINQFczXA0gJSbgBhBjM54YoSw7AwBBsi/tTbP8zwAAAABJRU5ErkJggg=="}
    ];

}
