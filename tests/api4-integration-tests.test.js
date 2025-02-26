const mongoose = require('mongoose')
const Product = require('../models/product')
const helper = require('./test-helper')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)

beforeEach(async () => {
  await Product.deleteMany({})

  for (let product of helper.productsList) {
    const productObject = new Product(product)
    await productObject.save()
  }
})


describe('when there are initially some products', () => {
  test('products are returned as JSON', async () => {
    await api.get('/api/products')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all products are returned', async () => {
    const response = await api.get('/api/products')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(helper.productsList.length)
  })

  test('a specific product is among the products that are returned', async () => {
    const response = await api.get('/api/products')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const titles = response.body.map(t => t.title)
    expect(titles).toContain(helper.productsList[0].title)
  })
})

describe('fetching a single product', () => {
  test('succeeds when given a valid id', async () => {
    const productsInDb = await helper.productsInDb()
    const response = await api.get(`/api/products/${productsInDb[0].id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('fails with statuscode 404 when given a non-existent id', async () => {
    const nonExistentId = await helper.nonExistentId()
    const response = await api.get(`/api/products/${nonExistentId}`)
      .expect(404)
  })

  test('fails with statuscode 400 when given a invalid id', async () => {
    const response = await api.get('/api/products/&*')
      .expect(400)
  })
})

describe('addition of a new product', () => {
  test('succeeds when given valid data', async () => {
    const productsInDbAtStart = await helper.productsInDb()
    const response = await api.post('/api/products')
      .send({ title: 'product7', price: 70 })
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const productsInDbAtEnd = await helper.productsInDb()
    expect(productsInDbAtStart).toHaveLength(productsInDbAtEnd.length - 1)
  })

  test('faild with statuscode 400 when given valid data', async () => {
    const productsInDbAtStart = await helper.productsInDb()
    const response = await api.post('/api/products')
      .send({ price: 70 })
      .expect(400)
    const productsInDbAtEnd = await helper.productsInDb()
    expect(productsInDbAtStart).toHaveLength(productsInDbAtEnd.length)
  })
})

describe('deleting a product', () => {
  test('succeeds when given a valid id', async () => {
    const productsInDb = await helper.productsInDb()
    await api.delete(`/api/products/${productsInDb[0].id}`)
      .expect(204)
  })
})


afterAll(async () => {
  await mongoose.connection.close()
})
