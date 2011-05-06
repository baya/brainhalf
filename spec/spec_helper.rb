require File.join(File.dirname(__FILE__), '..', 'bh.rb')
require 'rspec'
require 'rack/test'

set :environment, :test

Rspec.configure do |config|
  config.include Rack::Test::Methods
end
