module Translator
  class TranslationsController < ApplicationController

    def translate
      render json: {translator.translate(params) }
    end


    protected

    def translator
      @translator ||= Translator.new(controller: self)
    end


    def verify_request_size
      if request.content_length > Translator.max_content_length
        logger.info "[Translator] Payload too large"
        render text: "Payload too large\n", status: 413
      end
    end
  end
end
