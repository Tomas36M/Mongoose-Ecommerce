import passport from "passport";
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import userModel from "../dao/models/users.js";
import { createHash, isValidPassoword } from '../utils.js';

const LocalStrategy = local.Strategy;

passport.use('github', new GitHubStrategy(
    {
        clientID: 'Iv1.f98c63403e98b51d',
        clientSecret: 'dc40c239b0471ed5e62678037d79130b5a34e28d',
        callbackURL: "http://localhost:8080/session/auth/github/callback"
    },
    async (accessToken, refreshToken, profile, done) => {

        console.log(profile);

        try {
            const user = await userModel.findOne({ email: profile._json.email })
            if (user) {
                console.log('User already exits');
                return done(null, user)
            }

            const newUser = {
                name: profile._json.name,
                email: profile._json.email,
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
            const { name, email } = req.body
            try {
                const user = await userModel.findOne({ email: username })
                console.log(user);
                if (user) {
                    console.log('User already exits');
                    return done(null, false)
                }

                const newUser = {
                    name,
                    email,
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

    passport.serializeUser((user, done) => {
        done(null, user._id)
    });
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    });

}

export default initializePassport;