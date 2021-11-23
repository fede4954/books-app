const router = require('express').Router()
const bcrypt = require('bcryptjs')


//MIDDLEWARE
const { isLoggedIn } = require('../middleware/route-guard')


//MODELS
const User = require('../models/User.model.js')


//ROUTES
//Signup
router.get('/signup', isLoggedIn, (req, res) => { //Prevent user from signing up if he's logged in
    res.render('./createUser.hbs')
})

router.post('/signup', async (req, res) => {
    const { username, password } = req.body //=>req.body.username, req.body.password
    try {
        //Encrypt user password asynchronously
        const hashedPassword = await bcrypt.hash(password, 10)
        const createdUser = await User.create({ username, password: hashedPassword })
        res.render('createUser.hbs', { justCreatedUser: createdUser.username }) //Pass the username to display a succesfully created message
    }
    catch (err) {
        console.log('Error creating user:', err)
    }

})

router.get('/login', isLoggedIn, (req, res) => { //Also prevent from logging in
    res.render('./login.hbs')
})


//Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body

    //Check if all fields are filled
    if (!username || !password) {
        res.render('./login.hbs', { errorMsg: 'You need to fill all fields' })
    }

    //Check if the input user exists
    const userFromDB = await User.findOne({ username })
    if (!userFromDB) {
        res.render('./login.hbs', { errorMsg: 'User does not exist' })
    }
    else {
        const passwordCheck = await bcrypt.compare(password, userFromDB.password) //Input goes first
        if (!passwordCheck) {
            res.render('./login.hbs', { errorMsg: 'Incorrect password' })
        }
        else {
            //User logged in succesfully
            req.session.loggedUser = userFromDB
            // console.log('SESSION ======> ', req.session)
            res.redirect('/users/profile')
        }
    }
})

router.post('/logout', async (req, res, next) => {
    //Clear cookie
    res.clearCookie('connect.sid', { path: '/', })

    //Destroy session
    try {
        await req.session.destroy()
        res.redirect('/')
    }
    catch (err) {
        next(err)
    }
})

module.exports = router