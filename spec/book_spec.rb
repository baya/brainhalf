# -*- coding: utf-8 -*-
require File.dirname(__FILE__) + '/spec_helper'

describe Book do

  describe 'Book.where' do

    it 'where(:sid => sid)，通过book的subject_id查找书' do
      books = Book.where(:sid => 2023013)
      books.length.should == 1
      books.first.subject_id.should == 2023013
    end

    it 'where(:q => q)，通过关键字搜索书籍' do
      books = Book.where(:q => '王小波')
      books.should be_instance_of Array
      books.each{ |book|
        book.authors.should match(/王小波/)
      }
    end

  end

  describe 'Book#image_link' do

    it '书籍的image_link有三种类型, small, medium, large' do
      books_xml = File.read(File.dirname(__FILE__) + '/douban_books.xml')
      books = Book.parse(books_xml)
      book = books.first
      book.image_link.should =~ /spic/
      book.image_link(:medium).should =~ /mpic/
      book.image_link(:large).should =~ /lpic/
    end

  end

  describe 'Book.parse' do

    it '解析搜索javascript获取的xml文档，得到与javascript相关的books' do
      # books_xml = Api::DouBan.book.subjects.get(:q => 'javascript').body
      # 测试时尽量利用本地的数据
      books_xml = File.read(File.dirname(__FILE__) + '/douban_books.xml')
      books = Book.parse(books_xml)
      books.should be_instance_of Array
      books.each { |book|
        book.name.downcase.should include('javascript')
        book.subject_id.to_s.should match(/\d+/)
        book.self_link.should include('http://api.douban.com/book/subject')
        book.alt_link.should include('http://book.douban.com/subject')
        book.image_link.should match(/http:\/\/img/)
        book.num_raters.should match(/\d+/)
        book.average.should match(/\d+/)
        book.price.should match(/\d+/)
        book.pubdate.should_not be_nil
        book.publisher.should_not be_nil
        book.authors.should_not be_nil
        book.translators.should_not be_nil
        ISBN.valid?(book.isbn10).should be_true
        ISBN.valid?(book.isbn13).should be_true
      }
    end

  end

end
