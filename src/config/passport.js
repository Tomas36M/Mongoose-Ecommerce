import passport from "passport";
import local from 'passport-local'
import jwt from 'passport-jwt'
import GitHubStrategy from 'passport-github2'
import userModel from "../dao/models/users.js";
import cartModel from '../dao/models/carts-model.js'
import { createHash, isValidPassoword, generateToken, extractCookie } from '../utils.js';

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt


passport.use('github', new GitHubStrategy(
    {
        clientID: 'Iv1.f98c63403e98b51d',
        clientSecret: 'dc40c239b0471ed5e62678037d79130b5a34e28d',
        callbackURL: "http://localhost:8080/sessions/auth/github/callback"
    },
    async (accessToken, refreshToken, profile, done) => {

        try {
            const user = await userModel.findOne({ email: profile._json.login.toLowerCase() + '@gmail.com' })
            if (user) {
                console.log('User already exits');
                return done(null, user)
            }

            const cartId = await cartModel.create({});

            const name = await profile._json.name.split(' ');

            console.log(name);

            const newUser = {
                first_name: name[0],
                last_name: name[1],
                email: profile._json.login.toLowerCase() + '@gmail.com',
                cart_id: cartId._id.toString(),
                password: ''
            }

            const result = await userModel.create(newUser)

            return done(null, result)
        } catch (error) {
            return done('error to login with github' + error)
        }
    }
))


const initializePassport = () => {

    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true, usernameField: 'email'
        },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body
            try {
                const user = await userModel.findOne({ email: username })
                if (user) {
                    console.log('User already exits');
                    return done(null, false)
                }

                const cartId = await cartModel.create({});

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age: age,
                    cart_id: cartId._id.toString(),
                    password: createHash(password)
                }
                const result = await userModel.create(newUser)
                return done(null, result)
            } catch (error) {
                return done("Error to register " + error)
            }
        }
    ));

    passport.use('login', new LocalStrategy(
        {
            usernameField: 'email',
        },
        async (username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username }).lean().exec();
                if (!user) {
                    return done(null, false)
                }
                if (!isValidPassoword(user, password)) return done(null, false)
                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([extractCookie]),
        secretOrKey: process.env.JWT_PRIVATE_KEY
    }, async (jwt_payload, done) => {
        done(null, jwt_payload)
    }))


    passport.serializeUser((user, done) => {
        done(null, user._id)
    });
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    });

}

export default initializePassport;