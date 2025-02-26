const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const { requestLogger, unknownEndpointHandler, errorHandler } = require('./utils/middleware')
const productsRouter = require('./controllers/products')
const usersRouter = require('./controllers/users')
const logger = require('./utils/logger')

const app = express()

mongoose.connect(config.MONGO_URI)
  .then(() => logger.info('connected to mongodb'))
  .catch(error => logger.error(error))

app.use(express.json())
app.use(cors())

app.use(requestLogger)

app.use('/api/products', productsRouter)
app.use('/api/users', usersRouter)

app.use(unknownEndpointHandler)
app.use(errorHandler)

module.exports = app

