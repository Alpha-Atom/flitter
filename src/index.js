import express from 'express'
import router from './routes/router.js'
import faker from 'faker'
import { createUser } from './controllers/users.js'
import { postUpdate } from './controllers/updates.js'
import bodyParser from 'body-parser'

const app = express()

const getData = () => {
  return {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    pass: faker.name.lastName()
  }
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
})

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use('/', router)

app.listen(3000, () => console.log('Listening on port 3000.'))

for (let i = 0; i <= 100; i++) {
  createUser(getData().email, getData().name, getData().pass)
  .then((result) => postUpdate(result.body.username, result.body.authKey, 'This is an update.'))
  .then(console.log)
}

process.on('SIGINT', () => process.exit(0))
