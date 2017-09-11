Rails.application.routes.draw do
  mount Translator::Engine => "/translator" if Translator.mount
end

Translator::Engine.routes.draw do
  post '/translate', to: 'translations#translate'
  post '/translate/:from', to: 'translations#translate'
  post '/translate/:from/:to', to: 'translations#translate'
end