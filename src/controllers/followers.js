import redis from 'ioredis'
import { userFromAuth, userExists } from 'users.js'
import { responseObject } from '../utils/objects.js'
import { RequestProcessingError } from '../utils/errors.js'

const follow = (userOrigin, userTarget, auth) => {
  const userOriginLower = userOrigin.toLowerCase()
  const userTargetLower = userTarget.toLowerCase()
  const userKey = 'user:' + userOriginLower
  const targKey = 'user:' + userTargetLower
  const originUserAuth = userFromAuth(auth).then((r) => r === userOriginLower)
  const userTargetExists = userExists(userTargetLower)

  Promise.all([originUserAuth, userTargetExists]).then((values) => {
    const authd = values[0]
    const exists = values[1]
    if (authd) {
      if (exists) {
        const following = redis.hget(userKey, 'following')
        const followers = redis.hget(targKey, 'followers')
        return Promise.all([following, followers])
      } else {
        throw new RequestProcessingError(404, 'User not found.')
      }
    } else {
      throw new RequestProcessingError(401, 'Failed to authenticate user')
    }
  })
  .then((results) => {
    const following = JSON.stringify(results[0])
    const followers = JSON.stringify(results[1])
    following.push(userTargetLower)
    followers.push(userOriginLower)
    redis.hset(userKey, 'following', following)
    redis.hset(targKey, 'followers', followers)
    return redis.hgetall(userKey)
  })
  .then(r => responseObject(200, r))
  .catch(e => responseObject(e.statusCode, e.message))
}

export { follow }
