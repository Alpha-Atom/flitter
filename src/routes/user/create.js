import {createUser} from '../../controllers/users.js'

const create = (req, res) => {
  var uname = req.body.username
  var email = req.body.email
  var passw = req.body.password
  if (uname && email && passw) {
    createUser(email, uname, passw)
    .then((r) => res.status(r.statusCode).json(r.body))
  } else {
    res.status(400).send('Missing parameters')
  }
}

export default create
