import { FastifyInstance } from 'fastify'
import { createServer, serviceContainer } from 'fastro'
import { UserService } from '../user.service'

let server: FastifyInstance
let service: UserService

beforeAll(async () => {
  server = await createServer({ logger: false })
  service = serviceContainer.get('UserService')
  service.deleteAll()
})

afterAll(() => {
  server.close()
})

describe('user controller', () => {
  test('POST /api/user/register', async done => {
    const result = await server.inject({
      url: '/api/user/register',
      method: 'POST',
      payload: {
        email: 'john@gmail.com',
        username: 'john',
        password: 'secret'
      }
    })
    expect(result.statusCode).toBe(200)
    done()
  })
  test('POST /api/user/login', async done => {
    const result = await server.inject({
      url: '/api/user/login',
      method: 'POST',
      payload: {
        email: 'john@gmail.com',
        username: 'john',
        password: 'secret'
      }
    })
    expect(result.statusCode).toBe(200)
    done()
  })
  test('POST /api/user/me', async done => {
    const loginResult = await server.inject({
      url: '/api/user/login',
      method: 'POST',
      payload: {
        email: 'john@gmail.com',
        username: 'john',
        password: 'secret'
      }
    })

    const { body: data } = loginResult
    const loginData = JSON.parse(data)

    const result = await server.inject({
      url: '/api/user/me',
      method: 'GET',
      headers: { authorization: `bearer ${loginData.data.token}` }
    })
    expect(result.statusCode).toBe(200)
    done()
  })
})
