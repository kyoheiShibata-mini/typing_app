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

          subtitleText: {
            className: 'Label',
            arguments: {
              fontFamily: 'HiraMinPro-W6',
              text: '~ 火事と喧嘩は江戸の花 ~',
              fill: 'red',
              stroke: 'yellow',
              strokeWidth: 5,
              fontSize: SCREEN_HEIGHT / 12,
            },
            x: this.gridX.center(),
            y: this.gridY.center(3),
          },

          startText: {
            className: 'Label',
            arguments: {
              fontFamily: 'HiraMinPro-W6',
              text: '開始',
              fill: 'white',
              stroke: null,
              fontSize: SCREEN_HEIGHT / 13,
            },
            x: this.gridX.center(),
            y: this.gridY.center(7),
          },
        }
      });
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

    // タッチ時
    onpointend: function() {
      SoundManager.play("start");
      // 次のシーンへ
      this.app.replaceScene(Main());
    },
  });
}