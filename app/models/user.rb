class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  with_options presence: true do
    validates :name
    validates :email
    validates :password
  end

  VALID_PASSWORD_REGEX = /\A(?=.*?[a-z])(?=.*?\d)[a-z\d]+\z/i
  validates :password, format: { with: VALID_PASSWORD_REGEX }
  
  has_many :user_items
  has_many :items ,through: :user_items, dependent: :destroy
  has_many :results
  has_one :card, dependent: :destroy
  
end
