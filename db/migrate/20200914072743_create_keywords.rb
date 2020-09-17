class CreateKeywords < ActiveRecord::Migration[6.0]
  def change
    create_table :keywords do |t|
      t.string :type_text, null: false
      t.string :display_text, null: false
      t.timestamps
    end
  end
end
