import * as setting from "scenes/setting";
import * as play_record_channel from "channels/play_record_channel";

  /*
  * リザルトシーン上書き
  */
export function result(){
  phina.globalize();

  // 定数
  var SCREEN_WIDTH = setting.SCREEN_WIDTH; 
  var SCREEN_HEIGHT = setting.SCREEN_HEIGHT;
  var KEYWORD_SIZE = SCREEN_HEIGHT / 12;
  var RESULT_SIZE = KEYWORD_SIZE ;
  
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
          miss_key_for_label += element.name + " : " + element.value + "回";
          //if((index + 1) % 2 == 0){
            miss_key_for_label += "\n";
          //};
        };
      });


      var mode_str = "";
      if (params.jikan < 90){
        mode_str = "松";
      }else if (params.jikan < 120){
        mode_str = "竹";
      }else{
        mode_str = "梅";
      };

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
        mode: mode_str,
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
      
      var result_center = 0;

      //ユーザーのアイコン表示
      var user_image = null;
      if(play_record_channel.user_image != "logo_side"){
        user_image = Sprite(play_record_channel.user_image).addChildTo(this);
        user_image.scaleX = 1;
        user_image.scaleY = 1;
      }else{
        user_image = Sprite("logo").addChildTo(this);
        user_image.scaleX = 0.3;
        user_image.scaleY = 0.3;
      };
      user_image.x = this.gridX.center(-5);
      user_image.y = this.gridY.center(-1.5);

      if(miss_key_total > 0){
        this.miss_total_label = Label({
          text: 'タイプミス: \n{0}'.format(miss_key_for_label),
          fontFamily: 'HiraMinPro-W6',
          fontSize: RESULT_SIZE, 
          fill: 'white',
          stroke: 'black',
          strokeWidth: 12,
        }).addChildTo(this).setPosition(this.gridX.center(5), this.gridY.center(-1));
      };

      this.mode_label = Label({
        text: '{0} ({1}秒)'.format(mode_str,params.jikan),
        fontFamily: 'HiraMinPro-W6',
        fontSize: RESULT_SIZE, 
        fill: 'white',
        stroke: 'black',
        strokeWidth: 12,
      }).addChildTo(this).setPosition(this.gridX.center(result_center), this.gridY.center(-6));

      this.score_label = Label({
        text: '得点: {0}'.format(params.score),
        fontFamily: 'HiraMinPro-W6',
        fontSize: RESULT_SIZE, 
        fill: 'white',
        stroke: 'black',
        strokeWidth: 12,
      }).addChildTo(this).setPosition(this.gridX.center(result_center), this.gridY.center(-3));

      this.total_type_label = Label({
        text: 'タイプ数: {0}'.format(params.total_type),
        fontFamily: 'HiraMinPro-W6',
        fontSize: RESULT_SIZE, 
        fill: 'white',
        stroke: 'black',
        strokeWidth: 12,
      }).addChildTo(this).setPosition(this.gridX.center(result_center), this.gridY.center());

      this.speed_label = Label({
        text: '速度: {0}'.format(params.speed),
        fontFamily: 'HiraMinPro-W6',
        fontSize: RESULT_SIZE, 
        fill: 'white',
        stroke: 'black',
        strokeWidth: 12,
      }).addChildTo(this).setPosition(this.gridX.center(result_center), this.gridY.center(3));

      var titleButton = Button({
        fontFamily: 'HiraMinPro-W6',
        x: this.gridX.center(),
        y: this.gridY.span(14.5),
        width: 150,         // 横サイズ
        height: 100,        // 縦サイズ
        text: "タイトル",     // 表示文字
        fontSize: 32,       // 文字サイズ
        fontColor: 'white', // 文字色
        cornerRadius: 10,   // 角丸み
        fill: '#ee7800',    // ボタン色
        stroke: 'darkred',     // 枠色
        strokeWidth: 5,     // 枠太さ
                            // 他にも指定できる…？
      }).addChildTo(this);

      var playButton = Button({
        fontFamily: 'HiraMinPro-W6',
        x: this.gridX.center(-3),
        y: titleButton.y,
        width: 150,         // 横サイズ
        height: 100,        // 縦サイズ
        text: "再挑戦",     // 表示文字
        fontSize: 32,       // 文字サイズ
        fontColor: 'white', // 文字色
        cornerRadius: 10,   // 角丸み
        fill: '#ee7800',    // ボタン色
        stroke: 'darkred',     // 枠色
        strokeWidth: 5,     // 枠太さ
                            // 他にも指定できる…？
      }).addChildTo(this);
      
      var twitter = Sprite('twitter').addChildTo(this);
      twitter.x = this.gridX.center(3);
      twitter.y = titleButton.y;
      twitter.scaleX = 0.2;
      twitter.scaleY = 0.2;
      twitter.setInteractive(true);
      
      titleButton.onpointend = function(){
        SoundManager.stopMusic();
        self.app.replaceScene(Title());
      };


      playButton.onpointend = function(){
        SoundManager.stopMusic();
        self.app.replaceScene(Main(params.jikan));
      };

      twitter.onpointend = function(){
        var text = '🍣たいぴんぐ天晴れなり！👘\nモード:{0}\n得点:{1}\n速度:{2}打/秒\n'.format(mode_str,params.score, params.speed);
        var url = phina.social.Twitter.createURL({
          text: text,
          hashtags: '大江戸タイピング\n',
          url: 'https://ooedo-typing.herokuapp.com/\n',
        });
        window.open(url, 'share window', 'width=480, height=320');
      };
    },
    onenter: function() {
      SoundManager.playMusic("result_bgm");
    },
  });
}