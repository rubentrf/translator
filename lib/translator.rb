require "translator/main"
require "translator/engine" if defined?(Rails)

module Translator
  mattr_accessor :max_content_length, :callback, :mount, :user_lang_method

  self.max_content_length = 8192
  self.callback = proc {}
  self.mount = true
  self.user_lang_method = ''

  def self.setup
    yield self
  end
end