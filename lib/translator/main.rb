module Translator
  class Main
    attr_reader :request, :controller

    def initialize(options = {})
      @controller = options[:controller]
      @request = options[:request] || @controller.try(:request)
      @options = options
    end

    def translate(options ={})
      scrubber = TranslatableTextScrubber.new
      text = Loofah.fragment(options[:text]).scrub!(scrubber).to_s

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

class TranslatableTextScrubber < Rails::Html::PermitScrubber
  def initialize
    super
    self.tags = %w( a b i strong em p param h1 h2 h3 h4 h5 h6 br hr ul ol li img figure iframe div span blockquote question embed font video source audio )
  end

  def ignored_elements
    %w(translate-link translate-exclude)
  end

  def scrub_node(node)
    node.remove
  end

  def allowed_node?(node)
    !(node.attributes["class"]&.name == "class" &&
    (node.attributes["class"].value.split(" ") & ignored_elements).any?)
  end
end