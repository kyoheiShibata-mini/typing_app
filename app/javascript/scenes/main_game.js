import * as count_down from "scenes/count_down";
/*
  * メインシーン
  */
export function main_game(){
    phina.globalize();
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

  phina.define('Main', {
    // 継承
    superClass: 'DisplayScene',
    // 初期化
    init: function(param) {
      // 親クラス初期化
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
      });
      // 背景色
      this.backgroundColor = BG_COLOR;
      // グループ
      this.keywordGroup = DisplayElement().addChildTo(this);
      this.disableGroup = DisplayElement().addChildTo(this);
      // 入力文字バッファ
      this.buffer = '';
      // キーワードのインデックス
      this.keyIndex = 0;
      // レベル（文字数）
      this.level = 1;
      // スコア 
      this.score = 0;
      // ライフ
      this.life = 1;
      // ライフ表示
      this.lifeLabel = Label({
        text: 'LIFE: {0}'.format(this.life),
        fill: 'white',
        fontSize: KEYWORD_SIZE * 2 / 3, 
      }).addChildTo(this).setPosition(this.gridX.span(14), this.gridY.span(1));
      // ライフ非表示
      this.lifeLabel.hide();

      var tomapiko = Sprite('tomapiko').addChildTo(this);
      
      tomapiko.x = this.gridX.center();
      tomapiko.y = this.gridY.center();
      tomapiko.width = 128;
      tomapiko.height = 128;
    },
    
    // シーンに入ったら
    onenter: function() {
      
      // キーワードをロード
      this.loadKeywords();
      //カウントシーンを挿入
      this.app.pushScene(Count(this.level));
    },

    // シーンに復帰した時
    onresume:function() {
      // ライフ表示
      this.lifeLabel.show();
      // キーワード作成
      this.createKeyword();
    },
    // 毎フレーム更新処理
    update: function() {
      // 画面下到達チェック
      this.checkKeywordToBottom();
    },
  
    // キーワード作成
    createKeyword: function() {
      // キーワード作成
      var keyword = Keyword(KEYWORDS[this.keyIndex]).addChildTo(this.keywordGroup);
      // 位置
      keyword.x = this.gridX.center();
      keyword.y = this.gridY.center();
    },
    // 画面下到達判定
    checkKeywordToBottom: function() {
      var self = this;
      
      this.keywordGroup.children.each(function(keyword) {
        // 画面下に着いたら
        if (keyword.bottom > self.gridY.width) {
          keyword.remove();
          // ミス処理
          self.loseLife();
        }
      });
    },
    // ミス処理
    loseLife: function() {
      this.life--;
      this.lifeLabel.text = 'LIFE: {0}'.format(this.life);
      // ライフ0
      if (this.life === 0) {
        this.showResult();  
      }
      else {
        this.lifeLabel.hide();
        this.app.pushScene(Count(this.level));
      }
    },
    // キー入力時処理
    onkeydown: function(e) {
      SoundManager.play('se1');
      // 入力文字をバッファに追加
      this.buffer += String.fromCharCode(e.keyCode);
      // 比較 
      this.compare();
    },
    // 入力文字バッファと単語の比較
    compare: function() {
      var buffer = this.buffer.toLowerCase();
      var count = 0;
      var self = this;

      this.keywordGroup.children.each(function(keyword) {
        var str = keyword.text.toLowerCase();
        // 指定した文字で始まるか
        if (str.startsWith(buffer)) {
          // 一致部分をマスク
          keyword.setMask(buffer.length);
          // 完全一致
          if (buffer.length === str.length) {
            // キーワード削除処理
            self.disable(keyword);
          }
          count++;
        }
        else {
          // スペルミスの場合はマスク解除
          keyword.removeMask();
        }
      });
      // 一部一致文字がなければバッファクリア
      if (count === 0) this.buffer = '';
    },
    // キーワード削除処理
    disable: function(keyword) {
      var self = this;
      // 削除グループへ移動
      keyword.addChildTo(this.disableGroup);
      // バッファクリア
      this.buffer = '';
      // スコア更新
      this.score++;
      // インデックス更新
      this.keyIndex++;
      // 削除アニメーション
      keyword.tweener.set({stroke: 'lime', cornerRadius: KEYWORD_SIZE / 8,})
                    .fadeOut(500)
                    .wait(INTERVAL)
                    .call(function() {
                        keyword.remove();
                        // コンプリート
                        if (self.keyIndex === KEYWORDS.lengh - 1) {
                          self.showResult();
                          return;
                        }
                        // 文字数が変わったらレベルアップ
                        if (self.level < KEYWORDS[self.keyIndex].length) {
                          self.levelup();
                          return;
                        }
                        // 次のキーワード作成
                        self.createKeyword();
                      }).play();
    },
    // レベルアップ処理
    levelup: function() {
      this.level++;
      //
      this.setLife(this.level);
      // ライフ非表示
      this.lifeLabel.hide();

      this.app.pushScene(Count(this.level));
    },
    // ライフ値セット
    setLife: function(level) {
      var count = 0;

      KEYWORDS.each(function(keyword) {
        // levelと同じ長さのキーワードをカウント
        if (keyword.length === level) count++;
      });
      // ライフ値セット
      this.life = (count / 2) | 0;
      this.lifeLabel.text = '体力: {0}'.format(this.life);
    },
    // 結果表示
    showResult: function() {
      // リザルトシーンへ
      this.app.replaceScene(ResultScene({
        level: this.level,
        score: this.score,
        total: KEYWORDS.length,
      }));      
    },
    // キーワードをロード
    loadKeywords: function() {
      var keywords = AssetManager.get('text', 'keywords');
      // 改行で分けて配列として格納
      KEYWORDS = keywords.data.split(/\r\n|\n/);
      // 文字数の小さい順に並べる
      KEYWORDS.sort(function(a, b) { return a.length - b.length; });
    },
  });
}