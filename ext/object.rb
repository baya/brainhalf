
class Object

  def blank?
    if String === self
      self.gsub(/\s/, '').empty?
    else
      respond_to?(:empty?) ? empty? : !self
    end
  end

  def try(method, *args, &block)
    send(method, *args, &block) if respond_to? method
  end

end
