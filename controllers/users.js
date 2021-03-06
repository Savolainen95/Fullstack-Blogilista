const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const body = request.body
  const pass = body.password

  if (body.password.length < 3) {
    response.status(400).send({
      error: `User validation failed: username: Path \`password\` (\`${pass}\`) is shorter than the minimum allowed length (3).`
    })
  } else {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })
    const savedUser = await user.save()
    response.json(savedUser)
  }
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { title: 1, name: 1, url: 1, likes: 1 })
  response.json(users.map(u => u.toJSON()))
})


module.exports = usersRouter