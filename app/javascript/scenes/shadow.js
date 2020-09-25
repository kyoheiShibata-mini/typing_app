import * as setting from "scenes/setting";

export function shadow(){
  phina.globalize();

  phina.define("Shadow", {
    // 継承
    superClass: 'Sprite',
    // 初期化
    init: function(posX, posY) {
      // 親クラス初期化
      this.superInit("shadow");
      this.x = posX;
      this.y = posY;
      this.scaleY = 0.4;
      this.scaleX = 1.5;
      this.alpha = 0;

      this.idle();
    },
    idle: function(){
      this.tweener.by({alpha: 0.65}, 500, 'easeInOutQuad');
    },
    
    death: function(){
      var death_tween = Tweener().by({alpha: -1}, 250).wait(250).call(this.remove());
      death_tween.attachTo(this);
    },
  });
}