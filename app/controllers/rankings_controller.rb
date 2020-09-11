class RankingsController < ApplicationController
  def index
    @users = User.limit(10)
    @user = User.new()
  end
end
