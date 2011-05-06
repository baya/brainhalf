
module Api
  class DouBan
    @base_url = 'http://api.douban.com'
    @api_config = YAML.load_file(File.join(File.dirname(__FILE__), '..', 'config/key.yml'))['brainhalf']

    class << self

      def get(path, params = { })
        path = path.gsub(/^\/|\/$/, '')
        params = params.merge('apikey' => @api_config['api_key']).map{ |k, v| "#{k}=#{v}"}.join("&")
        url = URI.encode("#{@base_url}/#{path}?#{params}")
        response = Typhoeus::Request.get url
        response.body
      end

    end

  end

end
