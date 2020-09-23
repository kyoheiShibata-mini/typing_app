class ItemsController < ApplicationController

  before_action :find_item, only: :order

  def index 
    @items = Item.all()
    @item = Item.new();
  end

  def order
    if !user_signed_in?
      #ログインしてなければログイン画面に飛ばす
      redirect_to new_user_session_path
    elsif current_user.card.present?
      #カードを登録していれば購入処理
      Payjp.api_key = ENV["PAYJP_SECRET_KEY"] # 環境変数を読み込む
      customer_token = current_user.card.customer_token # ログインしているユーザーの顧客トークンを定義
      Payjp::Charge.create(
        amount: @item.price, # 商品の値段
        customer: customer_token, # 顧客のトークン
        currency: 'jpy' # 通貨の種類（日本円）
      )
      UserItem.create(item_id: params[:id],user_id: current_user.id) # 商品のid情報を「item_id」として保存する
      redirect_to items_path
    else
      #カードを持っていなければカード登録画面へ
      redirect_to new_card_path
    end
  end

  private

  def find_item
    @item = Item.find(params[:id]) # 購入する商品を特定
  end
end
