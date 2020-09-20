class ChangeDataSpeedToResult < ActiveRecord::Migration[6.0]
  def change
    change_column :results, :speed, :float
  end
end
