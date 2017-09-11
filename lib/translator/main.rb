module Translator
  class Main
    attr_reader :request, :controller

    def initialize(options = {})
      @controller = options[:controller]
      @request = options[:request] || @controller.try(:request)
      @options = options
    end

    def translate(options ={})
      text = options[:text]
      from = options[:from]
      to = options[:to]

      Translator.callback.call(text, from, to)
    end
  end
end