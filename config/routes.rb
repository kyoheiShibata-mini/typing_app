Rails.application.routes.draw do
  devise_for :users
  root to: "typings#index"
  get destroy_user_session_path, to: 'devise/sessions#destroy'
  resources :typings, only:[:index,:new,:create]
  resources :users, only:[:new,:create]

end