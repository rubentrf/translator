Rails.application.routes.draw do

  mount Translator::Engine => "/translator"
end
