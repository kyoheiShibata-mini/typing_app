class Item < ApplicationRecord
  
  validates :name,:price,:image_name,presence: true

  has_many :user_items
  has_many :users ,through: :user_items, dependent: :destroy
end