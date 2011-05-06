# -*- coding: utf-8 -*-
require 'simple-rss'
require File.dirname(__FILE__) + '/spec_helper'

describe SimpleRSS do
  it '解析douban搜索javascript书的atom' do
    books_xml = File.read(File.dirname(__FILE__) + '/douban_books.xml')
    doc = SimpleRSS.parse(books_xml)
    doc.feed.title.should == '搜索 javascript 的结果'
    doc.entries.each { |entry|
      entry.title.downcase.should include 'javascript'
    }
  end
end
