import { Router } from 'express'
import usersModel from '../../dao/models/users.js'
import passport from 'passport'

const router = Router()

// Vista para registrar entrenadores
router.get('/register', async (req, res) => {
    res.render('sessions/register', {})
})

// Api para crear entrenadores
router.post('/create', passport.authenticate('register', 'errors/base'), async (req, res) => {
    try {
        res.redirect('/sessions/login')
    } catch (error) {
        res.status(500).send({ status: 'Server Error', message: error })
    }
})

// Vista de login
router.get('/login', async (req, res) => {
    res.render('sessions/login', {})
})

// Api de Login
router.post('/login', (req, res, next) => {
    /* look at the 2nd parameter to the below call */
    passport.authenticate('login', (err, user, info) => {
        if (err) { return next(err); }
        console.log(user);
        if (!user) { return res.redirect('/sessions/login'); }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.redirect('/products');
        });
    })(req, res, next);
});

// Api de Logout
router.get('/logout', async (req, res) => {
    req.session?.destroy(err => {
        if (err) {
            console.log(err)
            res.status(500).render('errors/base', { error: err })
        } else res.redirect('/sessions/login')
    })


})

export default router