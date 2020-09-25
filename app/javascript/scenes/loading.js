export function loading(){
  phina.globalize();

  phina.define('phina.game.LoadingScene', {
    superClass: 'phina.display.DisplayScene',

    init: function(options) {
      this.superInit(options);
      var self = this;
      this.backgroundColor = "black"; // 見辛いので背景色を変えます
      var loader = phina.asset.AssetLoader();

      // 明滅するラベル
      var label = phina.display.Label({
        text: "ロード中・・・",
        fontFamily: 'HiraMinPro-W6',
        fill: "white",
        fontSize:50,
      })
      .addChildTo(this)
      .setPosition(this.width/2, this.height*0.5)
      label.tweener.clear()
      .setLoop(1)
      .to({alpha:0}, 500)
      .to({alpha:1}, 500)
      ;

      // ローダーによるロード完了ハンドラ
      loader.onload = function() {
        // Appコアにロード完了を伝える（==次のSceneへ移行）
        self.flare('loaded');
      };

      // ロード開始
      loader.load(options.assets);
    },

  });
}