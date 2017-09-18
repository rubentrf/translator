# Translator

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
```
module Translator
  setup do |c|
    c.user_lang_method = :current_language

    c.callback = proc do |text,from, to|
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
