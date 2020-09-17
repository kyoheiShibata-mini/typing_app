class RankingsController < ApplicationController
  def index
    @results = Result.limit(10).order(score: "DESC")
    @user = User.new()
  end
end
