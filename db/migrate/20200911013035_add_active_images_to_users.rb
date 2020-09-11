class AddActiveImagesToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :active_image, :integer
  end
end
