class CreateItems < ActiveRecord::Migration[6.0]
  def change
    create_table :items do |t|
      t.string  :name,  null: false
      t.integer :price, null: false
      t.string  :image_name,  null: false
      t.timestamps
    end
  end
end
