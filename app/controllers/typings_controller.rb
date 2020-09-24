class TypingsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: :create 

  def index
  end

  def new 
    @keywords = Keyword.all
    logger.debug "@keywordsの中身: #{@keywords.length}"
    ActionCable.server.broadcast "play_record_channel", keywords: @keywords
  end
  
  def create
    if user_signed_in?
      result_miss_key = ResultMisskey.new(result_params)
      result_miss_key.save
    end
  end

  private

  def result_params
    params.require(:typing).permit(:score, :total_type, :speed, :miss_key_array, :miss_key_total, :mode, :a, :b, :c, :d, :e, :f, :g, :h, :i, :j, :k, :l, :n, :m, :o, :p, :q, :r, :s, :t, :u, :v, :w, :x, :y, :z).merge(user: current_user)
  end
end