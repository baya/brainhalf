# -*- coding: utf-8 -*-

class Book

  attr_accessor :name,  # 书名
  :authors,             # 作者
  :self_link,           # self link
  :alt_link,            # alt link
  :translators,         # 翻译者
  :num_raters,          # 评价人数
  :average,             # 平均得分
  :price,               # 书的价格
  :pubdate,             # 出版日期
  :publisher,           # 出版商
  :isbn10,              # 10位isbn
  :isbn13,              # 13位isbn
  :subject_id           # http://book.douban.com/subject/:subject_id

  def initialize(attributes = { })
    attributes.each { |k, v| send "#{k}=", v if respond_to? k}
    yield self if block_given?
  end

  class << self

    def where(query = { })
      query.delete_if{ |k, v| v.blank? }
      return [] if query.blank?
      sid = query[:sid] || query['sid']
      q = query[:q] || query['q']
      if sid
        xml = Api::DouBan.get("/book/subject/#{sid}")
      elsif q
        xml = Api::DouBan.get("/book/subjects", :q => q)
      end
      begin books = parse(xml) rescue [] end
    end

    def parse(xml)
      doc = Nokogiri::XML(xml)
      books = doc.xpath('//xmlns:entry').map { |entry|
        new(:name => entry.xpath('xmlns:title').text,
            :self_link   => get_link(entry, "self"),
            :alt_link    => get_link(entry, "alternate"),
            :image_link  => get_link(entry, "image"),
            :authors     => entry.xpath('xmlns:author/xmlns:name').map(&:text).join(", "),
            :isbn10      => get_db_attribute(entry, "isbn10"),
            :isbn13      => get_db_attribute(entry, "isbn13"),
            :price       => get_db_attribute(entry, "price"),
            :pubdate     => get_db_attribute(entry, "pubdate"),
            :publisher   => get_db_attribute(entry, "publisher"),
            :translators => get_db_attribute(entry, "translator")
            ) do |book|
          gd = entry.xpath('gd:rating').first
          book.average = gd['average']
          book.num_raters = gd['numRaters']
          id = entry.xpath('xmlns:id').text
          id =~ /subject\/(\d+)/
          book.subject_id = $1.to_i
        end
      }
    end

    private
    def get_link(entry, rel)
      entry.xpath("xmlns:link[@rel=\"#{rel}\"]").first['href']
    end

    def get_db_attribute(entry, name)
      attrs = entry.xpath("db:attribute[@name=\"#{name}\"]")
      attrs.size > 1 ? attrs.map(&:text).join(", ") : attrs.text
    end

  end

  def image_link= link
    @image_link = link
  end

  def image_link(type = :small)
    case type
    when :small; @image_link
    when :medium; @image_link.sub(/spic/, 'mpic')
    when :large; @image_link.sub(/spic/, 'lpic')
    else
      @image_link
    end
  end

end
