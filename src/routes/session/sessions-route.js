import { Router } from 'express'
import usersModel from '../../dao/models/users.js'
import passport from 'passport'

const router = Router()

// Vista para registrar entrenadores
router.get('/register', async (req, res) => {
    res.render('sessions/register', {})
})

// Api para crear entrenadores
router.post('/create', passport.authenticate('register', {failureRedirect: 'errors/base'}), async (req, res) => {
    try {
        res.redirect('/sessions/login')
    } catch (error) {
        res.status(500).send({status: 'Server Error', message: error})
    }
})

// Vista de login
router.get('/login', async (req, res) => {
    res.render('sessions/login', {})
})

// Api de Login
router.post('/login', passport.authenticate('login', '/errors/base'), async (req, res) => {

    if (!user) {
        return res.status(401).render('errors/base', { error: 'Error en las credenciales.' })
    }
    req.session.user = user;
    req.session.user.rol = (user.rol == 'admin') ? 'admin' : 'usuario'
    res.redirect('/products')
})

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