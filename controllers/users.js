const express = require('express')
const usersRouter = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = import('bcrypt')

const User = require('../models/user')

usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({})
    response.send(users)
  } catch (error) {
    next(error)
  }
})


usersRouter.get('/:id', async (request, response, next) => {
  try {
    const user = await User.findById(request.params.id)

    if (!user) {
      return response.sendStatus(404)
    }
    response.send(user)
  } catch (error) {
    next(error)
  }
})

usersRouter.post('/', async (request, response, next) => {
  const { name, password } = request.body
  const passwordHash = await bcrypt.hash(password, 10)
  try {
    const userObject = new User({ name, password: passwordHash })
    const savedUser = await userObject.save()
    response.status(201).send(savedUser)
  } catch (error) {
    next(error)
  }
})

usersRouter.put('/:id', async (request, response, next) => {
  const { name, password } = request.body
  try {
    const updatedUser = await User.findByIdAndUpdate(
      request.params.id,
      { name, password },
      { new: true }
    )
    response.status(200).send(updatedUser)
  } catch (error) {
    next(error)
  }
})

usersRouter.delete('/:id', async (request, response, next) => {
  try {
    await User.findByIdAndDelete(request.params.id)
    response.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter