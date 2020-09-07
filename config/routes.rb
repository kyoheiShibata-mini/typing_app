Rails.application.routes.draw do
  root to: "typing#index"
  resources :typings, only:[:index]

end
