// forked from siouxcitizen's "CreateJS 0.6.1 �O��R�[�h����퓬���ǂ��@�\�ǉ�" http://jsdo.it/siouxcitizen/1mJ8
//
//�����̃X�}�z���瑀��ł���Q�[���ڎw���āB�B�B(�����̃X�}�z�ł̓����������Ȃ��Ă��܂������B�B�B)
//�����̃X�}�z���炾��A�{�^�����A�łɂȂ��Ă��܂��₷���B�B�B
//
//
//�O��́@[�ŏ��̉�ʂ��牺�ɍs����2��ʖڂ́u�����΂ˁv�Ɛ킦��悤�ɂ��Ă݂܂���]�@�̒P���Ȑ퓬�@�\�ɉ����āA
//�G�ɋ����Ƀ��x���𕡐��p�ӂ�����ŁA�|�������̓G����{�[�������炢�A
//�W�߂��{�[����������ŗE�҂����x���A�b�v�Ƃ����V�X�e����ǉ����Ă݂܂����B
//
//�e�X�g�Ƃ��p�����[�^�[�̃o�����X���Ȃ񂩂͂قƂ�ǂ���Ă܂���B�B�B
//�o�O��������
//
//
//����{�^�������z�L�[��A�{�^���A�܂��̓L�[�{�[�h��Z�{�^��
//B�{�^�������z�L�[��B�{�^���A�܂��̓L�[�{�[�h��B�{�^�����E�҃L�����̈ړ��X�s�[�h�ύX
//
//
//1��ʖ�
//����{�^���őm���ɘb�������邱�Ƃ��ł��܂��@�m���������I�Ȋ����ŃV�X�e���������܂��B�B�B
//�����Ȃ��Ƃ���Ō���{�^���������ƗE�҂̃X�e�[�^�X���\������܂�
//
//2��ʖ�
//����{�^���œG�u�����΂ˁv�Ɛ퓬�ł��܂�
//2��ʖڂł̗E�҂̏ꏊ���ς��Əo�Ă���u�����΂ˁv�̃��x�����ω����܂�
//�u�{�X�����΂ˁv��|���ƃQ�[���I���ƂȂ�܂�
//�u�����΂ˁv�͋����̃��x���ɂ�炸�S�ē����摜�ł��B�B�B
//
//3��ʖ�
//����{�^���Ŗ����ɘb�������邱�Ƃ��ł��܂�
//�{�[�����\���ɂ���΃{�[���Ŕ����쐬�E�g�p���ėE�҂̃��x���A�b�v���ł��܂�
//�����Ȃ��Ƃ���Ō���{�^���������ƗE�҂̃X�e�[�^�X���\������܂�
//
//
//���łɁA
//�w�E���ꂽ���΂ɂȂ��Ă���A�{�^����B�{�^���̈ʒu���C��
//CreateJS��0.61�ł͂Ȃ�EaselJS��0.61�ł���悤�Ƀ^�C�g�����C��
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

var mapState = 0; //�}�b�v�P�p�A�}�b�v�Q�p�A�}�b�v�R�p

//�{�^���p�摜
var leftButtonBmp;     //���{�^���摜
var rightButtonBmp;    //�E�{�^���摜
var upButtonBmp;       //��{�^���摜
var downButtonBmp;     //���{�^���摜
var aButtonBmp;        //A�{�^���摜
var bButtonBmp;        //B�{�^���摜

var prevDirection = 0;
var direction = 4; //�����Ă������� �i0�`3�F���㍶�E  4:�~�j
var keyFlags = [false, false, false, false];

var graphics;
var backGroundRect;
var mapGround;
var mapData;
var mapObstacleData;
//�X�v���C�g�V�[�g�ɂ��E�҃A�j���[�V�����p
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
//�}�b�v�`�b�v�̕`��w����s�Ȃ��z��
//���ۂ̒l�́@�֐��@setMapData()�@�Őݒ�
var firstMapData;
var firstMapObstacleData;
var secondMapData;
var secondMapObstacleData;
var thirdMapData;
var thirdMapObstacleData;
//�}�b�v�ԍ��@�ǂ̔z����g���ă}�b�v�`�b�v�̕`����s�Ȃ�������p
var mapNumber = 1;

var yuushaLevelPara;
//yuushaParam�@���@(lifePoint, maxLifePoint, attackPoint, defencePoint, bone)
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

    //�}�b�v�`�b�v�̕`��w����s�Ȃ��z����Z�b�g
    setMapData();

    //�w�i�h��Ԃ��p��`
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

    //�E�҃p�����[�^�ݒ�(�\���p�ȊO�̃p�����[�^�ݒ�)
    //var Yuusha = function(lifePoint, maxLifePoint, attackPoint, defencePoint, bone)
    //���
    yuushaParam = new Yuusha(yuushaLevelParam[0][0], 
                             yuushaLevelParam[0][1], 
                             yuushaLevelParam[0][2], 
                             yuushaLevelParam[0][3], 
                             yuushaLevelParam[0][4]); 

    //�E�҃A�j���[�V�����p�̃X�v���C�g�V�[�g���쐬
    var spriteSheet = new createjs.SpriteSheet({
        images: [queue.getResult("yuushaImg")],
        //��manifest�ɂ�郍�[�h���g�킸�A�ȉ��̂悤�ɒ��ډ摜�̃p�X���w�肵�Ă������܂���
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

    //�m���A�j���[�V�����p�̃X�v���C�g�V�[�g���쐬
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

    //�����A�j���[�V�����p�̃X�v���C�g�V�[�g���쐬
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

    //�����΂˃A�j���[�V�����p�̃X�v���C�g�V�[�g���쐬
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

    //��b���b�Z�[�W�p���w�i
    talkingGraphics = new createjs.Graphics();
    talkingGraphics.setStrokeStyle(2).beginStroke("#FFFFFF");
    talkingGraphics.beginFill("#000000");
    //talkingGraphics.drawRoundRect(0,0,340,150,10);
    talkingGraphics.drawRoundRect(0,0,440,270,10);
    talkingGraphics.endFill();
    talkingBackGroundRect = new createjs.Shape(talkingGraphics);
    //��b���b�Z�[�W�\���pText�I�u�W�F�N�g�𐶐��E�ݒ� 
    talkingMessage = new createjs.Text("", "20px Arial", "#FFFFFF");

    //�퓬��ʁ����b�Z�[�W�p���w�i
    battleGraphics = new createjs.Graphics();
    battleGraphics.setStrokeStyle(2).beginStroke("#FFFFFF");
    battleGraphics.beginFill("#000000");
    battleGraphics.drawRoundRect(0,0,440,270,10);
    battleGraphics.endFill();
    battleBackGroundRect = new createjs.Shape(battleGraphics);
    //��b���b�Z�[�W�\���pText�I�u�W�F�N�g�𐶐��E�ݒ� 
    battleMessage = new createjs.Text("", "20px Arial", "#FFFFFF");

    //�A�j���[�V����������L�����̍ŏ��̍��W��ݒ�
    charaX = 192; //  //32�̔{��
    charaY = 192; //  //32�̔{��
    //�������ɋ߂�32�̔{���l���g�p
    //���L�������N�^�[�ƃ}�b�v�̉摜��32��32�P�ʂŕ\�����Ă��邽��
    //charaX = 209; //450/2 -16  //32�̔{���łȂ�  //������4�𑝌����Ă�32�Ŋ���؂�Ȃ��̂Ŗv
    //charaY = 209; //450/2 -16  //32�̔{���łȂ�  //������4�𑝌����Ă�32�Ŋ���؂�Ȃ��̂Ŗv
    yuusha.x = charaX;
    yuusha.y = charaY;

    //�{�^���쐬
    //���{�^���쐬
    leftButtonBmp = new createjs.Bitmap(queue.getResult("leftButtonImg"));
    leftButtonBmp.x = 10;
    leftButtonBmp.y = 330;
    leftButtonBmp.scaleX = leftButtonBmp.scaleY = 4;
    leftButtonBmp.alpha = 0.6;
    leftButtonBmp.addEventListener('mousedown',onPressLeftButton,false);
    stage.addChild(leftButtonBmp);

    //�E�{�^���쐬
    rightButtonBmp = new createjs.Bitmap(queue.getResult("rightButtonImg"));
    rightButtonBmp.x = 150;
    rightButtonBmp.y = 330;
    rightButtonBmp.scaleX = rightButtonBmp.scaleY = 4;
    rightButtonBmp.alpha = 0.6;
    rightButtonBmp.addEventListener('mousedown',onPressRightButton,false);
    stage.addChild(rightButtonBmp);

    //��{�^���쐬
    upButtonBmp = new createjs.Bitmap(queue.getResult("upButtonImg"));
    upButtonBmp.x = 80;
    upButtonBmp.y = 280;
    upButtonBmp.scaleX = upButtonBmp.scaleY = 4;
    upButtonBmp.alpha = 0.6;
    upButtonBmp.addEventListener('mousedown',onPressUpButton,false);
    stage.addChild(upButtonBmp);

    //���{�^���쐬
    downButtonBmp = new createjs.Bitmap(queue.getResult("downButtonImg"));
    downButtonBmp.x = 80;
    downButtonBmp.y = 380;
    downButtonBmp.scaleX = downButtonBmp.scaleY = 4;
    downButtonBmp.alpha = 0.6;
    downButtonBmp.addEventListener('mousedown',onPressDownButton,false);
    stage.addChild(downButtonBmp);

    //A�{�^���쐬
    aButtonBmp = new createjs.Bitmap(queue.getResult("aButtonImg"));
    //aButtonBmp.x = 270;
    //aButtonBmp.y = 330;
    aButtonBmp.x = 370;
    aButtonBmp.y = 330;
    aButtonBmp.scaleX = aButtonBmp.scaleY = 4;
    aButtonBmp.alpha = 0.6;
    aButtonBmp.addEventListener('mousedown',onPressAButton,false);
    stage.addChild(aButtonBmp);
    
    //B�{�^���쐬
    bButtonBmp = new createjs.Bitmap(queue.getResult("bButtonImg"));
    //bButtonBmp.x = 370;
    //bButtonBmp.y = 330;
    bButtonBmp.x = 270;
    bButtonBmp.y = 330;
    bButtonBmp.scaleX = bButtonBmp.scaleY = 4;
    bButtonBmp.alpha = 0.6;
    bButtonBmp.addEventListener('mousedown',onPressBButton,false);
    stage.addChild(bButtonBmp);

    //���b�Z�[�W�������[�X���čĔz�u
    stage.removeChild(message);
    message.text = ""
    stage.addChild(message);
    //message.x = 0;
    //message.y = 0;

    //30FPS�ŃX�^�[�g
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addListener(this);

    //�L�[�������ꂽ���̃C�x���g���X�i�[�̓o�^
    document.addEventListener('keydown', handleKeyDown, false);
    //�L�[�������ꂽ���̃C�x���g���X�i�[�̓o�^
    document.addEventListener('keyup', handleKeyUp, false);
}

//�L�[�{�[�h�̃L�[�������ꂽ���̏���
function handleKeyDown(event) {
    if (event.keyCode==40 || event.keyCode==83) {//�� s �{�^��        
        if (isBattle) return;  //�퓬���͈ړ��ł��Ȃ�
        keyFlags[0] = true;
    } else if (event.keyCode==38 || event.keyCode==87) {//�� w �{�^��
        if (isBattle) return;
        keyFlags[1] = true;
    } else if (event.keyCode==37 || event.keyCode==65) {//�� a �{�^��
        if (isBattle) return;
        keyFlags[2] = true;
    } else if (event.keyCode==39 || event.keyCode==68) {//�� d �{�^��
        if (isBattle) return;
        keyFlags[3] = true;
    } else if (event.keyCode==66) {//b �{�^��
        changeCharaSpeed();
    } else if (event.keyCode==90 || event.keyCode==190) {//z . �{�^��
        talkToNPC();
    }
}
//talkToNPC()
//�r�b�g�}�b�v�{�^���������ꂽ���̏���
function onPressLeftButton(event) {
    //�퓬���͈ړ������Ȃ�
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

//����L�����̈ړ��X�s�[�h��ω������܂�
function onPressBButton(event) {
    changeCharaSpeed();
    event.addEventListener("mouseup", releaseBButton);
}

//�L�[�{�[�h�̃L�[�������ꂽ���̏���
function handleKeyUp(event) {
    if (event.keyCode==40 || event.keyCode==83) {//�� s �{�^��
        keyFlags[0] = false;
    } else if (event.keyCode==38 || event.keyCode==87) {//�� w �{�^��
        keyFlags[1] = false;
    } else if (event.keyCode==37 || event.keyCode==65) {//�� a �{�^��
        keyFlags[2] = false;
    } else if (event.keyCode==39 || event.keyCode==68) {//�� d �{�^��
        keyFlags[3] = false;
    } else if (event.keyCode==66) {//b �{�^��
        message.text = "";
    } else if (event.keyCode==90 || event.keyCode==190) {//z . �{�^��
    }
}
//�r�b�g�}�b�v�{�^���������[�X���ꂽ���̏���
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
    if (isGameOver) return; //�Q�[���I�[�o�[���͑���ł��Ȃ��悤�ɂ���
   
    if ((mapNumber == 1 || mapNumber == 3) && mapState == 1) { //�}�b�v1�܂��̓}�b�v3�ŉ�b����B�{�^�������ŉ�b�E�B���h�E�����
        closeTalkingScene(); 
        mapState = 0;
        return;
    }

    //����L�������}�b�v�`�b�v�ɂ��傤�ǂ����܂��Ă���Ƃ��̂ݑ���\
    //���W�̌v�Z�̂�����ӂ�������(���Ԃ�)
    if ((charaX % 32) == 0 && (charaY % 32) == 0) {
        if (charaSpeed == 4) {
            charaSpeed = 8;
            message.text = "B �_�b�V�� !";
        } else if (charaSpeed == 8) {
            charaSpeed = 16;
            message.text = "�ʏ�̂R�{�̓���!!!";
        } else if (charaSpeed == 16) {
            charaSpeed = 4;
            message.text = "�ʏ�̈ړ����x�ɂȂ�܂���";
        } 
    }
}

function talkToNPC() {

    //����L�������}�b�v�`�b�v�ɂ��傤�ǂ����܂��Ă���Ƃ��̂ݑ���\
    //���W�̌v�Z�̂�����ӂ�������(���Ԃ�)
    if ((charaX % 32) == 0 && (charaY % 32) == 0) {
        if (isGameOver) return; //�Q�[���I�[�o�[���͑���ł��Ȃ��悤�ɂ���

        var x;
        var y;
        x = Math.floor(charaX/32);
        y = Math.floor(charaY/32); //

        var talkingMessageTxt;

        //�}�b�v�P�̏����@�X�^�[�g����������������������������������������������������������������������������������������������������������������������������������
        if (mapNumber == 1) {
                if (mapState == 0) {
                    closeTalkingScene(); 
	            //�}�b�v1�őm���ɘb���������ꍇ
	            if ((x == 8 && y == 2 && prevDirection == 1) || (x == 7 && y == 1 && prevDirection == 3)) {
                        isTalking = true;
                        //��b���b�Z�[�W��\��
                        talkingMessageTxt = "�����A�悭���܂�����" + "\n"
                                          + "�E�҃u���C��!!!" + "\n"
                                          + "\n"
                                          + "���Ȃ��ɂ͂��Б��Ŗ\��܂���Ă���" + "\n"
                                          + "�u�����΂ˁv�̃{�X��|���ė~����" + "\n"
                                          + "������艺���́u�����΂ˁv�̑��A�̉���" + "\n"
                                          + "�u�{�X�����΂ˁv�͂���悤����" + "\n"
                                          + "(2��ʖ�)" + "\n"
                                          + "\n"
                                          + "�u�����΂ˁv��|���Ǝ�ɓ���{�[����" + "\n"
                                          + "�\�͋����̔��ƌ������邱�Ƃ��\����" + "\n"
                                          + "(3��ʖ�)" + "\n"
                                          + "\n";

                        initTalkingScene(talkingMessageTxt);
                        mapState = 1;
                    } else { //�b��������ȊO�̏ꏊ�Ō���{�^��������
                        isTalking = true;
                        //�E�҃X�e�[�^�X��\��
                        talkingMessageTxt = "�X�e�[�^�X" + "\n"
                                          + "���O�F�E�҃u���C��" + "\n"
                                          + "\n"
                                          + "���x���F  " + yuushaParam.level + "\n"
                                          + "�ő僉�C�t�|�C���g�F   " + yuushaParam.maxLifePoint + "\n"
                                          + "�U���́F  " + yuushaParam.attackPoint + "\n"
                                          + "�h��́F  " + yuushaParam.defencePoint + "\n"
                                          + "\n"
                                          + "�����{�[���F  " + yuushaParam.bone + "\n"
                                          + "\n"
                                          + "�m�b�N�A�E�g�񐔁F  " + yuushaParam.knockoutCnt + "\n"
                                          + "\n";
                        initTalkingScene(talkingMessageTxt);
                        mapState = 1;
                    }
                } else if (mapState == 1) {
                    closeTalkingScene(); 
                    mapState = 0;
                }

        //�}�b�v�P�̏����@�G���h������������������������������������������������������������������������������������������������������������������������������������
        
        //�}�b�v�Q�̏����@�X�^�[�g����������������������������������������������������������������������������������������������������������������������������������
        } else if (mapNumber == 2) {
                if (!isBattle) {
                    isTalking = false;
                    initBattleScene("�����΂˂������ꂽ�I�I�I" + "\n\n\n" + "�E�҃��C�t�|�C���g "+ yuushaParam.maxLifePoint + "/" + yuushaParam.lifePoint + "\n");

                    if (x == 8) { 

                        enemyParam = new Enemy("���x���P�����΂�", 35, 35, 5, 4, 10);

                    } else if (x < 8){

                        enemyParam = new Enemy("���x���Q�����΂�", 40, 40, 10, 8, 20);

                    } else if ( (x == 14 || x == 15) && (y == 9 || y == 10) ) {

                        enemyParam = new Enemy("�{�X�����΂�", 85, 85, 30, 25, 160);
                        //enemyParam = new Enemy("�{�X�����΂�", 1, 1, 2, 2, 160); //�e�X�g�p

                    } else if ((8 < x && x < 17) && (5 < y && y < 14) ) {

                        enemyParam = new Enemy("���x���S�����΂�", 65, 65, 20, 16, 80);

                    } else if (x > 8) {

                        enemyParam = new Enemy("���x���R�����΂�", 50, 50, 15, 12, 40);

                    }
                    isBattle = true;

                } else if (isBattle && !isBattleOver) {
                    var damage;
                    //var damage = Math.floor(Math.random()*10);
                    if(yuushaParam.battleYuushaTurn) {
                        if (enemyParam.lifePoint < 0) {
                            battleMessage.text = "�����΂˂����������I" + "\n"
                                               + "�E�҂�"+ enemyParam.bone + "�{�[�����Ă��ɂ��ꂽ�I�I" + "\n"
                                               + "\n"
                                               + "�E�҃��C�t�|�C���g "+ yuushaParam.maxLifePoint + "/" + yuushaParam.lifePoint + "\n"
                                               + "\n";

                            yuushaParam.bone = yuushaParam.bone + enemyParam.bone;
                            yuushaParam.lifePoint = yuushaParam.maxLifePoint; //�퓬�I����̗͉͑�
                            //�����΂ˉ摜�������[�X
                            stage.removeChild(shikabane);
                            isBattleOver = true;

                            if (enemyParam.name =="�{�X�����΂�") {
                                battleMessage.text = battleMessage.text 
                                                   + "\n" 
                                                   + "�{�X�����΂˂�|�����I�I�I�I" 
                                                   + "\n" 
                                                   + "\n" 
                                                   +"��������GAME CLEAR��������"
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

                        battleMessage.text = "�E�҂̍U��" + "\n"
                                           + enemyParam.name  + "��"+ damage + "�̃_���[�W��������" + "\n"
                                           + "\n"
                                           + "�E�҃��C�t�|�C���g "+ yuushaParam.maxLifePoint + "/" + yuushaParam.lifePoint + "\n"
                                           + "\n";
                        enemyParam.lifePoint = enemyParam.lifePoint - damage;  

                        //�����΂ˉ摜��_�ł����ă_���[�W�����������\���ɂ��Ă��܂�
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

                        battleMessage.text = enemyParam.name  + "�̍U��" + "\n"
                                           + "�E�҂�" + damage + "�̃_���[�W��������" + "\n"
                                           + "\n"
                                           + "�E�҃��C�t�|�C���g "+ yuushaParam.maxLifePoint + "/" + yuushaParam.lifePoint + "\n"
                                           + "\n";

                        if(yuushaParam.lifePoint == 0) {
                            battleMessage.text = battleMessage.text
                                               + "�E�҂̓m�b�N�A�E�g����Ă��܂����I" + "\n"
                                               + "�����΂˂Ƀ{�[�����ׂĂ��Ƃ��Ă��܂����I�I" + "\n"
                                               + "�����΂˂͖��������ɋ����Ă������I�I�I" + "\n"
                                               + "\n";
                            //isGameOver = true;
                            yuushaParam.bone = 0;
                            yuushaParam.knockoutCnt = yuushaParam.knockoutCnt + 1;
                            yuushaParam.lifePoint = yuushaParam.maxLifePoint; //�퓬�I����̗͉͑�
                            //�����΂ˉ摜�������[�X
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
        //�}�b�v�Q�̏����@�G���h������������������������������������������������������������������������������������������������������������������������������������
        
        //�}�b�v�R�̏����@�X�^�[�g����������������������������������������������������������������������������������������������������������������������������������
        } else if (mapNumber == 3) {

                if (mapState == 0) {
	            //�}�b�v3�Ŗ����ɘb���������ꍇ
	            if ((x == 4 && y == 15 && prevDirection == 0) || (x == 5 && y == 16 && prevDirection == 2) || (x == 4 && y == 17 && prevDirection == 1)) {
	                if ( yuushaParam.level < yuushaLevelParam.length) {
                            isTalking = true;
                            //��b���b�Z�[�W��\��
                            talkingMessageTxt = "�s�v�c�ȃ{�[���ł���" + "\n"
                                              + "���͂���񂩂ˁH" + "\n"
                                              + "���x��" + yuushaParam.level + "���F " + (yuushaParam.level * 20) +"�{�[��" + "\n"
                                              + "\n"
                                              + "�����{�[���F " + yuushaParam.bone + "\n"
                                              + "";
                            initTalkingScene(talkingMessageTxt);
                            mapState = 1;
	                } else {
                            isTalking = true;
                            //��b���b�Z�[�W��\��
                            talkingMessageTxt = "���Ȃ��͂����\���ɋ����I" + "\n"
                                              + "����ȏ�̔��͂����K�v�Ȃ����낤" + "\n"
                                              + "\n"
                                              + "";
                            initTalkingScene(talkingMessageTxt);
                            mapState = 2;
	                }
                    } else { //�}�b�v3�Ŗ����ɘb������ȊO�̏ꏊ�Ō���{�^��������
                        isTalking = true;
                        //�E�҃X�e�[�^�X��\��
                        talkingMessageTxt = "�X�e�[�^�X" + "\n"
                                          + "���O�F�E�҃u���C��" + "\n"
                                          + "\n"
                                          + "���x���F" + yuushaParam.level + "\n"
                                          + "�ő僉�C�t�|�C���g�F" + yuushaParam.maxLifePoint + "\n"
                                          + "�U���́F" + yuushaParam.attackPoint + "\n"
                                          + "�h��́F" + yuushaParam.defencePoint + "\n"
                                          + "\n"
                                          + "�����{�[���F  " + yuushaParam.bone + "\n"
                                          + "\n"
                                          + "�m�b�N�A�E�g�񐔁F  " + yuushaParam.knockoutCnt + "\n"
                                          + "\n";
                        initTalkingScene(talkingMessageTxt);
                        mapState = 2;
                    }
                } else if (mapState == 1) {

                    if (yuushaParam.bone >= (yuushaParam.level * 20)) {

                        //�E�҂̃��x�����グ��O�Ƀ��x�������Ƃɂ��������{�[���̌��Z���s�Ȃ��Ă���
                        yuushaParam.bone = yuushaParam.bone - (yuushaParam.level * 20);

                        //yuushaParam�@���@(lifePoint, maxLifePoint, attackPoint, defencePoint, bone)
                        yuushaParam.level = yuushaParam.level + 1;
                        yuushaParam.lifePoint    = yuushaLevelParam[yuushaParam.level-1][0]
                        yuushaParam.maxLifePoint = yuushaLevelParam[yuushaParam.level-1][1]
                        yuushaParam.attackPoint  = yuushaLevelParam[yuushaParam.level-1][2]
                        yuushaParam.defencePoint = yuushaLevelParam[yuushaParam.level-1][3]

                        talkingMessage.text = "���x��" + (yuushaParam.level - 1) + "�����Ăɂ��ꂽ!" + "\n"
                                            + "�E�҂̓��x��" + (yuushaParam.level - 1) + "�����g�p����!!" + "\n"
                                            + "\n"
                                            + "�E�҂̓��x��" + yuushaParam.level + "�ɂȂ���!!!" + "\n"
                                            + "\n"
                                            + "���C�t�|�C���g��" + yuushaParam.maxLifePoint + "�ɂȂ���!" + "\n"
                                            + "�U���͂�" + yuushaParam.attackPoint + "�ɂȂ���!" + "\n"
                                            + "�h��͂�" + yuushaParam.defencePoint + "�ɂȂ���!" + "\n"
                                            + "\n"
                                            + "";
                    } else {
                        talkingMessage.text = "���̂��߂̃{�[����" + "\n"
                                            + "����Ȃ��悤��" + "\n"
                                            + "";
                    }
                    mapState = 2;
                } else if (mapState == 2) {
                    closeTalkingScene(); 
                    mapState = 0;
                }
                  //mapState�@���@0: �������, 1 : �b�����������, 2 : �w��������, 3 :�w���L�����Z�����
        } 
        //�}�b�v�R�̏����@�G���h������������������������������������������������������������������������������������������������������������������������������������
       
    }
}

function initTalkingScene(msgTxt) {
    //��b���b�Z�[�W�p�̍��w�i��\��
    //talkingBackGroundRect.x = 70;
    //talkingBackGroundRect.y = 10;
    talkingBackGroundRect.x = 5;
    talkingBackGroundRect.y = 5;
    stage.addChild(talkingBackGroundRect);

    //��b���b�Z�[�W��\��
    talkingMessage.text = msgTxt;
    talkingMessage.x = 20;
    talkingMessage.y = 20;
    stage.addChild(talkingMessage);
}

function closeTalkingScene() {
    //��b���b�Z�[�W�p�̍��w�i�\���������[�X
    stage.removeChild(talkingBackGroundRect);

    //��b���b�Z�[�W�������[�X
    stage.removeChild(talkingMessage);

    isTalking = false;
    mapState = 0;
}

function initBattleScene(msgTxt) {
    //isBattle = true;
    isBattleOver = false;

    //�퓬���b�Z�[�W�p�̍��w�i��\��
    battleBackGroundRect.x = 5;
    battleBackGroundRect.y = 5;
    stage.addChild(battleBackGroundRect);

    //��b���b�Z�[�W��\��
    battleMessage.text = msgTxt;
    battleMessage.x = 20;
    battleMessage.y = 20;
    stage.addChild(battleMessage);

    //�����΂˂�HP��������
    enemyHP = 30;
    //�����΂ˉ摜��\��
    shikabane.x = 215;
    shikabane.y = 145;
    stage.addChild(shikabane);
}

function closeBattleScene() {
    //�퓬���b�Z�[�W�p�̍��w�i�\���������[�X
    stage.removeChild(battleBackGroundRect);

    //�퓬���b�Z�[�W�������[�X
    stage.removeChild(battleMessage);

    isBattle = false;
}

function tick(){

    if ((charaX % 32) == 0 && (charaY % 32) == 0) { //����L�����E�}�b�v�`�b�v�͏c��32�h�b�g���
        direction = 4; //�~�܂�

        //�Ƃ肠�������̕��@�ŗE�ҍ��W����z��C���f�b�N�X��ݒ�
        var x;
        var y;
        x = Math.floor(charaX/32);
        y = Math.floor(charaY/32); //
        //��Math.floor�ŏ����_�ȉ��؂�̂�

        if(keyFlags[0]) { //�� s �{�^��
            //�����{�^���������ꂽ�ꍇ�͉�b���b�Z�[�W���N���[�Y
            if(isTalking) closeTalkingScene();
            if (prevDirection != 0) {
                yuusha.gotoAndPlay("down");
                prevDirection = 0;
            }
            if (charaY <= 640-charaSpeed-32 && mapObstacleData[y+1][x] == 0){ //32�̓L�����`�b�v1���̍���
            //�ړ��X�s�[�h8�̏ꍇ
            //if (charaY <= 632-32 && mapObstacleData[y+1][x] == 0){ //32�̓L�����`�b�v�̍��� 
            //�c640�ƈړ��X�s�[�h8����@640-8=632���
            //�ړ��X�s�[�h4�̏ꍇ
            //if (charaY <= 636-32 && mapObstacleData[y+1][x] == 0){ //32�̓L�����`�b�v�̍���
            //�c640�ƈړ��X�s�[�h4����@640-4=636���
                //��32��20��640
                //���}�b�v�`�b�v1���̃s�N�Z�������}�b�v�`�b�v�w��z��̏c������
                direction = 0;
            }
        } else if (keyFlags[1]) { //�� w �{�^��
            //�����{�^���������ꂽ�ꍇ�͉�b���b�Z�[�W���N���[�Y
            if(isTalking) closeTalkingScene();
	    if (prevDirection != 1) { 
                yuusha.gotoAndPlay("up");
                prevDirection = 1;
            }
            if (charaY >= charaSpeed && mapObstacleData[y-1][x] == 0) { //�c�̏�����Ɉړ��X�s�[�h���̍���������Έړ�
            //�ړ��X�s�[�h8�̏ꍇ
            //if (charaY >= 8 && mapObstacleData[y-1][x] == 0) { //�c�̏�����Ɉړ��X�s�[�h8���̍���������Έړ�
            //�ړ��X�s�[�h4�̏ꍇ
            //if (charaY >= 4 && mapObstacleData[y-1][x] == 0) { //�c�̏�����Ɉړ��X�s�[�h4���̍���������Έړ�
                direction = 1;
            }
        } else if (keyFlags[2]) { //�� a �{�^��
            //�����{�^���������ꂽ�ꍇ�͉�b���b�Z�[�W���N���[�Y
            if(isTalking) closeTalkingScene();
	    if (prevDirection != 2) {
                yuusha.gotoAndPlay("left");
                prevDirection = 2;
            }
	    if (charaX >= charaSpeed && mapObstacleData[y][x-1] == 0) { //�����Ɉړ��X�s�[�h���̕�������Έړ�
            //�ړ��X�s�[�h8�̏ꍇ
	    //if (charaX >= 8 && mapObstacleData[y][x-1] == 0) { //�����Ɉړ��X�s�[�h8���̕�������Έړ�
            //�ړ��X�s�[�h4�̏ꍇ
	    //if (charaX >= 4 && mapObstacleData[y][x-1] == 0) { //�����Ɉړ��X�s�[�h4���̕�������Έړ�
                direction = 2; 
            }
        } else if (keyFlags[3]) { //�� d �{�^��
            //�����{�^���������ꂽ�ꍇ�͉�b���b�Z�[�W���N���[�Y
            if(isTalking) closeTalkingScene();
	    if (prevDirection != 3) {
                yuusha.gotoAndPlay("right");
                prevDirection = 3;
            }
	    if (charaX <= 640-charaSpeed-32 && mapObstacleData[y][x+1] == 0) { //32�̓L�����`�b�v1���̕�
            //�ړ��X�s�[�h8�̏ꍇ
	    //if (charaX <= 632-32 && mapObstacleData[y][x+1] == 0) { //32�̓L�����`�b�v�̕�
            //��640�ƈړ��X�s�[�h8����@640-8=632���
            //�ړ��X�s�[�h4�̏ꍇ
	    //if (charaX <= 636-32 && mapObstacleData[y][x+1] == 0) { //32�̓L�����`�b�v�̕�
            //��640�ƈړ��X�s�[�h4����@640-4=636���
                //��32��20��640
                //���}�b�v�`�b�v1���̃s�N�Z�������}�b�v�`�b�v�w��z��̉�������
                direction = 3;
            }
        }

    }

    //�}�b�v�J��
    changeMap(x,y);

    //���̃}�X�܂ő���L�����������I�ɕ�������(�Ɖ��肵�č��W�v�Z)
    if(direction == 0) {
        charaY += charaSpeed;
    } else if (direction == 1) {
        charaY -= charaSpeed;
    } else if (direction == 2) {
        charaX -= charaSpeed;
    } else if (direction == 3) {
        charaX += charaSpeed;
    }
    if (direction < 4) moveMap(); //�}�b�v���X�N���[��

    stage.update();
}

//�}�b�v�J��
function changeMap(x,y) {
    
    if (mapNumber == 1) {
	    //�}�b�v1����}�b�v2�֑J�ڎ�
	    if (x == 8 && y == 19) {
	        //�\������}�b�v�������z����Z�b�g
	        mapData = secondMapData;
	        mapObstacleData = secondMapObstacleData;
	        //����L�����̍��W��ݒ�
	        charaX = 256; //32*8
	        charaY = 32;  //32*(0+1)
	        //�O���t�B�b�N�`�b�v�A�L�����`�b�v���ĕ\��
	        mapNumber = 2;
	        drawGraphicChip();
	        moveMap(); //�}�b�v���X�N���[��
                mapState = 0;
	    }
    } else if (mapNumber == 2) {
            //�}�b�v2����}�b�v1�֑J�ڎ�
            if (x == 8 && y == 0) {
                //�\������}�b�v�������z����Z�b�g
                mapData = firstMapData;
                mapObstacleData = firstMapObstacleData;
                //����L�����̍��W��ݒ�
                charaX = 256; //32*8
                charaY = 576; //32*(19-1)
                //�O���t�B�b�N�`�b�v�A�L�����`�b�v���ĕ\��
                mapNumber = 1;
                drawGraphicChip();
                moveMap(); //�}�b�v���X�N���[��
                mapState = 0;
            //�}�b�v2����}�b�v3�֑J�ڎ�
            } else if (x == 8 && y == 19) {
                //�\������}�b�v�������z����Z�b�g
                mapData = thirdMapData;
                mapObstacleData = thirdMapObstacleData;
                //����L�����̍��W��ݒ�
                charaX = 256; //32*8
                charaY = 32;  //32*(0+1)
                //�O���t�B�b�N�`�b�v�A�L�����`�b�v���ĕ\��
                mapNumber = 3;
                drawGraphicChip();
                moveMap(); //�}�b�v���X�N���[��
                mapState = 0;
            }
    } else if (mapNumber == 3) {
            //�}�b�v3����}�b�v2�֑J�ڎ�
            if (x == 8 && y == 0) {
                //�\������}�b�v�������z����Z�b�g
                mapData = secondMapData;
                mapObstacleData = secondMapObstacleData;
                //����L�����̍��W��ݒ�
                charaX = 256; //32*8
                charaY = 576; //32*(19-1)
                //�O���t�B�b�N�`�b�v�A�L�����`�b�v���ĕ\��
                mapNumber = 2;
                drawGraphicChip();
                moveMap(); //�}�b�v���X�N���[��
                mapState = 0;
            }
    }
}

//�}�b�v���X�N���[��
function moveMap() {

    //(x, y) = (192,192)�͗E�҃L�����N�^�[��canvas��ɔz�u�������W
    //��������E�҃L�����N�^�[���v�Z��ړ��������������Ђ��āA
    //�X�N���[��������}�b�v�摜�̍�����W�𓱏o����
    mapGround.x = 192-charaX;
    mapGround.y = 192-charaY;

}

function drawGraphicChip() {

    //��x���ׂĂ�stage��Child���J�����Ă��������x�\���I�u�W�F�N�g��addChild���Ȃ���
    stage.removeAllChildren(); 
    //��O�̃}�b�v�̉摜��ێ��������Ȃ��悤��remove����(���Ԃ�)
    mapGround.removeAllChildren();

    //�w�i�Ĕz�u
    stage.addChild(backGroundRect);

    //�}�b�v�Ĕz�u
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

    //�E�҃L�����N�^�Ĕz�u
    stage.addChild(yuusha);

    //�}�b�v1�̂Ƃ��̂ݑm���L�����N�^�Ĕz�u
    if (mapNumber == 1) {
        mapGround.addChild(priest);
    //�}�b�v2�̂Ƃ��݂̂����΂˃L�����N�^�Ĕz�u
    } else if (mapNumber == 2) {
        //�����΂˂��܂��|����Ă��Ȃ��ꍇ�̂ݍĕ\��
        //if (isShikabane) mapGround.addChild(shikabane);
    //�}�b�v3�̂Ƃ��̂ݖ����L�����N�^�Ĕz�u
    } else if (mapNumber == 3) {
        mapGround.addChild(witch);
    }

    //�{�^���Ĕz�u
    stage.addChild(leftButtonBmp);
    stage.addChild(rightButtonBmp);
    stage.addChild(upButtonBmp);
    stage.addChild(downButtonBmp);
    stage.addChild(aButtonBmp);
    stage.addChild(bButtonBmp);

    //���b�Z�[�W�Ĕz�u
    stage.addChild(message);
}

var Yuusha = function(lifePoint, maxLifePoint, attackPoint, defencePoint, bone) {
    this.lifePoint = lifePoint;
    this.maxLifePoint = maxLifePoint;
    this.attackPoint = attackPoint;
    this.defencePoint = defencePoint;
    this.battleMessage = "";
    this.battleYuushaTurn = true; //true:�E�҂̍U���^�[���@false:�G�̍U���^�[��
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

//0:�Ő��@1:���@2:�Ώ�@3:�t���[�����O�@4:���i�c�j�@5:���i���j�@6:�؁i���j�@7:�؁i��j�@8:�T�{�e���@9:��
//10:�ǁi�΁j�@11:�ǁi�؁j�@12:�ǁi���퉮�j�@13:�ǁi�h��j�@14:�ǁi�h���j�@15:��@16:�^���X�@17:�Α��@18:�^����

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
