export function count_down(){
    // グローバルに展開
  //phina.globalize();
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
  /*
  * 自作カウントシーン
  */
  phina.define('Count', {
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
        fontSize: SCREEN_HEIGHT / 8,
      }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(-4));
      // カウント数字
      this.countLabel = Label({
        text:'',
        fill: fontColor,
        fontSize: SCREEN_HEIGHT / 4,
      }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());
      this.countDown(this.counter);
    },

    
    // カウントダウン処理
    countDown: function(counter) {

      var self = this;
      var label = this.countLabel;
      
      label.text = this.counter;
      label.setScale(1.0);
      label.alpha = 0;
      
      this.countLabel.tweener.to({ scaleX: 0.5, scaleY: 0.5, alpha: 1.0 }, 1000)
                            .call(function() {
                              // カウント終了でシーンを抜ける
                              if (self.counter === 1) self.exit();
                              // 再帰呼び出し
                              self.counter--;
                              self.countDown(self.counter);
                            });
    }

  
  });
}