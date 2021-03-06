import * as loading from "scenes/loading";
import * as title from "scenes/title";
import * as main_game from "scenes/main_game";
import * as result from "scenes/result";
import * as finish from "scenes/finish";
import * as shadow from "scenes/shadow";

import * as setting from "scenes/setting";
import * as keywords from "scenes/keywords";
import * as characters from "./scenes/characters";

// グローバルに展開
phina.globalize();
// 定数
var SCREEN_WIDTH = setting.SCREEN_WIDTH; 
var SCREEN_HEIGHT = setting.SCREEN_HEIGHT;

// アセット
var ASSETS = {
  //サウンド
  sound: {
    'start': '../../assets/start_se.mp3',

    'type1': '../../assets/katana-clash1.mp3',
    'type2': '../../assets/katana-clash2.mp3',
    'type3': '../../assets/katana-clash3.mp3',

    'miss1': '../../assets/miss1.mp3',
    'miss2': '../../assets/miss2.mp3',

    'todome': '../../assets/todome.mp3',

    'bgm': '../../assets/maturi.mp3',
    'boss_bgm': '../../assets/boss_bgm.mp3',
    'result_bgm': '../../assets/result_bgm.mp3',

  },
  
  image: {
    'logo': '../../assets/ooedo_logo.png',
    'logo_side': '../../assets/ooedo_logo_side.png',

    'twitter': '../../assets/twitter.png',

    'main_bg': '../../assets/main_bg.jpeg',
    'boss_bg': '../../assets/boss_bg1.jpg',
    'title_bg': '../../assets/title_bg.jpg',
    'result_bg': '../../assets/result_bg.jpg',
    'nouson_bg': '../../assets/nouson_bg.jpg',

    //イージー敵
    'noumin': '../../assets/chara/noumin.png',
    'gakusya': '../../assets/chara/gakusya.png',
    'ronin': '../../assets/chara/ronin.png',
    'montosyu': '../../assets/chara/montosyu.png',

    //ノーマル敵
    'asigaru': '../../assets/chara/asigaru.png',
    'tujigiri': '../../assets/chara/tujigiri.png',
    'samurai': '../../assets/chara/samurai.png',
    'syonin': '../../assets/chara/syonin.png',
    'kunoiti': '../../assets/chara/kunoiti.png',
    'onmyouji': '../../assets/chara/onmyouji.png',

    //ハード敵    
    'mouri': '../../assets/chara/mouri.png',
    'musya': '../../assets/chara/musya.png',
    'ninja': '../../assets/chara/ninja.png',
    'busyou': '../../assets/chara/busyou.png',
    'benkei': '../../assets/chara/benkei.png',
    'tonosama': '../../assets/chara/tonosama.png',

    'shadow': '../../assets/chara/shadow.png',


    'hit': '../../assets/effect/hit.png',
  },
  spritesheet: {
    "hit_ss":
    {
      // フレーム情報
      "frame": {
        "width": 192, // 1フレームの画像サイズ（横）
        "height": 192, // 1フレームの画像サイズ（縦）
        "cols": 5, // フレーム数（横）
        "rows": 2, // フレーム数（縦）
      },
      // アニメーション情報
      "animations" : {
        "hit": { // アニメーション名
          "frames": [1,2,3,4,5,6], // フレーム番号範囲
          "frequency": 1, // アニメーション間隔
        },
      }
    },
   },
};

loading.loading();
title.title();
main_game.main_game();
result.result();
keywords.keywords();
characters.characters();
finish.finish();
shadow.shadow();

/*
 * メイン処理
 */
phina.main(function() {
  // アプリケーションを生成
  var app = GameApp({
    
    // 表示先のcanvasを指定
    query: '#mycanvas',
    // 画面にフィットさせない
    fit: false,

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
        className: 'Main',
        label: 'Main',
        nextLabel: 'Result',
      },
      {
        className: 'Result',
        label: 'Result',
        nextLabel: 'Title',
      },

      {
        className: 'Finish',
        label: 'Finish',
        nextLabel: 'Result',
      },
    ],
    startLabel: 'Title',
  });

  app.domElement.addEventListener('touchend', function dummy() {
    var s = phina.asset.Sound();
    s.loadFromBuffer();
    s.play().stop();
    app.domElement.removeEventListener('touchend', dummy);
  });
  // 実行
  app.run();
});