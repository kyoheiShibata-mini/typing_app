import * as setting from "scenes/setting";

export function characters(){
  phina.globalize();

  var SCREEN_HEIGHT = setting.SCREEN_HEIGHT;
  var KEYWORD_SIZE = SCREEN_HEIGHT / 12;

  phina.define("Character", {
    // 継承
    superClass: 'Sprite',
    // 初期化
    init: function(image, posX, posY) {
      // 親クラス初期化
      this.superInit(image);
      this.x = posX;
      this.y = posY;
      this.scaleX = 0.3;
      this.scaleY = 0.3;
      this.alpha = 0;

      this.idle();
    },
    idle: function(){
      this.tweener.to({scaleX: 0.49,scaleY: 0.46,alpha: 1}, 500, 'easeInOutQuad')
      .to({scaleX: 0.5,scaleY: 0.5,}, 500, 'easeInOutQuad')
      .setLoop(true).play();
    },
    damaged: function(){
      this.alpha = 1;
      var damage_tween = Tweener().by({x: 10}, 100, 'easeOutBounce')
      .by({x: -10}, 100, 'easeOutBounce');
      damage_tween.attachTo(this);
    },

    death: function(){
      var death_tween = Tweener().by({alpha: -1}, 250).wait(250).call(this.remove());
      death_tween.attachTo(this);
    },
  });
}