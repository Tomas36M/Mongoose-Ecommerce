import { Router } from 'express'
import passport from 'passport'

const router = Router()

router.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] }));

router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),
    async (req, res) => {
        console.log("Callback: ", req.user);
        req.session.user = req.user
        res.redirect('/products')
    }
)

// Vista de login
router.get('/login', async (req, res) => {
    res.render('sessions/login', {})
})

router.get('/faillogin', (req, res) => {
    res.render('errors/base', { error: 'Error En las credenciales' })
})

// Api de Login
router.post('/login', passport.authenticate('login', {
    failureFlash: true,
    failureRedirect: '/sessions/faillogin'
}), async (req, res) => {
    if (!req.user) {
        return res.render('/errors/base', { error: 'Error en las credenciales' })
    }
    req.session.user = req.user;
    req.session.user.rol = req.user.rol
    console.log(req.user);
    res.redirect('/products')
});

// Vista para registrar entrenadores
router.get('/register', async (req, res) => {
    res.render('sessions/register', {})
})

// Api para crear entrenadores
router.post('/create', passport.authenticate('register', {
    failureRedirect: '/sessions/faillogin'
}), async (req, res) => {
    try {
        res.redirect('/sessions/login')
    } catch (error) {
        res.status(500).send({ status: 'Server Error', message: error })
    }
})

// Api de Logout
router.get('/logout', async (req, res) => {
    req.session?.destroy(err => {
        if (err) {
            console.log(err)
            res.status(500).render('/errors/base', { error: err })
        } else res.redirect('/sessions/login')
    })
})

export default router