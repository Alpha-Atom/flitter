import redis from '../redis/redis-client.js'
import { userFromAuth } from 'users.js'
import { responseObject } from '../utils/objects.js'
import { InvalidAuthenticationKeyError, PostTooLongError } from '../utils/errors.js'

const postUpdate = (username, auth, messageContent) => {
  const usernameLower = username.toLowerCase()

  return userFromAuth(auth).then((expectedUsername) => {
    if (expectedUsername === usernameLower) {
      if (messageContent.length <= 140) {
        const currentTime = Date.now()
        const postKey = 'update:' + usernameLower + ':' + currentTime
        const postObject = {
          username: usernameLower,
          time: currentTime,
          message: messageContent
        }
        redis.hmset(postKey, postObject)
      } else {
        throw new PostTooLongError()
      }
    } else {
      throw new InvalidAuthenticationKeyError()
    }
  }).catch(e => responseObject(e.statusCode, e.message))
}

export { postUpdate }
