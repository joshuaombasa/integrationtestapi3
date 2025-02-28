const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Product = require('../models/product')
const helper = require('./test-helper')

const api = supertest(app)

beforeEach(async () => {
  await Product.deleteMany({})
  // Save all products concurrently for efficiency
  const productObjects = helper.productsList.map(product => new Product(product))
  await Promise.all(productObjects.map(product => product.save()))
})

describe('GET /api/products', () => {
  test('returns products as JSON', async () => {
    await api.get('/api/products')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns all products', async () => {
    const response = await api.get('/api/products')
    expect(response.body).toHaveLength(helper.productsList.length)
  })

  test('contains a specific product', async () => {
    const response = await api.get('/api/products')
    const titles = response.body.map(product => product.title)
    expect(titles).toContain(helper.productsList[0].title)
  })
})

describe('GET /api/products/:id', () => {
  test('succeeds with a valid id', async () => {
    const productsInDb = await helper.productsInDb()
    const productToView = productsInDb[0]
    const response = await api.get(`/api/products/${productToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    // Verify that the returned product data matches the expected product
    expect(response.body.title).toEqual(productToView.title)
    expect(response.body.price).toEqual(productToView.price)
  })

  test('fails with status code 404 for a non-existent id', async () => {
    const nonExistentId = await helper.nonExistentId()
    await api.get(`/api/products/${nonExistentId}`)
      .expect(404)
  })

  test('fails with status code 400 for an invalid id', async () => {
    await api.get('/api/products/invalid-id')
      .expect(400)
  })
})

describe('POST /api/products', () => {
  test('creates a new product with valid data', async () => {
    const newProduct = { title: 'New Product', price: 99 }
    await api.post('/api/products')
      .send(newProduct)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const productsAtEnd = await helper.productsInDb()
    expect(productsAtEnd).toHaveLength(helper.productsList.length + 1)

    const titles = productsAtEnd.map(p => p.title)
    expect(titles).toContain(newProduct.title)
  })

  test('fails with status code 400 if data is invalid', async () => {
    const invalidProduct = { price: 70 }  // Missing required 'title'
    await api.post('/api/products')
      .send(invalidProduct)
      .expect(400)

    const productsAtEnd = await helper.productsInDb()
    expect(productsAtEnd).toHaveLength(helper.productsList.length)
  })
})

describe('DELETE /api/products/:id', () => {
  test('succeeds in deleting a product', async () => {
    const productsInDb = await helper.productsInDb()
    const productToDelete = productsInDb[0]

    await api.delete(`/api/products/${productToDelete.id}`)
      .expect(204)

    const productsAtEnd = await helper.productsInDb()
    expect(productsAtEnd).toHaveLength(helper.productsList.length - 1)

    const titles = productsAtEnd.map(p => p.title)
    expect(titles).not.toContain(productToDelete.title)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
