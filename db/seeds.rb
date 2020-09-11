User.create!(
  [
    {
      email: 'test1@test.com',
      name: 'テスト太郎',
      
    },
    {
      email: 'test2@test.com',
      name: 'テスト徹子',
      image: File.open('./app/assets/images/test.jpg')
    }
  ]
)