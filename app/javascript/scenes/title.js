import * as setting from "scenes/setting";

/*
 * タイトルシーン
 */
export function title(){
  // グローバルに展開
  phina.globalize();

  // 定数var 
  var SCREEN_WIDTH = setting.SCREEN_WIDTH; 
  var SCREEN_HEIGHT = setting.SCREEN_HEIGHT;
  var BG_COLOR = setting.BG_COLOR;


  phina.define('Title', {
    // 継承
    superClass: 'DisplayScene',
    // コンストラクタ
    init: function(params) {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
      });

      //背景画像
      var bg = Sprite('title_bg').addChildTo(this);
      bg.x = this.gridX.center();
      bg.y = this.gridY.center(-2);
      bg.width = SCREEN_WIDTH;
      bg.height = SCREEN_HEIGHT;
      
      var logo = Sprite('logo').addChildTo(this);
      logo.x = this.gridX.center();
      logo.y = this.gridY.center(-2);
      logo.width = SCREEN_WIDTH * 0.6;
      logo.height = SCREEN_HEIGHT * 0.6;

      var self = this;

      this.backgroundColor = BG_COLOR;

      this.fromJSON({
        children: {

          startText: {
            className: 'Label',
            arguments: {
              fontFamily: 'HiraMinPro-W6',
              text: '制限時間を選んでください',
              fill: 'white',
              stroke: null,
              fontSize: SCREEN_HEIGHT / 25,
            },
            x: this.gridX.center(),
            y: this.gridY.center(5),
          },
        }
      });
      
      var matu_Button = Button({
        fontFamily: 'HiraMinPro-W6',
        x: this.gridX.center(-5),
        y: this.gridY.center(7),
        width: 220,         // 横サイズ
        height: 55,        // 縦サイズ
        text: "松 (60秒)",     // 表示文字
        fontSize: SCREEN_HEIGHT / 20,
        fontColor: 'white', // 文字色
        cornerRadius: 10,   // 角丸み
        fill: '#192f60',    // ボタン色
        stroke: "#19448e",
        strokeWidth: 5,     // 枠太さ
      }).addChildTo(this);

      var take_Button = Button({
        fontFamily: 'HiraMinPro-W6',
        x: this.gridX.center(),
        y: this.gridY.center(7),
        width: 220,         // 横サイズ
        height: 55,        // 縦サイズ
        text: "竹 (90秒)",     // 表示文字
        fontSize: SCREEN_HEIGHT / 20,
        fontColor: 'white', // 文字色
        cornerRadius: 10,   // 角丸み
        fill: '#192f60',    // ボタン色
        stroke: "#19448e",
        strokeWidth: 5,     // 枠太さ
      }).addChildTo(this);

      var ume_Button = Button({
        fontFamily: 'HiraMinPro-W6',
        x: this.gridX.center(5),
        y: this.gridY.center(7),
        width: 220,         // 横サイズ
        height: 55,        // 縦サイズ
        text: "梅 (120秒)",     // 表示文字
        fontSize: SCREEN_HEIGHT / 20,
        fontColor: 'white', // 文字色
        cornerRadius: 10,   // 角丸み
        fill: '#192f60',    // ボタン色
        stroke: "#19448e",
        strokeWidth: 5,     // 枠太さ
      }).addChildTo(this);
      
      matu_Button.onpointend = function(){
        self.gotoMain(60);
      };
      take_Button.onpointend = function(){
        self.gotoMain(90);
      };
      ume_Button.onpointend = function(){
        self.gotoMain(120);
      };

      // 文字点滅
      this.startText.tweener.fadeOut(1000).fadeIn(1000).setLoop(true).play();
    },
    
    onenter: function() {
      //サーバーからkeywordテーブルのデータを取得
      const XHR = new XMLHttpRequest();
      XHR.open("GET", "/typings/new");
      XHR.send();

      SoundManager.stop();
    },

    gotoMain: function(jikan){
      SoundManager.play("start");
      // 次のシーンへ
      this.app.replaceScene(Main(jikan));
    },
  });
}