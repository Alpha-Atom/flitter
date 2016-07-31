import redis from '../redis/redis-client.js'
import uuid from 'node-uuid'
import { userFromAuth } from './users.js'
import { responseObject } from '../utils/objects.js'
import { RequestProcessingError } from '../utils/errors.js'

const postUpdate = (username, auth, messageContent) => {
  const usernameLower = username.toLowerCase()

  return userFromAuth(auth).then((expectedUsername) => {
    if (expectedUsername === usernameLower) {
      if (messageContent.length <= 140) {
        const currentTime = Date.now()
        const postKey = 'update:' + usernameLower + ':' + currentTime
        const postObject = {
          postId: uuid.v4(),
          username: usernameLower,
          time: currentTime,
          message: messageContent
        }
        redis.hmset(postKey, postObject)
        return postObject
      } else {
        throw new RequestProcessingError(413, 'The post was too long')
      }
    } else {
      throw new RequestProcessingError(401, 'Failed to authenticate user')
    }
  }).catch(e => responseObject(e.statusCode, e.message))
}

export { postUpdate }
