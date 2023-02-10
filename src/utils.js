import {fileURLToPath } from 'url'
import {dirname} from 'path'
import passport from 'passport'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassoword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}

export const generateToken = user => {
    const token = jwt.sign({user}, process.env.JWT_PRIVATE_KEY, {expiresIn: '24h'})
    return token
}

export const authToken = (req, res, next) => {
    const authToken = req.cookies.cookieToken
    console.log(authToken);

    if(!authToken) return res.status(401).render('errors/base', {error: 'No aAuth'})
    jwt.verify(token, process.env.JWT_PRIVATE_KEY, (error, credentials) => {
        if(error) return res.status(403).render('errors/base', {error: 'No authorized'})
        req.user = credentials.user
        next()
    })
}

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function(err, user, info) {
            if(err) return next(err)
            if(!user) return res.status(401).render('errors/base', {error: info.messages ? info.messages : info.toString()})

            req.user = user
            next()
        })(req, res, next)
    }
}

export const extractCookie = req => {
    return (req && req.cookies) ? req.cookies[process.env.COOKIE_NAME_JWT] : null
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname

