const router = require('express').Router()


//MODELS
const Book = require('../models/Book.model')
const User = require('../models/User.model')


//ROUTES
//Create book page
router.get('/create', (req, res) => {
    res.render('./createBook.hbs')
})

//Create a new book
router.post('/create', async (req, res) => {
    const { username, name, author, price } = req.body

    //Verify if user exists before creating book
    try {
        const userFromDB = await User.findOne({ username })
        if (userFromDB) { //Check if the user exists
            const createdBook = await Book.create({ name, author, price })
            //Push book id to the user's book id array
            const updatedUser = await User.findByIdAndUpdate(userFromDB._id, { $push: { books: createdBook._id } }, { new: true }) //new:true returns the user after it's updated
            // console.log(updatedUser)
            res.redirect(`/users/${updatedUser._id}`)
        }
        else {
            res.render('./createBooks.hbs', { errorMsg: 'This user doesn\'t exist' })
        }
    }
    catch (err) {
        console.log('Error checking if user exists:', err)
    }
})

module.exports = router