import * as setting from "scenes/setting";

export function finish(){
  // グローバルに展開
  phina.globalize();
  // 定数
  var SCREEN_WIDTH = setting.SCREEN_WIDTH; 
  var SCREEN_HEIGHT = setting.SCREEN_HEIGHT;

  phina.define('Finish', {
    // 継承
    superClass: 'DisplayScene',

    // 継承
    init: function(params) {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
      });

      this.backgroundColor = 'rgba(128, 128, 128,0.5)';
      var fontColor = 'rgb(255, 255, 255)';
      this.counter = 3;
      
      var label2 = Label({
        fontFamily: 'HiraMinPro-W6',
        text:'そこまで！',
        fill: fontColor,
        fontSize: SCREEN_HEIGHT / 8,
      }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());
      SoundManager.play("start");
      var self = this;
      this.tweener.wait(1000).call(function(){self.showResult(params)});
    },

    showResult: function(params){
      this.app.replaceScene(Result(params));
    },
  });
}