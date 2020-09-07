
import * as title from "scenes/title";
import * as count_down from "scenes/count_down";
import * as main_game from "scenes/main_game";
import * as result from "scenes/result";


// グローバルに展開
phina.globalize();
// 定数
var SCREEN_WIDTH = 32 * 40; 
var SCREEN_HEIGHT = 18 * 40; 

var KEYWORD_SIZE = SCREEN_HEIGHT / 12;
var KEYWORD_SPEED_X = 6;
var KEYWORD_SPEED_Y = -10;
var GRAVITY = 0.2;
var COLORS = ['rgb(249,38,114)', 'rgb(166,226,46)', 'rgb(253,151,31)', 'rgb(102,217,239)'];
var BG_COLOR = 'rgb(39,40,34)';
var KEYWORDS = null;
var INTERVAL = 1000;
var CONTINUE = 3;

// アセット
var ASSETS = {
  //サウンド
  sound: {
    'se1': "/Users/shibata.kyohei/projects/typing_app/app/assets/sounds/type.mp3",
  },
  // キーワード一覧
  text: {
    'keywords': 'https://cdn.jsdelivr.net/gh/alkn203/phina-games@master/keyword-shot/assets/keywords',
  },
  image: {
    'tomapiko': 'https://cdn.jsdelivr.net/gh/phi-jp/phina.js@0.1.1/assets/images/tomapiko.png',
  },
};

title.title();
count_down.count_down();
main_game.main_game();
result.result();

/*
 * メイン処理
 */
phina.main(function() {
  // アプリケーションを生成
  var app = GameApp({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    assets: ASSETS,
    fit: false,
    // シーンのリストを引数で渡す
    scenes: [
      {
        className: 'Title',
        label: 'Title',
        nextLabel: 'Main',
      },
      {
        className: 'Count',
        label: 'Count',
        nextLabel: "Result",
      },
      {
        className: 'Main',
        label: 'Main',
        nextLabel: 'Result',
      },
      {
        className: 'Result',
        label: 'Result',
        nextLabel: 'Title',
      },
    ],
    startLabel: 'Title',
  });
  // 実行
  app.run();
});