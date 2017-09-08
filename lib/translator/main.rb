module Translator
  class Main
    attr_reader :request, :controller

    def initialize(options = {})
      @t =
      @controller = options[:controller]
      @request = options[:request] || @controller.try(:request)
      @options = options
    end

    def translate(options ={})
      text = options[:text]
      text = options[:from]
      text = options[:to]
    end

    def get_translator
      case Translator.backend
      when :bing_translator
        require 'bing_translator'
        BingTranslator.new(Translator.key)
      when :google_translate
        require 'google_translate'
        GoogleTranslate.new
      end
    end
  end
end