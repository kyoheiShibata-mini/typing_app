class RankingsController < ApplicationController

  def index
    @mode = params[:mode]
    if !@mode
      @mode = "松"
    end

    @results = Result.where(mode: @mode).limit(10).order(score: "DESC")
    
    @user = User.new()
  end
end
