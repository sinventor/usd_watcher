Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: 'home#index'

  scope module: :admin, path: 'admin' do
    root to: 'dashboard#index'
  end

  namespace :api, defaults: { format: 'json' } do
    resources :usd_rate, only: nil do
      collection do
        get :current
        put :refresh
      end
    end
  end
end
