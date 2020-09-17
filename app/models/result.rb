class Result < ApplicationRecord
  belongs_to :user
  has_one :miss_key, dependent: :destroy
end
