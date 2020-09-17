class AddSpeedsToResults < ActiveRecord::Migration[6.0]
  def change
    add_column :results, :speed, :integer
  end
end
