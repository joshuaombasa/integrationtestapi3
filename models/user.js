const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()

    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.password
  }
})

module.exports = mongoose.model('User', userSchema)