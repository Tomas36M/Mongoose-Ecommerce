import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport';
import * as dotenv from 'dotenv'
import __dirname from './utils.js';
import adminViewRoute from './routes/session/admin-session-views.js';
import productRoute from './routes/products/products-route.js'
import cartRouter from './routes/carts/carts-route.js';
import messageRouter from './routes/messages/messages-route.js';
import messagesViewRouter from './routes/messages/messages-views-router.js';
import productViewRouter from './routes/products/product-views-route.js';
import cartViewRouter from './routes/carts/carts-view-route.js';
import sessionRouter from './routes/session/sessions-route.js';
import cookieParser from "cookie-parser";
import initializePassport from './config/passport.js';
import { passportCall } from "./utils.js"

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname + '/public'));
app.use(cookieParser(process.env.COOKIE_SECRET))

app.engine('hbs', handlebars.engine({
    extname: ".hbs",
    defaultLayout: 'main.hbs'
}));

app.set('views', __dirname + '/views');
app.set('partials', __dirname + '/partials');
app.set('view engine', 'hbs');

app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 300
    }),
    resave: true,
    secret: 'mangostino',
    saveUninitialized: true
}))
initializePassport()
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

const auth = (req, res, next) => {
    if(req.session?.user){  
        console.log(req.session.user);
        return next();
    }
    return res.status(401).render('errors/base', {error: 'No authenticado'});
}

const adminAuth = (req, res, next) => {
    if(req.session?.user && req.session?.user.rol == 'admin'){    
        return next();
    }
    return res.status(401).render('errors/base', {error: 'No autenticado o no eres administardor.'});
}


app.use('/sessions', sessionRouter)

app.use('/admin', adminAuth, adminViewRoute);
app.use('/api/products', productRoute);
app.use('/products', passportCall('jwt'), productViewRouter);
app.use('/api/carts', cartRouter);
app.use('/carts', auth, cartViewRouter)
app.use('/api/messages', messageRouter);
app.use('/messages', auth, messagesViewRouter);

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL, (err) => {
    if (err) {
        console.log('No se pudo conectar a la base de datos: ' + err);
        return
    }
    console.log('DB connected');
    app.listen(process.env.PORT, () => {
        console.log('Server running on port 8080');
    });
});