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
  var KEYWORDS = null;
  var INTERVAL = setting.INTERVAL;

  var ZAKO_SPRITE_ARRAY = ["asigaru","tujigiri","samurai","noumin"];
  var BOSS_SPRITE_ARRAY = ["musya","mouri","ninja","busyou"];
  var BOSS_BATTLE = false;
  var BG = null;

  //敵表示用スプライト 
  var ENEMY_SPRITE_ARRAY = [];
  var ATTACKED_ENEMY = null;
  var KILL = 0;

  var time_over = false;
  var type_success = false;

  //コンティニュー時ここで初期化
  var score = 0;
  var total_type = 0;
  var speed = 1;
  var miss_key_array = [];
  var score_rate = 1;

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
      BG = Sprite('main_bg').addChildTo(this.group_bg);
      BG.x = this.gridX.center();
      BG.y = this.gridY.center();
      BG.width = SCREEN_WIDTH;
      BG.height = SCREEN_HEIGHT;
       // グループ
      this.keywordGroup = DisplayElement().addChildTo(this);
      this.disableGroup = DisplayElement().addChildTo(this);
      // 入力文字バッファ
      this.buffer = '';
      this.checkBuffer = '';
      // キーワードのインデックス
      this.keyIndex = 0;
      //リザルト変数の初期化
      score = 0;
      total_type = 0;
      speed = 0;
      miss_key_array = [];

      this.score_label = Label({
        text: 'SCORE: {0}'.format(score),
        fontFamily: 'HiraMinPro-W6',
        fill: 'white',
        stroke: 'black',
        strokeWidth: 7,
        fontSize: KEYWORD_SIZE * 2 / 3, 
      }).addChildTo(this).setPosition(this.gridX.span(14), this.gridY.span(1));

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
          //timerGauge.value -= timerGauge.maxValue/(timeLimit * 60);
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
      if(KILL >= 6 && !BOSS_BATTLE){
        BOSS_BATTLE = true;
        SoundManager.playMusic("boss_bgm");
        SoundManager.setVolumeMusic(0.5);
        BG = Sprite('boss_bg').addChildTo(this.group_bg);
        BG.x = this.gridX.center();
        BG.y = this.gridY.center();
        BG.width = SCREEN_WIDTH;
        BG.height = SCREEN_HEIGHT;
      };
    },
  
    // キーワード作成
    createKeyword: function() {
      var self = this;
      // キーワード作成
      var keyword = Keyword(KEYWORDS[this.keyIndex]).addChildTo(this.keywordGroup);
      // 位置
      keyword.x = this.gridX.center();
      keyword.y = this.gridY.center(-3);

      //敵イラスト表示
      if(KILL == 0 || KILL % 3 == 0){
        ENEMY_SPRITE_ARRAY.push(Character(this.getRandomEnemy(),this.gridX.center(4),this.gridY.center(3)).addChildTo(this.group_chara));
        ENEMY_SPRITE_ARRAY.push(Character(this.getRandomEnemy(),this.gridX.center(-4),this.gridY.center(3)).addChildTo(this.group_chara));
        ENEMY_SPRITE_ARRAY.push(Character(this.getRandomEnemy(),this.gridX.center(),this.gridY.center(3)).addChildTo(this.group_chara));

        ATTACKED_ENEMY = ENEMY_SPRITE_ARRAY[Math.floor(Math.random() * ENEMY_SPRITE_ARRAY.length)];
      }
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
          self.showResult();
        }
      });
    },
    // キー入力時処理
    onkeydown: function(e) {
      total_type++;
      // 入力文字をバッファに追加
      this.checkBuffer = this.buffer + String.fromCharCode(e.keyCode);
      // 比較 
      this.compare();
    },
    // 入力文字バッファと単語の比較
    compare: function() {
      //攻撃する敵を決定
      
      var checkBuffer = this.checkBuffer.toLowerCase();
      var count = 0;
      var self = this;

      this.keywordGroup.children.each(function(keyword) {
        var str = keyword.text.toLowerCase();
        // タイプ成功
        if (str.startsWith(checkBuffer)) {
          
          ATTACKED_ENEMY.damaged();

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
            KILL++;
            ATTACKED_ENEMY.death();
            var i = ENEMY_SPRITE_ARRAY.indexOf(ATTACKED_ENEMY);
            console.log("iは"+ i +"です");
            ENEMY_SPRITE_ARRAY.splice(i,1);
            console.log(ENEMY_SPRITE_ARRAY);
            console.log("敵の数は"+ ENEMY_SPRITE_ARRAY.length + "です");

            ATTACKED_ENEMY = ENEMY_SPRITE_ARRAY[Math.floor(Math.random() * ENEMY_SPRITE_ARRAY.length)];

            SoundManager.play('todome');
            score += 100 * score_rate;
            self.score_label.text = 'SCORE: {0}'.format(score);
            score_rate = 1;
            // キーワード削除処理
            self.disable(keyword);
          }
          count++;
        }
        //タイプミスの処理
        else {
          if(score_rate > 0){
            score_rate -= 0.1;
          }
          SoundManager.play('miss1');
          //ミスしたキーと回数を記録
          const miss_key = str.charAt(checkBuffer.length-1);
          const miss_key_obj = miss_key_array.find(({name})=> name === miss_key);
          if(miss_key_obj == null){
            const miss_key_obj = {name: miss_key, value: 1}; 
            miss_key_array.push(miss_key_obj);
          }else{
            miss_key_obj.value++;
          }
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
                        //全単語終わったらゲーム終了
                        if (self.keyIndex > KEYWORDS.length -1) {
                          self.showResult();
                          return;
                        }
                        //次のキーワード作成
                        self.createKeyword();
                      }).play();
    },
    // 結果表示
    showResult: function() {
      SoundManager.setVolumeMusic(0.05);
      // リザルトシーンへ
      this.app.replaceScene(Result({
        score: score,
        total_type: total_type,
        speed: 100,
        miss_key_array,
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

    getRandomEnemy: function(){
      if(BOSS_BATTLE){
        return BOSS_SPRITE_ARRAY[Math.floor(Math.random()*BOSS_SPRITE_ARRAY.length)];
      }else{
        return ZAKO_SPRITE_ARRAY[Math.floor(Math.random()*ZAKO_SPRITE_ARRAY.length)];
      }
    },
  });
}