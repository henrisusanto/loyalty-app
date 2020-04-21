import { Service, BasicService } from 'fastro'
import { UserToken } from './token.entity'
import { DeleteResult } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

@Service()
export class TokenService extends BasicService {
  public async generateToken (userId: string): Promise<UserToken> {
    try {
      const token = uuidv4()
      const tokenToUpdate = await this.repo(UserToken).findOne({ where: { userId } })
      if (tokenToUpdate) {
        tokenToUpdate.token = token
        return this.repo(UserToken).save(tokenToUpdate)
      }
      const userToken = new UserToken()
      userToken.userId = userId
      userToken.token = token
      return this.repo(UserToken).save(userToken)
    } catch (error) {
      throw this.err('GENERATE_TOKEN_ERROR', error)
    }
  }

  public async getToken (token: string): Promise<UserToken|undefined> {
    try {
      const userToken = this.repo(UserToken).findOne({
        select: ['token', 'userId'],
        where: { token }
      })
      return userToken
    } catch (error) {
      throw this.err('GET_TOKEN_ERROR', error)
    }
  }

  public async deleteAll (): Promise<DeleteResult|undefined> {
    try {
      return this.repo(UserToken).delete({})
    } catch (error) {
      throw this.err('DELETE_ALL_TOKEN_ERROR', error)
    }
  }
}
