const express = require('express')
const productsRouter = express.Router()
const jwt =  require('jsonwebtoken')
const bcrypt = require('bcrypt')

const Product = require('../models/product')

productsRouter.get('/', async (request, response, next) => {
  try {
    const products = await Product.find({})
    response.send(products)
  } catch (error) {
    next(error)
  }
})


productsRouter.get('/:id', async (request, response, next) => {
  try {
    const product = await Product.findById(request.params.id)

    if (!product) {
      return response.sendStatus(404)
    }
    response.send(product)
  } catch (error) {
    next(error)
  }
})

productsRouter.post('/', async (request, response, next) => {
  const { title, price } = request.body
  try {
    const productObject = new Product({ title, price })
    const savedProdcut = await productObject.save()
    response.status(201).send(savedProdcut)
  } catch (error) {
    next(error)
  }
})

productsRouter.put('/:id', async (request, response, next) => {
  const { title, price } = request.body
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      request.params.id,
      { title, price },
      { new: true }
    )
    response.status(200).send(updatedProduct)
  } catch (error) {
    next(error)
  }
})

productsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Product.findByIdAndDelete(request.params.id)
    response.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

module.exports = productsRouter