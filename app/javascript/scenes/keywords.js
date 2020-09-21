import * as setting from "scenes/setting";
/*
  * キーワードクラス
  */
export function keywords(){
  phina.globalize();

  var SCREEN_HEIGHT = setting.SCREEN_HEIGHT;
  var KEYWORD_SIZE = SCREEN_HEIGHT / 12;
  var text_array = [];

  phina.define("Keyword", {
    // 継承
    superClass: 'RectangleShape',
    // 初期化
    init: function(keyword, display_text) {
      // 親クラス初期化
      this.superInit({
        fill: null,
        stroke: null,
      });
      // 文字列
      this.text = keyword;
      // ラベル
      /*
      var label = Label({
        fontFamily: 'HiraMinPro-W6',
        text: this.text,
        fontSize: KEYWORD_SIZE,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 7,
      }).addChildTo(this);


      

      // 実際のサイズ算出
      this.width = label.calcCanvasWidth();
      this.height = label.calcCanvasHeight();
      */

      //日本語テキスト
      var japan_label = Label({
        fontFamily: 'HiraMinPro-W6',
        text: display_text,
        fontSize: KEYWORD_SIZE * 0.6,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 5,
        y :-40
      }).addChildTo(this);

      text_array = [];
      var str_interval = 36;
      var pos_moji = -str_interval * (this.text.length - 1) / 2;
      for (var i = 0;i < this.text.length;i++){
        var moji = Label({
          fontFamily: 'HiraMinPro-W6',
          text: this.text[i],
          fontSize: KEYWORD_SIZE,
          fill: 'white',
          stroke: 'black',
          strokeWidth: 7,
          x: pos_moji,
        }).addChildTo(this);
        pos_moji += str_interval;
        text_array.push(moji);
      };
    },

    //文字色を変える
    changeColor: function(num){
      text_array[num-1].fill = "gray";
    },
    // マスクをかける
    setMask: function(length) {
      // マスク削除
      this.removeMask();
      //RectangleShapeから作成
      var mask = RectangleShape({
        fill: 'silver',
        stroke: null,
        cornerRadius: KEYWORD_SIZE / 8,
      }).addChildTo(this);
      // 透明度
      mask.alpha = 0.4;
      // 部分文字のラベル
      var label = Label({
        fontFamily: 'HiraMinPro-W6',
        text: this.text.substr(0, length),
        fontSize: KEYWORD_SIZE,
        fill: null,
      }).addChildTo(this);
      // 実際のサイズ算出
      mask.width = label.calcCanvasWidth();
      mask.height = label.calcCanvasHeight();
      // 左端に合わせる
      mask.x = -this.width / 2 + mask.width / 2;
      // 参照用
      this.mask = mask;
    },
    // マスクを消す
    removeMask: function() {
      if (this.mask) this.mask.remove();
    },
  });
}