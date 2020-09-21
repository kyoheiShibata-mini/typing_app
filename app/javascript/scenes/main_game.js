import * as start from "scenes/start";
import * as finish from "scenes/finish";
import * as setting from "scenes/setting";
import * as play_record_channel from "channels/play_record_channel";

/*
  * メインシーン
  */
export function main_game(){
  phina.globalize();

  //定数
  var SCREEN_WIDTH = setting.SCREEN_WIDTH; 
  var SCREEN_HEIGHT = setting.SCREEN_HEIGHT;
  var KEYWORD_SIZE = SCREEN_HEIGHT / 12;
  var INTERVAL = setting.INTERVAL;

  var KEYWORDS2 = null;
  var EASY_KEYWORDS = [];
  var NORMAL_KEYWORDS = [];
  var HARD_KEYWORDS = [];
  var CURRENT_KEYWORDS = EASY_KEYWORDS;

  var EASY_SPRITE_ARRAY = ["noumin","gakusya","ronin","montosyu"];
  var NORMAL_SPRITE_ARRAY = ["asigaru","tujigiri","samurai","syonin","kunoiti","onmyouji"];
  var HARD_SPRITE_ARRAY = ["musya","mouri","ninja","busyou","benkei","tonosama"];
  var CURRENT_SPRITE_ARRAY = EASY_SPRITE_ARRAY;

  var HARD_MODE = false;
  var NORMAL_MODE = false;
  var GAME_END = false;
  var BG = null;

  //敵表示用スプライト 
  var ENEMY_SPRITE_ARRAY = [];
  var ATTACKED_ENEMY = null;
  var KILL = 0;

  var time_over = false;
  var type_end = false;

  var score = 0;
  var total_type = 0;
  var miss_key_array = [];
  var score_rate = 1;
  var count = 0;
  var miss_count = 0;

  //制限時間
  var time = 60;
  //経過時間
  var past_time = 0;
  //残り時間
  var left_time = time;

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
      BG = Sprite('nouson_bg').addChildTo(this.group_bg);
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
      miss_key_array = [];

      this.score_label = Label({
        text: '得点: {0}'.format(score),
        fontFamily: 'HiraMinPro-W6',
        fill: 'white',
        stroke: 'black',
        strokeWidth: 7,
        fontSize: KEYWORD_SIZE * 2 / 3, 
      }).addChildTo(this).setPosition(this.gridX.span(14), this.gridY.span(1));

      //残り時間
      this.time_label = Label({
        text: '残り時間: {0}'.format(time),
        fontFamily: 'HiraMinPro-W6',
        fill: 'white',
        stroke: 'black',
        strokeWidth: 7,
        fontSize: KEYWORD_SIZE * 2 / 3, 
      }).addChildTo(this).setPosition(this.gridX.span(5), this.gridY.span(1));

      //タイプ制限時間
      var timeLimit = 5;

      //タイマーゲージ
      var timerGauge = Gauge({
        x: 320, y: 150,        // x,y座標
        width: 400,            // 横サイズ
        height: 20,            // 縦サイズ
        cornerRadius: 10,      // 角丸み
        maxValue: 100,         // ゲージ最大値
        value: 100,         // ゲージ初期値
        fill: 'white',         // 後ろの色
        timerGaugeColor: 'skyblue', // ゲージ色
        stroke: 'silver',      // 枠色
        strokeWidth: 5,        // 枠太さ
      }).addChildTo(this);

      timerGauge.animation =false;
      timerGauge.setPosition(this.gridX.center(), this.gridY.center(-5.5));;

      timerGauge.onempty = function() {
        time_over = true;
      };  
      
      timerGauge.update= function(){
        if(type_end){
          timerGauge.value = 100;
          type_end = false;
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
      this.initializeMain();
      // キーワードをロード
      this.loadKeywords();
      //カウントシーンを挿入
      start.start();
      this.app.pushScene(Start());
    },

    initializeMain: function(){
      //前回のプレイを初期化
      GAME_END = false;
      left_time = time;
      past_time = 0;
      KILL = 0;
      NORMAL_MODE = false;
      HARD_MODE = false;
      ENEMY_SPRITE_ARRAY = [];
      miss_count = 0;
      CURRENT_SPRITE_ARRAY = EASY_SPRITE_ARRAY;
      CURRENT_KEYWORDS = EASY_KEYWORDS;
    },

    // シーンに復帰した時
    onresume:function() {
      this.initializeMain();
      // キーワード作成
      this.createKeyword();
      this.createEnemy();
    },
    
    // 毎フレーム更新処理
    update: function(app) {
      //残り時間計測
      if(left_time > 0){
        past_time += app.deltaTime/1000;
        left_time = time - Math.floor(past_time);
        this.time_label.text = '残り時間: {0}'.format(left_time);
      }else if(!GAME_END){
        GAME_END = true;
        finish.finish();
        this.app.pushScene(Finish({
          score: score,
          total_type: (total_type - miss_count),
          speed: Math.floor((total_type - miss_count)/time * 10)/10,
          miss_key_array,
        }));
        //this.showResult();
      };
      
      // 画面下到達チェック
      this.checkTimeUp();

      //モードセッティング
      if(KILL >= 12 && !NORMAL_MODE){
        NORMAL_MODE = true;
        CURRENT_KEYWORDS = NORMAL_KEYWORDS;
        CURRENT_SPRITE_ARRAY = NORMAL_SPRITE_ARRAY;
        BG = Sprite('main_bg').addChildTo(this.group_bg);
        BG.x = this.gridX.center();
        BG.y = this.gridY.center();
        BG.width = SCREEN_WIDTH;
        BG.height = SCREEN_HEIGHT;
      }else if(KILL >= 21 && !HARD_MODE){
        HARD_MODE = true;
        CURRENT_KEYWORDS = HARD_KEYWORDS;
        CURRENT_SPRITE_ARRAY = HARD_SPRITE_ARRAY;
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
      var random_num = this.getRandom(CURRENT_KEYWORDS.length);
      var next_word= CURRENT_KEYWORDS[random_num];
      // キーワード作成
      var keyword = Keyword(next_word.type_text,next_word.display_text).addChildTo(this.keywordGroup);
      CURRENT_KEYWORDS.splice(random_num,1);
      // 位置
      keyword.x = this.gridX.center();
      keyword.y = this.gridY.center(-3);
    },

    createEnemy: function(){
      if(KILL == 0 || KILL % 3 == 0){
        ENEMY_SPRITE_ARRAY.push(Character(this.getRandomEnemy(),this.gridX.center(4),this.gridY.center(3)).addChildTo(this.group_chara));
        ENEMY_SPRITE_ARRAY.push(Character(this.getRandomEnemy(),this.gridX.center(-4),this.gridY.center(3)).addChildTo(this.group_chara));
        ENEMY_SPRITE_ARRAY.push(Character(this.getRandomEnemy(),this.gridX.center(),this.gridY.center(3)).addChildTo(this.group_chara));

        ATTACKED_ENEMY = ENEMY_SPRITE_ARRAY[Math.floor(Math.random() * ENEMY_SPRITE_ARRAY.length)];
      }
    },

    // 入力時間終了
    checkTimeUp: function() {
      var self = this;
      this.keywordGroup.children.each(function(keyword) {
        if(time_over){
          keyword.remove();
          time_over = false;
          type_end = true;
          self.createKeyword();
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
      var self = this;

      this.keywordGroup.children.each(function(keyword) {
        var str = keyword.text.toLowerCase();
        // タイプ成功
        if (str.startsWith(checkBuffer)) {
          
          ATTACKED_ENEMY.damaged();

          var hitEffect = self.createHitEffect();
          hitEffect.gotoAndPlay('hit');
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
          //keyword.setMask(self.buffer.length);
          keyword.changeColor(self.buffer.length);
          // 完全一致
          if (self.buffer.length === str.length) {
            KILL++;
            ATTACKED_ENEMY.death();
            var i = ENEMY_SPRITE_ARRAY.indexOf(ATTACKED_ENEMY);
            var enemy_left = ENEMY_SPRITE_ARRAY.splice(i,1).length;
            ATTACKED_ENEMY = ENEMY_SPRITE_ARRAY[Math.floor(Math.random() * enemy_left)];
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
          miss_count++;
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
      type_end = true;
      //モンスター画像削除
      
      // 削除アニメーション
      keyword.tweener.set({stroke: 'lime', cornerRadius: KEYWORD_SIZE / 8,})
                    .fadeOut(200)
                    .wait(INTERVAL)
                    .call(function() {
                        keyword.remove();
                        //次のキーワード作成
                        self.createKeyword();
                        self.createEnemy();
                      }).play();
    },
    // 結果表示
    showResult: function() {
      SoundManager.setVolumeMusic(0.05);
      // リザルトシーンへ
      this.app.replaceScene(Finish({
        score: score,
        total_type: (total_type - miss_count),
        speed: Math.floor((total_type - miss_count)/time * 10)/10,
        miss_key_array,
      }));      
    },
    // キーワードをロード
    loadKeywords: function() {
      KEYWORDS2 = play_record_channel.keywords;
      KEYWORDS2.sort(function(a, b) { return a.type_text.length - b.type_text.length; });
      KEYWORDS2.forEach(element => {
        if(element.type_text.length <= 6){
          EASY_KEYWORDS.push(element);
        }else if(element.type_text.length <= 10){
          NORMAL_KEYWORDS.push(element);
        }else{
          HARD_KEYWORDS.push(element);
        }
      });
    },

    getRandomEnemy: function(){
      return CURRENT_SPRITE_ARRAY[this.getRandom(CURRENT_SPRITE_ARRAY.length)];
    },

    getRandom: function(num){
      return Math.floor(Math.random()*num);
    },

    createHitEffect: function(){
      //エフェクト
      var sprite = Sprite('hit', 64, 64).addChildTo(this.group_ef);
      var hitEffect = FrameAnimation('hit_ss').attachTo(sprite);          
      sprite.x = ATTACKED_ENEMY.x + this.getRandom(100)-50;
      sprite.y = ATTACKED_ENEMY.y + this.getRandom(100)-50;
      return hitEffect;
    },
  });
}