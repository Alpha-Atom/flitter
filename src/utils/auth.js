import { hashSync } from 'bcrypt-nodejs'

const generate = (username) => {
  const obfuscator = (Math.random() + 1).toString(36).substring(7)
  return hashSync(Date.now().toString() + username + obfuscator)
}

export default generate
