## アプリケーション名
大江戸タイピング
![ooedo_logo](https://user-images.githubusercontent.com/47973856/94108909-18e03200-fe7b-11ea-83d7-3df7639807a2.png)
## アプリケーション概要
楽しみながらタイピングの上達ができるタイピングゲームアプリです。
タイプミスしたキーを確認することができるため、自分の弱点を把握し上達しやすくなっています。
またランキングで他のユーザーと競うこともできるため、継続的なモチベーション維持も見込めます。

## URL
https://ooedo-typing.herokuapp.com/

## ベーシック認証アカウント
# ベーシック認証アカウント
 * ユーザー：admin
 * パスワード：2222

# テスト用ユーザー
 * メールアドレス： bob@bob
 * パスワード：bob0000

# テスト用クレジットカード
 * 番号：4242424242424242
 * 期限：1/2021（本日より未来の日付）
 * セキュリティコード：123（任意の半角数字３文字）

## 利用方法

# タイピングゲーム（メイン機能）
ログインの有無にかかわらずプレイ可能です。
ログインしていれば、プレイリザルトはDBに保存され他の機能を利用することができます。

# マイページ
登録後、ヘッダーからマイページへ行けるようになります。

ヘッダーのログインリンク
↓
ログインページ下部の「登録がお済みでない〜」のリンク
↓
新規登録ページにてユーザー登録

マイページではリザルトや登録したクレジットカードの確認のほか、サインアウトやユーザー情報の編集ができます。

# ストア機能
プロフィールのアイコンに設定する画像を購入することができます。
ユーザー登録後、ストア画面のいづれかの購入ボタンをクリックするとカード登録画面へ遷移します。カード登録後はクリックで購入することができ、購入したアイコンはマイページで設定可能です。

# ランキング機能
ヘッダーメニューの「ランキング」からアクセス可能で、ログインの有無にかかわらず閲覧できます。
過去の記録から上位１０名がランキング形式で表示されます。

## 洗い出した要件
タイピングゲーム:メインコンテンツ部分
タイプミス集計機能:タイピング上達のための機能
オンラインランキング機能:DBを利用したアピール
ユーザー管理機能:個人の記録を管理して上達度を可視化
単語登録機能:苦手な単語を登録する
クレジット決済機能:オプションのマネタイズ機能
グラフィック演出機能:賑やかし

## 実装予定の機能
・過去１０回分のリザルトを閲覧可能に
・間違えたキーワードを集中的に登場させるモード
・制限時間をタイトルで３種から選択
・単語登録機能
・ノーミスコンボ機能
・

### テーブル設計
![typing_db](https://user-images.githubusercontent.com/47973856/94110060-f64f1880-fe7c-11ea-850f-e68d1e82bcf6.jpg)
## users テーブル

| Column     | Type       | Options     |
| --------   | ------     | ----------- |
| nickname   | string     | null: false |
| email      | string     | null: false |
| password   | string     | null: false |
| first_name | string     | null: false |
| second_name| string     | null: false |
| first_kana | string     | null: false |
| second_kana| string     | null: false |
| birth      | date       | null: false |

### Association

- has_many :items
- has_many :comments
- has_many :buy_logs

## items テーブル

| Column     | Type       | Options                        |
| ------     | ------     | -----------                    |
| name       | string     | null: false                    |
| price      | integer    | null: false                    |
| explain    | string     | null: false                    |
| user       | references | null: false, foreign_key: true |
| category_ah| integer    | null: false                    |
| state_ah   | integer    | null: false                    |
| fee_ah     | integer    | null: false                    |
| place_ah   | integer    | null: false                    |
| dispatch_ah| integer    | null: false                    |

### Association

- belongs_to :user
- has_many :comments
- has_one :buy_log

## comments テーブル

| Column  | Type       | Options                        |
| ------- | ---------- | ------------------------------ |
| user    | references | null: false, foreign_key: true |
| item    | references | null: false, foreign_key: true |
| text    | string     | null:false                     |

### Association

- belongs_to :user
- belongs_to :item

## buy_log テーブル

| Column     | Type       | Options                        |
| -------    | ---------- | ------------------------------ |
| user       | references | null: false, foreign_key: true |
| item       | references | null: false, foreign_key: true |

### Association

- belongs_to :user
- belongs_to :item
- has_one :destination

## destinations テーブル

| Column        | Type       | Options                        |
| -------       | ---------- | ------------------------------ |
| buy_log       | reference  | null: false, foreign_key: true |
| postal        | string     | null:false                     |
| city          | string     | null:false                     |
| address       | string     | null:false                     |
| building      | string     |                                |
| tel           | string     | null:false                     |
| prefecture_ah | integer    | null:false                     |

### Association

- belongs_to :buy_log


# テーブル設計

## words テーブル
## ゲームに表示させる単語。登録で増やせる

| Column     | Type       | Options                      |
| --------   | ------     | -----------                  |
| text       | string     | null: false, uniqueness: true|

### Association

## users テーブル

| Column     | Type       | Options                        |
| ------     | ------     | -----------                    |
| name       | string     | null: false  uniqueness: true  |
| email      | string     | null: false  uniqueness: true  |
| (password) | string     | null: false                    |

### Association

- has_many :user_items
- has_many :results

## results テーブル
## ゲーム一回ごとの結果を記録

| Column     | Type       | Options                        |
| -------    | ---------- | ------------------------------ |
| user_id    | references | null:false,foreign_key: true   |
| total_type | integer    | null:false                     |
| good_type  | integer    | null:false                     |
| score      | integer    | null:false                     |

### Association

- belongs_to :user
- has_many :miss_types

## miss_types テーブル
## タイプミスしたキーと回数を記録

| Column     | Type       | Options                         |
| -------    | ---------- | ------------------------------  |
| result_id  | references | null: false,foreign_key: true   |
| key        | string     | null: false  uniqueness: true   |
| times      | integer    | null: false                     |

### Association

- belongs_to :result

## user_items テーブル

| Column     | Type       | Options                         |
| -------    | ---------- | ------------------------------  |
| user_id    | references | null:false,foreign_key: true    |
| item_id    | references | null:false,foreign_key: true    |

### Association

- belongs_to :user
- belongs_to :item

## items テーブル
## ストアページでアイコンなどを販売

| Column     | Type       | Options                         |
| -------    | ---------- | ------------------------------  |
| name       | references | null:false,foreign_key: true    |
| price      | references | null:false,foreign_key: true    |

### Association

- has_many :user_items