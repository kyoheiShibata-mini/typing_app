class UsersController < ApplicationController
  before_action :user_data, only: [:show,:edit,:update]

  def new
    @user = User.new();
  end

  def create
    @user = User.new(user_params);
    if @user.valid?
      redirect_to root_path
    else
      render :new
    end
  end

  def show
    
  end

  def edit
  end

  def update
    if @user.update(user_params)
      redirect_to root_path
    else
      render :edit
    end
  end

  private
  def user_params
    image_id = nil;

    if params[:user][:active_image] != ""
      image_id = Item.find_by(image_name: params[:user][:active_image]).id
    end

    params.require(:user).permit(:name,:email,:password).merge(active_image: image_id);
  end

  def user_data
    @user = User.find(params[:id])
    if @user.active_image
      @item = Item.find(@user.active_image)
      @image_name = @item.image_name
    end
    if @user.card
      Payjp.api_key = ENV["PAYJP_SECRET_KEY"] # 環境変数を読み込む
      card = Card.find_by(user_id: @user.id)

      customer = Payjp::Customer.retrieve(card.customer_token) # 先程のカード情報を元に、顧客情報を取得
      @card = customer.cards.first
    end

    if @user.results.length != 0
      @latest_result = @user.results[@user.results.length-1]  
      @latest_miss_key = []
      if @latest_result.miss_key
        miss_key_column = MissKey.attribute_names().reject { |n| n == "id" || n == "result_id" || n == "created_at" || n == "updated_at" }
        #タイプミスしたキーの情報を配列にまとめる
        miss_key_column.each do |column|
          if @latest_result.miss_key[column]
            @latest_miss_key.push({name: column, value: @latest_result.miss_key[column]})
          end
        end
        @latest_miss_key.sort! {|x,y| y[:value]<=>x[:value]}
      end
    end

    if @user.active_image
      @item = Item.find(@user.active_image)
      @image_name = @item.image_name
    end
    
    if @user.user_items.length != 0
      
      @item_array = []
      @user.user_items.each do |user_item|
        item = Item.find(user_item[:item_id])
        @item_array.push([item.name,item.image_name])
      end
    end
  end

end
