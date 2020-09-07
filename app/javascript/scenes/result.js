  /*
  * リザルトシーン上書き
  */
export function result(){
  phina.globalize();
  // 定数
  var SCREEN_WIDTH = 16 * 40; 
  var SCREEN_HEIGHT = 9 * 40; 
  var KEYWORD_SIZE = SCREEN_HEIGHT / 12;
  var KEYWORD_SPEED_X = 6;
  var KEYWORD_SPEED_Y = -10;
  var GRAVITY = 0.2;
  var COLORS = ['rgb(249,38,114)', 'rgb(166,226,46)', 'rgb(253,151,31)', 'rgb(102,217,239)'];
  var BG_COLOR = 'rgb(39,40,34)';
  var KEYWORDS = null;
  var INTERVAL = 1000;
  var CONTINUE = 3;
  // アセット
  var ASSETS = {
    // キーワード一覧
    text: {
      'keywords': 'https://cdn.jsdelivr.net/gh/alkn203/phina-games@master/keyword-shot/assets/keywords',
    },
  };
  phina.define('ResultScene', {
    // 継承
    superClass: 'DisplayScene',
    // 継承
    init: function(params) {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
      });
      
      this.backgroundColor = BG_COLOR;
      var fontColor = 'rgb(255,255,255)';
      var fontSize = SCREEN_HEIGHT / 10;
      var buttonSize = SCREEN_HEIGHT / 4;
      var cornerRadius = buttonSize / 4;

      this.fromJSON({
        children: {
          levelText: {
            className: 'Label',
            arguments: {
              text: '難易度 {0}'.format(params.level),
              fill: fontColor,
              stroke: null,
              fontSize: fontSize,
            },
            x: this.gridX.center(),
            y: this.gridY.span(2),
          },
          // スコア表示
          scoreLabel: {
            className: 'Label',
            arguments: {
              text: 'shot keywords',
              fill: fontColor,
              stroke: null,
              fontSize: fontSize,
            },
            x: this.gridX.center(),
            y: this.gridY.span(4.5),
          },
          // スコア表示
          scoreText: {
            className: 'Label',
            arguments: {
              text: '{0} / {1}'.format(params.score, params.total),
              fill: fontColor,
              stroke: null,
              fontSize: fontSize,
            },
            x: this.gridX.center(),
            y: this.gridY.span(7),
          },

          shareButton: {
            className: 'Button',
            arguments: [{
              text: 'Tweet',
              width: buttonSize,
              height: buttonSize,
              fontColor: fontColor,
              fontSize: buttonSize / 4,
              cornerRadius: cornerRadius,
                fill: 'rgb(102,217,239)',
              }],
              x: this.gridX.center(-2),
              y: this.gridY.span(12),
            },

            playButton: {
              className: 'Button',
              arguments: [{
                text: '再挑戦',
                width: buttonSize,
                height: buttonSize,
                fontColor: fontColor,
                fontSize: buttonSize / 4,
                cornerRadius: cornerRadius,
                fill: 'rgb(253,151,31)',
              }],
              x: this.gridX.center(2),
              y: this.gridY.span(12),

              interactive: true,
              // 押された時
              onpush: function() {
                // メインシーンへ
                this.app.replaceScene(Main());
              }.bind(this),
            }
          }
        });
        // ツイートボタンが押された時      
        this.shareButton.onclick = function() {
          var text = '難易度 {0} shot keywords {0} / {1}'.format(params.score, params.total);
          var url = phina.social.Twitter.createURL({
            text: text,
            hashtags: 'phina_js,game,keyword_shot',
            url: 'https://alkn203.github.io/phina-games/keyword-shot/',
          });
          window.open(url, 'share window', 'width=480, height=320');
        };
      },
    });
  /*
  * キーワードクラス
  */
  phina.define("Keyword", {
    // 継承
    superClass: 'RectangleShape',
    // 初期化
    init: function(keyword) {
      // 親クラス初期化
      this.superInit({
        fill: null,
        stroke: null,
      });
      // 文字列
      this.text = keyword;
      // ラベル
      var label = Label({
        text: this.text,
        fill: COLORS.random(),
        fontSize: KEYWORD_SIZE,
      }).addChildTo(this);
      // 実際のサイズ算出
      this.width = label.calcCanvasWidth();
      this.height = label.calcCanvasHeight();
    },
    // マスクをかける
    setMask: function(length) {
      // マスク削除
      this.removeMask();
      // RectangleShapeから作成
      var mask = RectangleShape({
        fill: 'silver',
        stroke: null,
        cornerRadius: KEYWORD_SIZE / 8,
      }).addChildTo(this);
      // 透明度
      mask.alpha = 0.4;
      // 部分文字のラベル
      var label = Label({
        text: this.text.substr(0, length),
        fontSize: KEYWORD_SIZE,
        fill: null,
      }).addChildTo(this);
      // 実際のサイズ算出
      mask.width = label.calcCanvasWidth();
      mask.height = label.calcCanvasHeight();
      // 左端に合わせる
      mask.x = -this.width / 2 + mask.width / 2;
      // 参照用
      this.mask = mask;
    },
    // マスクを消す
    removeMask: function() {
      if (this.mask) this.mask.remove();
    },
  });
}