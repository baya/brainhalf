require File.dirname(__FILE__) + '/spec_helper'

describe Object do

  it 'Object#try' do
    "abc".try(:length).should == 3
    nil.try(:length).should be_nil
    "abc".try(:abc).should be_nil
  end

  it 'Object#blank?' do
    "  ".blank?.should be_true
    "a".blank?.should be_false
    false.blank?.should be_true
    true.blank?.should be_false
    [].blank?.should be_true
    { }.blank?.should be_true
    [1,2].blank?.should be_false
    { :a => 1}.blank?.should be_false
    "".blank?.should be_true
    nil.blank?.should be_true
    Object.new.blank?.should be_false
  end

end
