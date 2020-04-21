import { createConnection, loader, serviceContainer } from 'fastro'
import { UserService } from '../user.service'

let service: UserService

beforeAll(async () => {
  await createConnection()
  await loader()
  service = serviceContainer.get('UserService')
  await service.deleteAll()
})

afterAll(() => {
  service.close()
})

describe('test user service', () => {
  test('hi', async done => {
    const hi = service.hi()
    expect(hi).toBe('hi')
    done()
  })

  test('add user', async done => {
    const payload = {
      email: 'john@gmail.com',
      username: 'john',
      password: 'secret'
    }
    const user = await service.register(payload)
    expect(user.username).toBe('john')
    done()
  })

  test('login user', async done => {
    const payload = {
      email: 'john@gmail.com',
      username: 'john',
      password: 'secret'
    }
    const result = await service.login(payload)
    // console.log('user test', result)
    if (result) expect(result?.token).toBeDefined()
    done()
  })

  test('get all', async done => {
    const users = await service.getAllUser()
    // console.log('users', users)
    expect(users.length).not.toBe(0)
    done()
  })
})
