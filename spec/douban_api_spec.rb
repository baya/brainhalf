# -*- coding: utf-8 -*-
require File.dirname(__FILE__) + '/spec_helper'

describe '豆瓣API' do

  describe '搜索书籍' do

    it '搜索javascript' do
      q_word_step('/book/subjects', 'javascript')
      q_word_step('book/subjects', 'javascript')
      q_word_step('book/subjects/', 'javascript')
      q_word_step('/book/subjects/', 'javascript')
    end

    it '搜索ruby编程' do
      q_word_step('/book/subjects', 'ruby编程')
      q_word_step('book/subjects', 'ruby编程')
      q_word_step('book/subjects/', 'ruby编程')
      q_word_step('/book/subjects/', 'ruby编程')
    end

    it '搜索王小波' do
      q_word_step('/book/subjects', '王小波')
      q_word_step('book/subjects', '王小波')
      q_word_step('book/subjects/', '王小波')
      q_word_step('/book/subjects/', '王小波')
    end

    def q_word_step(path, q)
      @books_xml = Api::DouBan.get(path, :q => q)
      @books_xml.should be_instance_of(String)
      @books_xml.should include("<title>搜索 #{q} 的结果</title>")
      sleep(2) # 防止豆瓣封禁访问
    end

  end

end
