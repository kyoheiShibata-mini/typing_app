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
  var RESULT_SIZE = KEYWORD_SIZE;
  
  phina.define('Result', {
    // 継承
    superClass: 'DisplayScene',
    // 継承
    init: function(params) {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
      });
      SoundManager.setVolumeMusic(0.05);
      //タイプミスの合計回数を算出
      var miss_key_total = params.miss_key_array.reduce((prev,current)=>{return prev + current.value},0);

      //タイプミス表示用のテキストを作成
      var miss_key_for_label = "";
      var miss_key_array = params.miss_key_array.sort(function(a, b) { return b.value - a.value; });

      miss_key_array.forEach(function(element,index){
        if(index <=5){
          miss_key_for_label += element.name + " :" + element.value + "回、";
          if((index + 1) % 3 == 0){
            miss_key_for_label += "\n";
          };
        };
      });

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
        miss_key_total: miss_key_total,
      };

      params.miss_key_array.forEach(element => {
        json[element.name] = element.value;
      });

      json = JSON.stringify(json);
      XHR.send(json);

      //背景画像
      var bg = Sprite('result_bg').addChildTo(this);
      bg.x = this.gridX.center();
      bg.y = this.gridY.center();
      bg.width = SCREEN_WIDTH;
      bg.height = SCREEN_HEIGHT;

      var self = this;
      
      var titleButton = Button({
        fontFamily: 'HiraMinPro-W6',
        x: this.gridX.center(),
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
        fontFamily: 'HiraMinPro-W6',
        x: this.gridX.center(-3),
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
      
      var twitter = Sprite('twitter').addChildTo(this);
      twitter.x = this.gridX.center(3);
      twitter.y = this.gridY.span(12);
      twitter.scaleX = 0.2;
      twitter.scaleY = 0.2;
      twitter.setInteractive(true);
      

      // var shareButton = Button({
      //   fontFamily: 'HiraMinPro-W6',
      //   x: this.gridX.center(0),
      //   y: this.gridY.span(12),
      //   width: 150,         // 横サイズ
      //   height: 100,        // 縦サイズ
      //   text: "twitter",     // 表示文字
      //   fontSize: 32,       // 文字サイズ
      //   fontColor: 'white', // 文字色
      //   cornerRadius: 10,   // 角丸み
      //   fill: 'blue',    // ボタン色
      //   stroke: 'darkblue',     // 枠色
      //   strokeWidth: 5,     // 枠太さ
      //                       // 他にも指定できる…？
      // }).addChildTo(this);

      titleButton.onpointend = function(){
        SoundManager.stopMusic();
        //self.exit("Title");
        self.app.replaceScene(Title());
      };

      playButton.onpointend = function(){
        SoundManager.stopMusic();
        //self.exit("Main");
        self.app.replaceScene(Main());
      };

      twitter.onpointend = function(){
        var text = '🍣たいぴんぐ天晴れなり！👘\n得点:{0}\n速度:{1}打/秒\n'.format(params.score, params.speed);
        var url = phina.social.Twitter.createURL({
          text: text,
          hashtags: '大江戸タイピング\n',
          url: 'https://ooedo-typing.herokuapp.com/\n',
        });
        window.open(url, 'share window', 'width=480, height=320');
      };

      var result_center = 0;

      if(miss_key_total > 0){
        result_center= -3;
        this.miss_total_label = Label({
          text: 'ミスが多かったキー: \n{0}'.format(miss_key_for_label),
          fontFamily: 'HiraMinPro-W6',
          fontSize: RESULT_SIZE *0.8, 
          fill: 'white',
          stroke: 'black',
          strokeWidth: 7,
        }).addChildTo(this).setPosition(this.gridX.center(4), this.gridY.center(-2));
      };

      this.score_label = Label({
        text: '得点: {0}'.format(params.score),
        fontFamily: 'HiraMinPro-W6',
        fontSize: RESULT_SIZE, 
        fill: 'white',
        stroke: 'black',
        strokeWidth: 7,
      }).addChildTo(this).setPosition(this.gridX.center(result_center), this.gridY.center(-5));

      this.total_type_label = Label({
        text: 'タイプ数: {0}'.format(params.total_type),
        fontFamily: 'HiraMinPro-W6',
        fontSize: RESULT_SIZE, 
        fill: 'white',
        stroke: 'black',
        strokeWidth: 7,
      }).addChildTo(this).setPosition(this.gridX.center(result_center), this.gridY.center(-2.5));

      this.speed_label = Label({
        text: '速度: {0}'.format(params.speed),
        fontFamily: 'HiraMinPro-W6',
        fontSize: RESULT_SIZE, 
        fill: 'white',
        stroke: 'black',
        strokeWidth: 7,
      }).addChildTo(this).setPosition(this.gridX.center(result_center), this.gridY.center());
    },
    onenter: function() {
      SoundManager.playMusic("result_bgm");
    },
  });
}