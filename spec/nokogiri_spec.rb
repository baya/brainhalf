# -*- coding: utf-8 -*-
require File.dirname(__FILE__) + '/spec_helper'

describe Nokogiri::XML do

  before(:each) do
    @book_xml = File.read(File.dirname(__FILE__) + '/douban_books.xml')
  end

  it '解析duban_books.xml, remove_namespaces!' do
    doc = Nokogiri::XML(@book_xml)
    doc.remove_namespaces!
    doc.xpath("//entry").size.should > 0
  end

  it '解析duban_books.xml, 指定namespaces' do
    doc = Nokogiri::XML(@book_xml)
    doc.xpath('//feed:entry', {'feed' => "http://www.w3.org/2005/Atom"}).size.should > 0
  end

  it '解析duban_books.xml, 用文档自带的namespaces' do
    doc = Nokogiri::XML(@book_xml)
    doc.xpath('//xmlns:entry').size.should > 0
  end

end
