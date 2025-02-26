const Product = require('../models/product')

const productsList = [
  {
    title: 'product1',
    price: 10
  },
  {
    title: 'product2',
    price: 20
  },
  {
    title: 'product3',
    price: 30
  },
  {
    title: 'product4',
    price: 40
  },
  {
    title: 'product5',
    price: 50
  },
]

const productsInDb = async () => {
  const products = await Product.find({})
  return products.map(product => product.toJSON())
}

const nonExistentId = async () => {
  const productObject = new Product({
    title: 'product16',
    price: 60
  })
  const savedObject = await productObject.save()
  await Product.findByIdAndDelete(savedObject._id)
  return savedObject.id
}

module.exports = { productsList, productsInDb, nonExistentId }