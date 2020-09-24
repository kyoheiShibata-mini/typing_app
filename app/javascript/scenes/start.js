import * as setting from "scenes/setting";

export function start(){
  // グローバルに展開
  phina.globalize();
  // 定数
  var SCREEN_WIDTH = setting.SCREEN_WIDTH; 
  var SCREEN_HEIGHT = setting.SCREEN_HEIGHT;

  phina.define('Start', {
    // 継承
    superClass: 'DisplayScene',

    // 継承
    init: function(time) {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
      });
      this.backgroundColor = 'rgba(128, 128, 128,0.5)';
      var fontColor = 'rgb(255, 255, 255)';
      this.counter = 3;
      
      var label1 = Label({
        fontFamily: 'HiraMinPro-W6',
        text:'制限時間{0}秒'.format(time),
        fill: fontColor,
        fontSize: SCREEN_HEIGHT / 16,
      }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(-3));

      var label2 = Label({
        fontFamily: 'HiraMinPro-W6',
        text:'クリックで開始',
        fill: fontColor,
        fontSize: SCREEN_HEIGHT / 8,
      }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());
    },
    onpointend: function() {
      
      //BGM再生
      SoundManager.setVolumeMusic(0.05);
      SoundManager.playMusic("bgm");
      // 次のシーンへ
      this.exit();
    },
  });
}