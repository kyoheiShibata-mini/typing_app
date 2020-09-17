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
  var RESULT_SIZE = KEYWORD_SIZE * 1.2
  
  phina.define('Result', {
    // 継承
    superClass: 'DisplayScene',
    // 継承
    init: function(params) {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
      });

      //タイプミスの合計回数を算出
      var miss_key_total = params.miss_key_array.reduce((prev,current)=>{return prev + current.value},0);
      var miss_key_for_label = ""
      params.miss_key_array.forEach(element => {
        miss_key_for_label += element.name + " " + element.value + "回、\n";
      });
      console.log(this.miss_key_for_label);

      //サーバーにリザルトを保存
      const XHR = new XMLHttpRequest();
      XHR.open("post", "/typings", true);
      XHR.setRequestHeader("Content-Type", "application/json");
      //jsonを初期化。前のプレイデータを持ち越してしまう
      var json ={}
      json = {
        score: params.score,
        total_type: params.total_type,
        speed: params.speed,
      };

      params.miss_key_array.forEach(element => {
        json[element.name] = element.value;
      });

      json = JSON.stringify(json);
      console.log(json);
      XHR.send(json);

      //背景画像
      var bg = Sprite('result_bg').addChildTo(this);
      bg.x = this.gridX.center();
      bg.y = this.gridY.center();
      bg.width = SCREEN_WIDTH;
      bg.height = SCREEN_HEIGHT;

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
        fill: 'red',    // ボタン色
        stroke: 'darkred',     // 枠色
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
        fill: 'red',    // ボタン色
        stroke: 'darkred',     // 枠色
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

      var result_center = 0;

      if(miss_key_total > 0){

        result_center= -3;

        this.miss_total_label = Label({
          text: 'ミス回数: \n{0}'.format(miss_key_for_label),
          fontFamily: 'YuMincho',
          fontSize: RESULT_SIZE, 
          fill: 'white',
          stroke: 'black',
          strokeWidth: 7,
        }).addChildTo(this).setPosition(this.gridX.center(3), this.gridY.center());
  
      };

      this.score_label = Label({
        text: '得点: {0}'.format(params.score),
        fontFamily: 'YuMincho',
        fontSize: RESULT_SIZE, 
        fill: 'white',
        stroke: 'black',
        strokeWidth: 7,
      }).addChildTo(this).setPosition(this.gridX.center(result_center), this.gridY.center(-5));

      this.total_type_label = Label({
        text: 'タイプ数: {0}'.format(params.total_type),
        fontFamily: 'YuMincho',
        fontSize: RESULT_SIZE, 
        fill: 'white',
        stroke: 'black',
        strokeWidth: 7,
      }).addChildTo(this).setPosition(this.gridX.center(result_center), this.gridY.center(-2.5));

      this.speed_label = Label({
        text: '速度: {0}'.format(params.speed),
        fontFamily: 'YuMincho',
        fontSize: RESULT_SIZE, 
        fill: 'white',
        stroke: 'black',
        strokeWidth: 7,
      }).addChildTo(this).setPosition(this.gridX.center(result_center), this.gridY.center());
      

      
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