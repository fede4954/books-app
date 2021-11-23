const router = require('express').Router()


//MIDDLEWARE
const { isLoggedOut } = require('../middleware/route-guard.js') //Pass the middleware to the route we want to use it on


//MODELS
const User = require('../models/User.model.js')


//ROUTES
router.get('/profile', isLoggedOut, (req, res) => {
    const { username } = req.session.loggedUser //Pass the username of the logged in user
    res.render('./profile.hbs', { username })
})

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).populate('books') //Makes books the array of books instead of books' IDs
    const { books } = user //=> const books = user.books
    res.render('./user.hbs', { user, books })
})

module.exports = router