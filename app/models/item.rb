class Item < ApplicationRecord
  
  validates :name,:price,:image,presence: true

  has_many :user_items
  has_many :users ,through: :user_items, dependent: :destroy
end