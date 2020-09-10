require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'ユーザー情報確認' do
    before do
      @user = FactoryBot.build(:user)
    end

    it "ニックネームが空では登録できない" do
       @user.name = ""
       @user.valid?
       expect(@user.errors.full_messages).to include("Name can't be blank")
    end
    it "メールアドレスが空だと登録できない" do
      @user.email = ""
      @user.valid?
      expect(@user.errors.full_messages).to include("Email can't be blank")
    end
    
    it "メールアドレスが重複していると登録できない" do
      another_user = FactoryBot.build(:user)
      another_user.save
      @user.email = another_user.email
      @user.valid?
      expect(@user.errors.full_messages).to include("Email has already been taken")
    end
    it "メールアドレスは@を含む必要があること" do
      @user.email = Faker::Name.name
      @user.valid?
      expect(@user.errors.full_messages).to include("Email is invalid")
    end
    it "パスワードが必須であること" do
      @user.password = ""
      @user.password_confirmation = @user.password
      @user.valid?
      expect(@user.errors.full_messages).to include("Password can't be blank")
    end   
    it "パスワードは6文字未満だと登録できない" do
      @user.password = "00000"
      @user.password_confirmation = @user.password
      @user.valid?
      expect(@user.errors.full_messages).to include("Password is too short (minimum is 6 characters)")
    end
    it "パスワードは英文字だけだと登録できない" do
      @user.password = "abcdefg"
      @user.password_confirmation = @user.password
      @user.valid?
      expect(@user.errors.full_messages).to include("Password is invalid")
    end   
    it "パスワードは全角だと登録できない" do
      str = "パスワああああアド"
      @user.password = str
      @user.password_confirmation = str
      @user.valid?
      expect(@user.errors.full_messages).to include("Password is invalid")
    end    
    it "パスワードは確認用を含めて2回入力すること" do
      @user.password_confirmation = ""
      @user.valid?
      expect(@user.errors.full_messages).to include("Password confirmation doesn't match Password")
    end
  end
end