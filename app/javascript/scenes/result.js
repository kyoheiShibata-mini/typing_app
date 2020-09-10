import * as setting from "scenes/setting";
  /*
  * リザルトシーン上書き
  */
export function result(){
  phina.globalize();

  // 定数
  var SCREEN_WIDTH = setting.SCREEN_WIDTH; 
  var SCREEN_HEIGHT = setting.SCREEN_HEIGHT;
  var KEYWORD_SIZE = SCREEN_HEIGHT / 12;
  var COLORS = setting.COLORS;

  phina.define('Result', {
    // 継承
    superClass: 'DisplayScene',
    // 継承
    init: function(params) {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
      });
      

      //背景画像
      var bg = Sprite('result_bg').addChildTo(this);
      bg.x = this.gridX.center();
      bg.y = this.gridY.center();
      bg.width = SCREEN_WIDTH;
      bg.height = SCREEN_HEIGHT;
      
      var fontColor = 'rgb(255,255,255)';
      var fontSize = SCREEN_HEIGHT / 10;
      var buttonSize = SCREEN_HEIGHT / 4;
      var cornerRadius = buttonSize / 4;

      var self = this;

      var titleButton = Button({
        fontFamily: 'YuMincho',
        x: this.gridX.center(-2),
        y: this.gridY.span(12),
        width: 150,         // 横サイズ
        height: 100,        // 縦サイズ
        text: "タイトル",     // 表示文字
        fontSize: 32,       // 文字サイズ
        fontColor: 'white', // 文字色
        cornerRadius: 10,   // 角丸み
        fill: 'blue',    // ボタン色
        stroke: 'blue',     // 枠色
        strokeWidth: 5,     // 枠太さ
                            // 他にも指定できる…？
      }).addChildTo(this);

      var playButton = Button({
        fontFamily: 'YuMincho',
        x: this.gridX.center(2),
        y: this.gridY.span(12),
        width: 150,         // 横サイズ
        height: 100,        // 縦サイズ
        text: "再挑戦",     // 表示文字
        fontSize: 32,       // 文字サイズ
        fontColor: 'white', // 文字色
        cornerRadius: 10,   // 角丸み
        fill: 'blue',    // ボタン色
        stroke: 'blue',     // 枠色
        strokeWidth: 5,     // 枠太さ
                            // 他にも指定できる…？
      }).addChildTo(this);
      
      titleButton.onpointend = function(){
        SoundManager.stopMusic();
        self.exit("Title");
      };

      playButton.onpointend = function(){
        SoundManager.stopMusic();
        self.exit("Main");
      };
      /*
      this.fromJSON({
        children: {
          // スコア表示
          scoreText: {
            className: 'Label',
            arguments: {
              fontFamily: 'YuMincho',
              text: '{0} / {1}'.format(params.score, params.total),
              fill: fontColor,
              stroke: null,
              fontSize: fontSize,
            },
            x: this.gridX.center(),
            y: this.gridY.span(7),
          },

          // shareButton: {
          //   className: 'Button',
          //   arguments: [{
          //     fontFamily: 'YuMincho',
          //     text: 'Tweet',
          //     width: buttonSize,
          //     height: buttonSize,
          //     fontColor: fontColor,
          //     fontSize: buttonSize / 4,
          //     cornerRadius: cornerRadius,
          //       fill: 'rgb(102,217,239)',
          //     }],
          //     x: this.gridX.center(-2),
          //     y: this.gridY.span(12),
          //   },

          titleButton: {
            className: 'Button',
            arguments: [{
              fontFamily: 'YuMincho',
              text: 'タイトル',
              width: buttonSize,
              height: buttonSize,
              fontColor: fontColor,
              fontSize: buttonSize / 4,
              cornerRadius: cornerRadius,
              fill: 'rgb(253,151,31)',
            }],
            x: this.gridX.center(-2),
            y: this.gridY.span(12),

            interactive: true,
            // 押された時
            onpush: function() {
              SoundManager.stopMusic();
              // メインシーンへ
              this.app.replaceScene(Title());
            }.bind(this),
          },

          playButton: {
            className: 'Button',
            arguments: [{
              fontFamily: 'YuMincho',
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
              SoundManager.stopMusic();
              // メインシーンへ
              this.app.replaceScene(Main());
            }.bind(this),
          }
        } 
      });
        */   
      // ツイートボタンが押された時      
      // this.shareButton.onclick = function() {
      //   var text = '難易度 {0} shot keywords {0} / {1}'.format(params.score, params.total);
      //   var url = phina.social.Twitter.createURL({
      //     text: text,
      //     hashtags: 'phina_js,game,keyword_shot',
      //     url: 'https://alkn203.github.io/phina-games/keyword-shot/',
      //   });
      //   window.open(url, 'share window', 'width=480, height=320');
      // };
    },
    
    onenter: function() {
      SoundManager.playMusic("result_bgm");
    },
  });
}