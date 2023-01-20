import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import mongoose from 'mongoose';
import { Server as HttpServer } from 'http'
import { Server as IOServer } from 'socket.io'
import productRoute from './routes/products-route.js'
import cartRouter from './routes/carts-route.js';
import messageRouter from './routes/messages-route.js';
import messagesViewRouter from './routes/messages-views-router.js';
import productViewRouter from './routes/product-views-route.js';
import cartViewRouter from './routes/carts-view-route.js';

import productModel from './dao/models/products-model.js';
import messageModel from './dao/models/messeges-model.js';
import ProductManager from './dao/file-system/products-manager.js';

const app = express();
const manager = new ProductManager('./src/dao/file-system/data/products.json')

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.set("io", io);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname + '/public'));

app.engine('hbs', handlebars.engine({
    extname: ".hbs",
    defaultLayout: 'main.hbs'
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.use('/api/products', productRoute);
app.use('/products', productViewRouter);
app.use('/api/carts', cartRouter);
app.use('/api/messages', messageRouter);
app.use('/messages', messagesViewRouter);
app.use('/carts', cartViewRouter)


mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://tomasmunevare:fgRiXYLWtYXXaiXm@cluster0.uwzu8jg.mongodb.net/?retryWrites=true&w=majority', (err) => {
    if (err) {
        console.log('No se pudo conectar a la base de datos: ' + err);
        return
    }
    console.log('DB connected');
    httpServer.listen(8080, () => {
        console.log('Server running on port 8080');
    });
});

io.on('connection', async socket => {
    console.log(`New client connected, id: ${socket.id}`);

    const products = await productModel.find();
    const messages = await messageModel.find();

    io.sockets.emit("products", products);
    io.sockets.emit("messages", messages);

    socket.on("addProduct", async (product) => {
        try {
            await productModel.create(product);
            await manager.addProduct(product);
            io.sockets.emit("products", products);
        } catch (error) {
            console.log(error);
        }
    });
    socket.on("message", async (message) => {
        try {
            await messageModel.create(message);
            io.sockets.emit("messages", messages);
        } catch (error) {
            console.log(error);
        }
    });
})