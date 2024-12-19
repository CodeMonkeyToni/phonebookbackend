const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

function numberValidator(number) {
  if (!number.includes("-")) {
    return false
  }
  const parts = number.split("-")
  if (!(parts[0].length === 2 || parts[0].length === 3)) {
    return false
  }
  return true
}

const custom = [numberValidator, "Number must contain '-'. Before it there must be 2 or 3 numbers."]

const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minlength: 3,
      required: true
    },
    number: {
      type: String,
      minlength: 8,
      required: true,
      validate: custom
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)