import redis from '../redis/redis-client.js'
import generate from '../utils/auth.js'
import { validate } from 'email-validator'
import { hashSync, compareSync } from 'bcrypt-nodejs'
import { responseObject } from '../utils/objects.js'
import { RequestProcessingError } from '../utils/errors.js'

const createUser = (email, username, password) => {
  const usernameLower = username.toLowerCase()
  const validEmail = validate(email)

  return userEmailExists(usernameLower, email).then((result) => {
    const userKey = 'user:' + usernameLower
    if (result === false && validEmail === true) {
      const hash = hashSync(password)
      if (hash) {
        const authKey = generate(usernameLower)
        const authRedis = 'auth:' + authKey
        const userObject = {
          email: email,
          username: usernameLower,
          password: hash,
          authKey: authKey,
          following: JSON.stringify([]),
          followers: JSON.stringify([])
        }
        redis.set(authRedis, usernameLower)
        redis.hmset(userKey, userObject)
        return responseObject(200, userObject)
      } else {
        throw new RequestProcessingError(500, 'Error when hashing password.')
      }
    } else if (result === true) {
      throw new RequestProcessingError(409, 'User or email already in use.')
    } else if (validEmail === false) {
      throw new RequestProcessingError(422, 'Email is invalid.')
    } else {
      throw new RequestProcessingError(500, 'Database error.')
    }
  }).catch(e => responseObject(e.statusCode, e.message))
}

const authUser = (username, password) => {
  const usernameLower = username.toLowerCase()
  const userKey = 'user:' + usernameLower

  return redis.hgetall(userKey).then((result) => {
    if (result.username === usernameLower) {
      const passwordMatch = compareSync(password, result.password)
      if (passwordMatch === true) {
        const authKey = result.authKey
        const newAuthKey = generate(username)
        const authObject = {
          authKey: newAuthKey
        }
        if (authKey) {
          redis.del('auth:' + authKey)
        }
        redis.set('auth:' + newAuthKey, usernameLower)
        redis.hset(userKey, 'auth', newAuthKey)
        return responseObject(200, authObject)
      } else {
        return responseObject(401, 'Incorrect password')
      }
    } else {
      return responseObject(401, 'Username not found')
    }
  })
}

const userEmailExists = (username, email) => {
  console.log(username, email)
  const usernameLower = username.toLowerCase()
  const userKey = 'user:' + usernameLower

  return redis.hgetall(userKey).then((result) => {
    const doesExist = (!!result.password || result.email === email.toLowerCase())
    return doesExist
  }).catch(function (e) {
    console.error('Error getting user key.')
    return undefined
  })
}

const userExists = (user) => redis.hgetall('user:' + user.toLowerCase())
                                  .then((r) => !!r.password)

const userFromAuth = auth => redis.get('auth:' + auth)

export { userEmailExists, userExists, createUser, authUser, userFromAuth }
