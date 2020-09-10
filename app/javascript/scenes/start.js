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
    init: function(level) {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
      });
      this.backgroundColor = 'rgba(128, 128, 128,0.5)';
      var fontColor = 'rgb(255, 255, 255)';
      this.counter = 3;
      // レベル
      var label = Label({
        text:'難易度 ' + level,
        fill: fontColor,
        fontSize: SCREEN_HEIGHT / 12,
      }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(-4));
      var label2 = Label({
        text:'クリックで開始',
        fill: fontColor,
        fontSize: SCREEN_HEIGHT / 8,
      }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());
    },
    onpointend: function() {
      //BGM再生
      SoundManager.setVolumeMusic(0.02);
      SoundManager.playMusic("bgm");
      // 次のシーンへ
      this.exit();
    },
  });
}