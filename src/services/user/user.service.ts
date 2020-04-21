import { Service, BasicService, InjectService } from 'fastro'
import { User } from './user.entity'
import { TokenService } from '../token/token.service'
import { DeleteResult } from 'typeorm'

type LogiResult = {
  token: string;
  user: {
    userId: string;
    username: string;
    email: string;
  };
}

@Service()
export class UserService extends BasicService {
  @InjectService(TokenService)
  tokenService: TokenService

  hi (): string {
    return 'hi'
  }

  public async register (payload: User): Promise<User> {
    try {
      let user = new User()
      if (!payload.username) throw new Error('Username empty')
      if (!payload.email) throw new Error('Email empty')
      if (!payload.password) throw new Error('Password empty')
      user.email = payload.email
      user.username = payload.username
      user.password = payload.password
      user = await this.repo(User).save(user)
      return Promise.resolve(user)
    } catch (error) {
      throw this.err('USER_REGISTER_ERROR', error)
    }
  }

  public async login (payload: { username: string; email: string; password: string }): Promise<LogiResult|undefined> {
    try {
      let token = ''
      const { username, email, password } = payload
      const user = await this.repo(User).findOne({
        where: [
          { username, password },
          { email, password }
        ]
      })
      if (!user) throw new Error('Username or email and password not found')
      if (user.id && user.username) {
        const result = await this.tokenService.generateToken(user.id)
        if (result.token) token = result.token
        return {
          token,
          user: {
            userId: user.id,
            username: user.username,
            email: user.email
          }
        }
      }
    } catch (error) {
      throw this.err('LOGIN_ERROR', error)
    }
  }

  public async getAllUser (): Promise<User[]> {
    try {
      return this.repo(User).find({
        select: ['id', 'username', 'email']
      })
    } catch (error) {
      throw this.err('GET_ALL_USER_ERROR', error)
    }
  }

  public async getUserById (userId: string): Promise<LogiResult|undefined> {
    try {
      let token = ''
      const user = await this.repo(User).findOne({
        where: { id: userId }
      })
      if (!user) throw new Error('Username or email and password not found')
      if (user.id && user.username) {
        const result = await this.tokenService.generateToken(user.id)
        if (result.token) token = result.token
        return {
          token,
          user: {
            userId: user.id,
            username: user.username,
            email: user.email
          }
        }
      }
    } catch (error) {
      throw this.err('GET_USER_BY_ID_ERROR', error)
    }
  }

  public async deleteAll (): Promise<DeleteResult|undefined> {
    try {
      return this.repo(User).delete({})
    } catch (error) {
      throw this.err('DELETE_ALL_USER_ERROR', error)
    }
  }
}
