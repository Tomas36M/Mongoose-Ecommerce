import { Router } from 'express'

const router = Router()

// Vista para registrar entrenadores
router.get('/current', async (req, res) => {
    res.render('user', {
        user: {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            rol: req.user.rol,
        },
        rol: req.session.user.rol === 'admin'
    })
})

export default router