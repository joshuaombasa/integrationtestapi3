const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:', request.path)
  logger.info('Body:', request.body)
  logger.info('___')
  next()
}


const unknownEndpointHandler = (request, response, next) => {
  response.status(404).json({ errors: [{ message: 'uknown endpoint' }] })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.message === 'CastError') {
    return response.status(400).json({ errors: [{ message: '' }] })
  }

  if (error.message === 'ValidationError') {
    return response.status(400).json({ errors: [{ message: '' }] })
  }

  if (error.message === '') {
    return response.status(400).json({ errors: [{ message: '' }] })
  }
  response.status(400).json({ errors: [{ message: 'something went wrong' }] })

}


module.exports = { requestLogger, unknownEndpointHandler, errorHandler }