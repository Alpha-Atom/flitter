import express from 'express'
import hello from './misc/hello.js'
import create from './user/create.js'

const router = express.Router()

router.get('/hello/(:name)?', hello)
router.post('/user/create/', create)

export default router
