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
      if options[:to].present?
        to = options[:to]
      else
        begin
          to = @controller.send(Translator.user_lang_method)
        rescue
          to = nil
        end
      end

      Translator.callback.call(text, from, to)
    end
  end
end