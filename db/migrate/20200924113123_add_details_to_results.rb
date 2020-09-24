class AddDetailsToResults < ActiveRecord::Migration[6.0]
  def change
    add_column :results, :mode, :string
  end
end
