import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import mongoose from 'mongoose';
import session from 'express-session'
import MongoStore from 'connect-mongo'

import adminViewRoute from './routes/session/admin-session-views.js';
import productRoute from './routes/products/products-route.js'
import cartRouter from './routes/carts/carts-route.js';
import messageRouter from './routes/messages/messages-route.js';
import messagesViewRouter from './routes/messages/messages-views-router.js';
import productViewRouter from './routes/products/product-views-route.js';
import cartViewRouter from './routes/carts/carts-view-route.js';
import sessionRouter from './routes/session/sessions-route.js';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname + '/public'));

app.engine('hbs', handlebars.engine({
    extname: ".hbs",
    defaultLayout: 'main.hbs'
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

const MONGO_URI = 'mongodb+srv://tomasmunevare:fgRiXYLWtYXXaiXm@cluster0.uwzu8jg.mongodb.net/?retryWrites=true&w=majority'

app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGO_URI,
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

const auth = (req, res, next) => {
    if(req.session?.user){    
        return next();
    }
    return res.status(401).render('errors/base', {error: 'No authenticado'});
}

const adminAuth = (req, res, next) => {
    if(req.session?.user && req.session?.user.rol == 'admin'){    
        return next();
    }
    return res.status(401).render('errors/base', {error: 'No authenticado o no eres administardor.'});
}


app.use('/sessions', sessionRouter)

app.use('/admin', adminAuth, adminViewRoute);
app.use('/api/products', productRoute);
app.use('/products', auth, productViewRouter);
app.use('/api/carts', cartRouter);
app.use('/carts', auth, cartViewRouter)
app.use('/api/messages', messageRouter);
app.use('/messages', auth, messagesViewRouter);

mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URI, (err) => {
    if (err) {
        console.log('No se pudo conectar a la base de datos: ' + err);
        return
    }
    console.log('DB connected');
    app.listen(8080, () => {
        console.log('Server running on port 8080');
    });
});