$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "translator/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "translator"
  s.version     = Translator::VERSION
  s.authors     = ["Patrick Salij"]
  s.email       = ["patrick-salij@hotmail.com"]
  s.homepage    = ""
  s.summary     = "Summary of Translator."
  s.description = "Description of Translator."
  s.license     = "MIT"
  s.files         = `git ls-files -z`.split("\x0")
  s.test_files = Dir["test/**/*"]
  s.require_paths = ["lib"]

  s.add_dependency "rails", ">= 4.2.4"
  s.add_dependency "rails-html-sanitizer"

  s.add_development_dependency "sqlite3"
end
