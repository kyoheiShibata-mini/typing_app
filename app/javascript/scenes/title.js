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
    bg.y = this.gridY.center();
    bg.width = SCREEN_WIDTH;
    bg.height = SCREEN_HEIGHT;

      this.backgroundColor = BG_COLOR;
      var fontColor = 'rgb(255,255,255)';
      var buttonSize = 168;

      this.fromJSON({
        children: {
          titleText: {
            className: 'Label',
            arguments: {
              fontFamily: 'YuMincho',
              text: '大江戸タイピング',
              fill: 'red',
              stroke: 'yellow',
              strokeWidth: 10,
              fontSize: SCREEN_HEIGHT / 5,
            },
            x: this.gridX.center(),
            y: this.gridY.center(-2),
          },

          subtitleText: {
            className: 'Label',
            arguments: {
              fontFamily: 'YuMincho',
              text: '~ 家事と喧嘩は江戸の花 ~',
              fill: 'red',
              stroke: 'yellow',
              strokeWidth: 5,
              fontSize: SCREEN_HEIGHT / 12,
            },
            x: this.gridX.center(),
            y: this.gridY.center(1),
          },

          startText: {
            className: 'Label',
            arguments: {
              fontFamily: 'YuMincho',
              text: '開始',
              fill: 'white',
              stroke: null,
              fontSize: SCREEN_HEIGHT / 10,
            },
            x: this.gridX.center(),
            y: this.gridY.center(6.5),
          },
        }
      });
      // 文字点滅
      this.startText.tweener.fadeOut(1000).fadeIn(1000).setLoop(true).play();
    },
    
    // タッチ時
    onenter: function() {
      SoundManager.stop();
    },

    // タッチ時
    onpointend: function() {
      // 次のシーンへ
      this.exit();
    },
  });
}