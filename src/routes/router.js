import express from 'express'
import hello   from './misc/hello.js'

const router = express.Router()

router.get("/hello/(:name)?", hello)

export default router
