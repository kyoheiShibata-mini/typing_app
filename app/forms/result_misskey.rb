class ResultMisskey
  include ActiveModel::Model

  attr_accessor :user, :score, :total_type, :speed, :a, :b, :c, :d, :e, :f, :g, :h, :i, :j, :k, :l, :n, :m, :o, :p, :q, :r, :s, :t, :u, :v, :w, :x, :y, :z

  #保存先モデルのバリデーション
  with_options presence: true do
    validates :user
    validates :score
    validates :total_type
    validates :speed
  end

  def save
    result = Result.create(user: user, score: score, total_type: total_type, speed: speed)
    MissKey.create(result: result, a: a, b: b, c: c, d: d, e: e, f: f, g: g, h:h, i:i, j:j, k:k, l:l, n:n, m:m, o:o, p: p, q:q, r:r, s:s, t:t, u:u, v:v, w:w, x:x, y:y, z:z)
  end
end

