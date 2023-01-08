import fs from 'fs';

class CartManager {

    constructor(path) {
        this.path = path
    }

    writeFile = async (id) => {
        const newCart = { id: id, products: [] }
        await fs.promises.writeFile(this.path, JSON.stringify([newCart], null, 2))
    }

    addCart = async (id) => {

        if (fs.existsSync(this.path)) {

            const content = await fs.promises.readFile(this.path, 'utf-8');

            if (!content) return this.writeFile(id);

            const carts = JSON.parse(content);

            carts.push({ id })

            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));

        } else {
            this.writeFile(id);
        }

    }

    getCartProducts = async (id) => {

        if (fs.existsSync(this.path)) {

            const content = await fs.promises.readFile(this.path, 'utf-8');

            if (!content) return 'No hay nada dentro del archivo'

            const carts = JSON.parse(content);

            if (carts.length == 0) return 'No hay carritos disponibles';

            const cart = carts.find(el => el.id == id);

            return cart
            
        } else {
            return 'El archivo no existe'
        }
    }

    addProductToCart = async (cid, pid) => {

        const content = await fs.promises.readFile(this.path, 'utf-8');

        if (!content) return 'No hay nada dentro del arhivo'

        const carts = JSON.parse(content);

        if (carts.length == 0) return 'No hay carritos disponibles'

        const cart = carts.find(el => el.id == cid);
        const product = cart.products.find(el => el.product == pid);
        const index = cart.products.map(e => e.product).indexOf(pid);

        if (product) {
            product.quantity++
        } else {
            cart.products.push({ product: pid, quantity: 1 });
            carts.splice(index, 1, cart);
        }
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));

    }
}

export default CartManager