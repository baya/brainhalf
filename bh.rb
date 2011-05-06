# -*- coding: utf-8 -*-
require 'bundler/setup'
Bundler.require(:default)
require 'json/add/rails'
require 'ext/object'
require 'lib/dou_ban'
require 'models/book'

helpers do

  def h(text)
    Rack::Utils.escape_html(text)
  end

  def pl(book)
    [book.authors, book.translators, book.publisher, book.pubdate, book.price].delete_if { |c| c.blank? }.join(" / ")
  end

  def json(books)
    book_sources = { }
    books.each{ |book|
      book_sources[book.subject_id.to_s] = { 'image_link' => book.image_link,
        'name' => book.name,
        'alt_link' => book.alt_link,
        'subject_id' => book.subject_id.to_s
      }
    }
    book_sources.to_json
  end

end

get '/' do
  haml :index
end

get '/book/search' do
  @books = Book.where(:q => params[:q])
  haml :index
end

get '/book/bh' do
  @book = brainhalf(params[:bh_books])
  haml :bh
end

def brainhalf(book_sids)
  sid = book_sids[rand(book_sids.length)]
  Book.where(:sid => sid).first
end
