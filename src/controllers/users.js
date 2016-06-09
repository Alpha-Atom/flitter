import { validate } from 'email-validator'
import { hashSync, compareSync } from 'bcrypt-nodejs'
import { responseObject } from '../utils/objects.js'
import redis from '../redis/redis-client.js'
import generate from '../utils/auth.js'

const createUser = (email, username, password) => {
  const usernameLower = username.toLowerCase()
  const validEmail = validate(email)

  return userExists(usernameLower, email).then(function (result) {
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
          authKey: authKey
        }
        redis.set(authRedis, usernameLower)
        redis.hmset(userKey, userObject)
        return responseObject(200, userObject)
      } else {
        return responseObject(500, 'Error when hashing password.')
      }
    } else if (result === true) {
      return responseObject(409, 'User or email already in use.')
    } else if (validEmail === false) {
      return responseObject(422, 'Email is invalid.')
    } else {
      return responseObject(500, 'Database error.')
    }
  })
}

const authUser = (username, password) => {
  const usernameLower = username.toLowerCase()
  const userKey = 'user:' + usernameLower

  return redis.hgetall(userKey).then(function (result) {
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

const userExists = (username, email) => {
  const usernameLower = username.toLowerCase()
  const userKey = 'user:' + usernameLower

  return redis.hgetall(userKey).then(function (result) {
    const doesExist = (!!result.password && result.email === email.toLowerCase())
    return doesExist
  }).catch(function (e) {
    console.error('Error getting user key.')
    return undefined
  })
}

const userFromAuth = auth => redis.get('auth:' + auth)

export { userExists, createUser, authUser, userFromAuth }
