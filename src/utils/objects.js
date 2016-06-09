import { ResponseObjectCreationError } from '../utils/errors.js'

const responseObject = (statusCode, body) => {
  if (Object.prototype.toString.call(body) === '[object Object]') {
    return {
      statusCode: statusCode,
      body: body
    }
  } else if (typeof body === 'string') {
    return {
      statusCode: statusCode,
      body: {
        error: body
      }
    }
  } else {
    throw new ResponseObjectCreationError()
  }
}

export { responseObject }
