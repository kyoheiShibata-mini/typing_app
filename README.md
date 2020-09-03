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