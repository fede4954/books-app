//Check if user is logged out when trying to access a page that requires it to be logged in
const isLoggedOut = (req, res, next) => {
    if (!req.session.loggedUser) {
        return res.redirect('/login')
    }
    next()
}

//Check if user is logged in when trying to access a page that requires it to be logged out
const isLoggedIn = (req, res, next) => {
    if (req.session.loggedUser) {
        return res.redirect('/')
    }
    next()
}

module.exports = {
    isLoggedIn,
    isLoggedOut
}