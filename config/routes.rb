Rails.application.routes.draw do
  devise_for :users
  root to: "typings#index"
  resources :typings, only:[:index,:new,:create]
  resources :users, only:[:new,:create]
  resources :items, only:[:index,:new,:create]
end