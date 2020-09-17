class CreateMissKeys < ActiveRecord::Migration[6.0]
  def change
    create_table :miss_keys do |t|
      t.references :result, foreign_key: true

      t.integer :a
      t.integer :b
      t.integer :c
      t.integer :d
      t.integer :e
      t.integer :f
      t.integer :g
      t.integer :h
      t.integer :i
      t.integer :j
      t.integer :k
      t.integer :l
      t.integer :n
      t.integer :m
      t.integer :o
      t.integer :p
      t.integer :q
      t.integer :r
      t.integer :s
      t.integer :t
      t.integer :u
      t.integer :v
      t.integer :w
      t.integer :x
      t.integer :y
      t.integer :z
      t.integer :-
      t.timestamps
    end
  end
end
