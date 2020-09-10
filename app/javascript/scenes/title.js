/*
 * タイトルシーン
 */
export function title(){
  // グローバルに展開
  phina.globalize();


    // 定数
    var SCREEN_WIDTH = 32 * 40; 
    var SCREEN_HEIGHT = 18 * 40; 
    var KEYWORD_SIZE = SCREEN_HEIGHT / 12;
    var KEYWORD_SPEED_X = 6;
    var KEYWORD_SPEED_Y = -10;
    var GRAVITY = 0.2;
    var COLORS = ['rgb(249,38,114)', 'rgb(166,226,46)', 'rgb(253,151,31)', 'rgb(102,217,239)'];
    var BG_COLOR = 'rgb(39,40,34)';
    var KEYWORDS = null;
    var INTERVAL = 1000;
    var CONTINUE = 3;

  phina.define('Title', {
    // 継承
    superClass: 'DisplayScene',
    // コンストラクタ
    init: function(params) {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
      });
      var tomapiko = Sprite('tomapiko').addChildTo(this);
    
      tomapiko.x = this.gridX.center();
      tomapiko.y = this.gridY.center();
      tomapiko.width = 128;
      tomapiko.height = 128;

      this.backgroundColor = BG_COLOR;
      var fontColor = 'rgb(255,255,255)';
      var buttonSize = 168;

      this.fromJSON({
        children: {
          titleText: {
            className: 'Label',
            arguments: {
              text: '大江戸タイピング',
              fill: 'rgb(166,226,46)',
              stroke: null,
              fontSize: SCREEN_HEIGHT / 6,
            },
            x: this.gridX.center(),
            y: this.gridY.span(5),
          },

          subtitleText: {
            className: 'Label',
            arguments: {
              text: '~ 一揆でござる ~',
              fill: 'rgb(253,151,31)',
              stroke: null,
              fontSize: SCREEN_HEIGHT / 12,
            },
            x: this.gridX.center(),
            y: this.gridY.center(),
          },

          explainText: {
            className: 'Label',
            arguments: {
              text: 'case-insensitive',
              fill: 'rgb(253,151,31)',
              stroke: null,
              fontSize: SCREEN_HEIGHT / 12,
            },
            x: this.gridX.center(),
            y: this.gridY.center(2),
          },

          startText: {
            className: 'Label',
            arguments: {
              text: '開始',
              fill: 'rgb(102,217,239)',
              stroke: null,
              fontSize: SCREEN_HEIGHT / 10,
            },
            x: this.gridX.center(),
            y: this.gridY.center(5),
          },
        }
      });
      // 文字点滅
      this.startText.tweener.fadeOut(1000).fadeIn(1000).setLoop(true).play();
    },
    // タッチ時
    onpointend: function() {
      // 次のシーンへ
      this.exit();
    },
  });
}