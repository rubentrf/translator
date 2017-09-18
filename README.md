# Translator
This gem adds a button to html elements that have the 'translatable' class. When pressing the button, it will send the text of the element to the /translate url which will send the data to the predefined translator. In the callback, it will update the text of the element with the translated content.

## Installation

Add this line to your application’s Gemfile:

```ruby
gem 'translator', github: 'ipet/translator'
```

And add the javascript file in `app/assets/javascripts/application.js` after jQuery.

```javascript
//= require jquery
//= require translator
```

Add translator initializer
```ruby
module Translator
  setup do |config|
    config.user_lang_method = :current_language

    config.callback = proc do |text,from, to|
      # Block that gets called when translating text
      begin
        CustomTranslator.translate(text, from: from, to: to, content_type: 'text/html')
      rescue => e
        "#{e.class.to_s} #{e.message}"
      end
    end
  end
end
```

ApplicationController method that will be called to detect the language of the user
```ruby
config.user_lang_method = :method_name
```

Block that will be called when clicked on the translate button on en element.
```ruby
config.callback = proc {}
```
