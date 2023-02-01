import passport from "passport";
import local from 'passport-local'
import userModel from "../dao/models/users.js";
import { createHash, isValidPassoword } from '../utils.js';

const LocalStrategy = local.Strategy;


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

    // passport.use('login', new LocalStrategy(
    //     async (username, password, done) => {
    //         /* see done being invoked with different paramters
    //            according to different situations */
    //         console.log(username);
    //         await userModel.findOne({ email: username }, function (err, user) {
    //             if (err) { return done(err); }
    //             if (!user) { return done(null, false); }
    //             if (!isValidPassoword(user, password)) return done(null, false)
    //             return done(null, user);
    //         });
    //     }
    // ));

    passport.use('login', new LocalStrategy(
        async (username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username }).lean().exec()

                if (!user) {
                    console.error('User donst exist');
                    return done(null, false)
                }

                if (!isValidPassoword(user, password)) return done(null, false)
                else {
                    console.log('Te has logeado');
                    return done(null, user)
                }
            } catch (error) {
                return done(error)
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id)
    });
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    });

}

export default initializePassport;