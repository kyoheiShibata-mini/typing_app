class CreateResults < ActiveRecord::Migration[6.0]
  def change
    create_table :results do |t|
      t.references :user, foreign_key: true
      t.integer :score,  null: false
      t.integer :total_type, null: false

      t.timestamps
    end
  end
end
