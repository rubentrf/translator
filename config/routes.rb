Translator::Engine.routes.draw do
  post '/translate/:to_lang_code', to: 'translations#translate'
  post '/translate/:from_lang_code/:to_lang_code', to: 'translations#translate'
end
