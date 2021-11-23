const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    books: [{ type: Schema.Types.ObjectId, ref: 'Book' }] //Array of IDs of the books tied to this user
  }, { timestamps: true }
)

const User = model('User', userSchema)

module.exports = User
