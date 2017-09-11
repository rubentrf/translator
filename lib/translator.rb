require "translator/main"
require "translator/engine" if defined?(Rails)

module Translator
  mattr_accessor :max_content_length
  self.max_content_length = 8192

  mattr_accessor :callback
  self.callback = proc {}

  mattr_accessor :mount
  self.mount = true

  def self.setup
    yield self
  end
end