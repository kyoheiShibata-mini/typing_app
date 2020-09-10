import * as start from "scenes/start";
import * as setting from "scenes/setting";
/*
  * メインシーン
  */
export function main_game(){
  phina.globalize();

  //定数
  var SCREEN_WIDTH = setting.SCREEN_WIDTH; 
  var SCREEN_HEIGHT = setting.SCREEN_HEIGHT;
  var KEYWORD_SIZE = SCREEN_HEIGHT / 12;
  var BG_COLOR = setting.BG_COLOR;
  var KEYWORDS = null;
  var INTERVAL = setting.INTERVAL;

  var time_over = false;
  var type_success = false;
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

      //描画順グループ
      this.group_bg = DisplayElement().addChildTo(this);
      this.group_chara = DisplayElement().addChildTo(this);
      this.group_ef = DisplayElement().addChildTo(this);

      //背景画像
      var bg = Sprite('main_bg').addChildTo(this.group_bg);
      bg.x = this.gridX.center();
      bg.y = this.gridY.center();
      bg.width = SCREEN_WIDTH;
      bg.height = SCREEN_HEIGHT;
      
      // 背景色
      this.backgroundColor = BG_COLOR;
      // グループ
      this.keywordGroup = DisplayElement().addChildTo(this);
      this.disableGroup = DisplayElement().addChildTo(this);
      // 入力文字バッファ
      this.buffer = '';
      this.checkBuffer = '';
      // キーワードのインデックス
      this.keyIndex = 0;
      // レベル（文字数）
      this.level = 2;
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
      //タイプ制限時間
      var timeLimit = 5;

      //エフェクト
      var sprite = Sprite('hit', 64, 64).addChildTo(this.group_ef);
      this.hitEffect = FrameAnimation('hit_ss').attachTo(sprite);          
      sprite.x = this.gridX.center();
      sprite.y = this.gridY.center();

      //タイマーゲージ
      var timerGauge = Gauge({
        x: 320, y: 150,        // x,y座標
        width: 400,            // 横サイズ
        height: 30,            // 縦サイズ
        cornerRadius: 10,      // 角丸み
        maxValue: 100,         // ゲージ最大値
        value: 100,         // ゲージ初期値
        fill: 'white',         // 後ろの色
        timerGaugeColor: 'skyblue', // ゲージ色
        stroke: 'silver',      // 枠色
        strokeWidth: 5,        // 枠太さ
      }).addChildTo(this);

      timerGauge.animation =false;
      timerGauge.setPosition(this.gridX.center(), this.gridY.center(-5));;

      timerGauge.onempty = function() {
        time_over = true;
      };  
      
      timerGauge.update= function(){
        if(type_success){
          timerGauge.value = 100;
        }
        else{
          timerGauge.value -= timerGauge.maxValue/(timeLimit * 60);
        }
      };
      timerGauge.onresume = function(){
        timerGauge.value = 100;
      };
    },

    // シーンに入ったら
    onenter: function() {
      // キーワードをロード
      this.loadKeywords();
      //カウントシーンを挿入
      start.start();
      this.app.pushScene(Start(this.level));
    },

    // シーンに復帰した時
    onresume:function() {
      // キーワード作成
      this.createKeyword();
    },
    
    // 毎フレーム更新処理
    update: function() {
      // 画面下到達チェック
      this.checkTimeUp();
    },
  
    // キーワード作成
    createKeyword: function() {
      var self = this;
      // キーワード作成
      var keyword = Keyword(KEYWORDS[this.keyIndex]).addChildTo(this.keywordGroup);
      // 位置
      keyword.x = this.gridX.center();
      keyword.y = this.gridY.center(-3);
      //モンスターイラスト表示
      var enemy = this.createCharacter("tujigiri").addChildTo(this.group_chara);

      //ゲージ制御用
      type_success = false;
    },

    // 入力時間終了
    checkTimeUp: function() {
      var self = this;
      this.keywordGroup.children.each(function(keyword) {
        if(time_over){
          keyword.remove();
          time_over = false;
          // ミス処理
          self.loseLife();
        }
      });
    },
    // キー入力時処理
    onkeydown: function(e) {
      // 入力文字をバッファに追加
      //this.buffer += String.fromCharCode(e.keyCode);
      this.checkBuffer = this.buffer + String.fromCharCode(e.keyCode);
      // 比較 
      this.compare();
    },
    // 入力文字バッファと単語の比較
    compare: function() {
      var checkBuffer = this.checkBuffer.toLowerCase();
      var count = 0;
      var self = this;

      this.keywordGroup.children.each(function(keyword) {
        var str = keyword.text.toLowerCase();
        // 指定した文字で始まるか
        if (str.startsWith(checkBuffer)) {

          self.hitEffect.gotoAndPlay('hit');

          self.buffer = checkBuffer;
          //効果音
          let random = Math.random();
          if(random >= 0.6){
            SoundManager.play('type1');
          }else if(random <= 0.3){
            SoundManager.play('type2');
          }else{
            SoundManager.play('type3');
          };
          // 一致部分をマスク
          keyword.setMask(self.buffer.length);
          // 完全一致
          if (self.buffer.length === str.length) {
            SoundManager.play('todome');
            // キーワード削除処理
            self.disable(keyword);
          }
          count++;
        }
        else {
          SoundManager.play('miss1');
          // スペルミスの場合はマスク解除
          //keyword.removeMask();
        }
      });
      // 一部一致文字がなければバッファクリア
      //if (count === 0) this.buffer = '';
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
      //ゲージ制御用
      type_success = true;
      //モンスター画像削除
      
      // 削除アニメーション
      keyword.tweener.set({stroke: 'lime', cornerRadius: KEYWORD_SIZE / 8,})
                    .fadeOut(200)
                    .wait(INTERVAL)
                    .call(function() {
                        keyword.remove();
                        // コンプリート
                        if (self.keyIndex === KEYWORDS.lengh - 1) {
                          self.showResult();
                          return;
                        }
                        // 文字数が変わったらレベルアップ
                        // if (self.level < KEYWORDS[self.keyIndex].length) {
                        //   self.levelup();
                        //   return;
                        // }
                        // 次のキーワード作成
                        self.createKeyword();
                      }).play();
    },
    // レベルアップ処理
    levelup: function() {
      this.level++;
      //
      this.setLife(this.level);
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

    //キャライラスト表示
    createCharacter: function(name){
      const character = Sprite(name);
    
      character.x = this.gridX.center();
      character.y = this.gridY.center(2);
      character.scaleX = 0.5;
      character.scaleY = 0.5;

      return character;
    },
  });
}