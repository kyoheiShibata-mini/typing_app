User.create!(
  [
    {email: 'test1@test.com',name: 'テスト太郎',password: 'test0000',active_image: 1},
    {email: 'test2@test.com',name: 'テスト2郎',password: 'test0000',active_image: 2},
    {email: 'test3@test.com',name: 'テスト3郎',password: 'test0000',active_image: 3},
    {email: 'test4@test.com',name: 'テスト4郎',password: 'test0000',active_image: 1},
    {email: 'test5@test.com',name: 'テスト5郎',password: 'test0000',active_image: 2},
    {email: 'test6@test.com',name: 'テスト6郎',password: 'test0000',active_image: 3},
    {email: 'test7@test.com',name: 'テスト7郎',password: 'test0000',active_image: 1},
    {email: 'test8@test.com',name: 'テスト8郎',password: 'test0000',active_image: 2},
    {email: 'test9@test.com',name: 'テスト9郎',password: 'test0000',active_image: 3},
    {email: 'test10@test.com',name: 'テスト10郎',password: 'test0000',active_image: 1},
  ]
)

Result.create!(
  [
    {user_id: 1, score:100, total_type:10, speed: 1},
    {user_id: 2, score:200, total_type:100, speed:1},
    {user_id: 3, score:300, total_type:10, speed: 1},
    {user_id: 4, score:400, total_type:100, speed:1},
    {user_id: 5, score:500, total_type:10, speed: 1},
    {user_id: 6, score:600, total_type:100, speed:1},
    {user_id: 7, score:700, total_type:10, speed: 1},
    {user_id: 8, score:800, total_type:100, speed:1},
    {user_id: 9, score:900, total_type:10, speed: 1},
    {user_id: 10, score:1000, total_type:100, speed:1},
  ]
)