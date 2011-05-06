# -*- coding: utf-8 -*-
require File.dirname(__FILE__) + '/spec_helper'

describe '脑半' do

  def app
    Sinatra::Application
  end

  describe '用户访问脑半首页' do
    it "看到搜索框" do
      get '/'
      last_response.should be_ok
      last_response.body.should include('搜索书籍')
    end
  end

  describe '用户搜索书' do
    it "用户搜索javascript相关的书籍" do
      get '/book/search', :q => "javascript"
      last_response.should be_ok
      last_response.body.should include("javascript")
    end
  end

end


