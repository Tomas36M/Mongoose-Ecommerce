import { Router } from 'express'

const router = Router()

// Vista para registrar entrenadores
router.get('/', async (req, res) => {
    res.render('admin', {
        user: req.session.user
    })
})

export default router