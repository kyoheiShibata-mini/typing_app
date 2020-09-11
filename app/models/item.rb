class Item < ApplicationRecord
  
  validates :name,:price,:image,presence: true

  has_many :user_items
  has_one_attached :image

end