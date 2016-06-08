import { validate } from 'email-validator'
import { hashSync } from 'bcrypt-nodejs'
import redis from '../redis/redis-client.js'

const createUser = function (email, username, password) {

  const usernameLower = username.toLowerCase()
  const validEmail = validate(email)

  return userExists(usernameLower, email).then(function (result) {
    const userKey = "user:" + usernameLower
    if (result === false && validEmail === true) {
      const hash = hashSync(password)
      if (hash) {
        const userObject = {
          email: email,
          username: usernameLower,
          password: hash
        }
        redis.hmset(userKey, userObject)
        return [200, userObject]
      } else {
        return [500, "Error when hashing password."]
      }
    } else {
      return [409, "User or email already in use."]
    }
  })

}

const userExists = function (username, email) {

  const usernameLower = username.toLowerCase()
  const userKey = "user:" + usernameLower

  return redis.hgetall(userKey).then(function (result) {
    const doesExist = (!!result.password && result.email === email.toLowerCase())
    return doesExist
  }).catch(function (e) {
    console.error("Error getting user key.")
    return true
  })

}

export { userExists, createUser }
