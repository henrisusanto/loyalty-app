import { createConnection, loader, serviceContainer } from 'fastro'
import { TokenService } from '../token.service'
import { UserService } from '../../user/user.service'

let service: TokenService
let userService: UserService

beforeAll(async () => {
  await createConnection()
  await loader()
  service = serviceContainer.get('TokenService')
  userService = serviceContainer.get('UserService')
  await service.deleteAll()
  await userService.deleteAll()
})

afterAll(() => {
  service.close()
  userService.close()
})

describe('test token service', () => {
  test('generate token', async done => {
    const payload = {
      email: 'john@gmail.com',
      username: 'john',
      password: 'secret'
    }
    const user = await userService.register(payload)
    if (user.id) {
      const user2 = await service.generateToken(user.id)
      expect(user2.token).toBeDefined()
    }
    done()
  })

  test('get token', async done => {
    const result = await userService.login({ username: 'john', password: 'secret', email: '' })
    if (!result) throw new Error('User not found')
    const { token } = result
    if (token) {
      const tokenToGet = await service.getToken(token)
      expect(tokenToGet?.token).toBeDefined()
    }
    done()
  })
})
