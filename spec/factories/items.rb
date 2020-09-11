FactoryBot.define do
  factory :item do
    name {Faker::Name.name}
    price {Faker::Number.between(from: 100, to: 1000)}
  end
end
