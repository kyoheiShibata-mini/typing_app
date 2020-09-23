import * as setting from "scenes/setting";

export function characters(){
  phina.globalize();

  phina.define("Character", {
    // 継承
    superClass: 'Sprite',
    // 初期化
    init: function(image, posX, posY) {
      // 親クラス初期化
      this.superInit(image);
      this.x = posX;
      this.y = posY;
      this.scaleX = setting.CHARACTER_SCALE;
      this.scaleY = setting.CHARACTER_SCALE;
      this.alpha = 0;

      this.idle();
    },
    idle: function(){
      this.tweener.by({scaleX: - 0.01,scaleY: -0.04,alpha: 1}, 500, 'easeInOutQuad')
      .by({scaleX: 0.01,scaleY: 0.04,}, 500, 'easeInOutQuad')
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