Rails.application.routes.draw do
  devise_for :users
  root to: "typings#index"
  resources :cards, only: [:new, :create]
  resources :typings, only:[:index,:new,:create]
  resources :users, only:[:new,:create]
  resources :items, only:[:index,:new,:create], on: :order do
    post 'order' , on: :member
  end

  get '/ranking', to: 'rankings#index'

end