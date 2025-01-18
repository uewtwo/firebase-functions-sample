// import { initializeTestEnvironment } from '@firebase/testing'
// import { db } from '@mimi-api/lib/database'
// import request from 'supertest'
// import { app } from '../../src/app' // Cloud Functions のアプリケーションインスタンス

// describe('CreateUser API', () => {
//   let testEnv: any

//   beforeAll(async () => {
//     testEnv = await initializeTestEnvironment({
//       projectId: 'demo-project',
//     })
//   })

//   beforeEach(async () => {
//     // テストデータのクリーンアップ
//     await db.user.deleteMany()
//   })

//   afterAll(async () => {
//     await testEnv.cleanup()
//     await db.$disconnect()
//   })

//   it('should create a new user', async () => {
//     const testToken = await testEnv.createCustomToken('test-uid')

//     const response = await request(app).post('/users').set('Authorization', `Bearer ${testToken}`).send({
//       username: 'testuser',
//       gender: 'male',
//       birthDate: '2000-01-01',
//       prefectureId: 13,
//     })

//     expect(response.status).toBe(201)
//     expect(response.body.user).toMatchObject({
//       username: 'testuser',
//       gender: 'male',
//       prefecture: {
//         id: 13,
//         name: '東京都',
//       },
//     })

//     // DBに正しく保存されているか確認
//     const createdUser = await db.user.findUnique({
//       where: { id: 'test-uid' },
//       include: { prefecture: true },
//     })
//     expect(createdUser).toBeTruthy()
//   })
// })
