const hello = (req, res) => {
  var name = req.params.name || "World"
  res.send('<title>Hello ' + name + '!</title>' + 'Hello ' + name + "!")
}

module.exports = hello
