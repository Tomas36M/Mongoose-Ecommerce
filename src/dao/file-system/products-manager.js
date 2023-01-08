import fs from 'fs';

class ProductManager {

    constructor(path) {
        this.path = path
    }

    writeFile = async (id, title, description, price, thumbnails, code, category, stock) => {

        const newProduct = {
            id,
            title,
            description,
            price,
            thumbnails: thumbnails ? [...thumbnails] : [],
            code,
            status: true,
            category,
            stock
        }
        await fs.promises.writeFile(this.path, JSON.stringify([newProduct], null, 2))
    }

    getProducts = async (limit) => {

        if (fs.existsSync(this.path)) {

            const content = await fs.promises.readFile(this.path, 'utf-8');

            if (!content) return 'No hay nada en el archivo, agregar un producto nuevo.';

            const products = JSON.parse(content);

            if (products.length == 0) return 'No hay productos en la lista, agregar un producto nuevo.';

            return products.slice(0, limit);

        } else {
            return 'El archivo no existe';
        }
    }

    getProductById = async (id) => {

        if (fs.existsSync(this.path)) {

            const content = await fs.promises.readFile(this.path, 'utf-8');

            if (!content) return 'No hay nada en el archivo, agregar un producto nuevo.';

            const products = JSON.parse(content);

            if (products.length == 0) return 'No hay productos en la lista, agregar un producto nuevo.';

            const idCheck = products.find(el => el.id == id);

            return idCheck

        } else {
            return console.log('El archivo no existe');
        }
    }

    addProduct = async (id, title, description, price, thumbnails, code, category, stock) => {

        if (fs.existsSync(this.path)) {

            const content = await fs.promises.readFile(this.path, 'utf-8');

            if (!content) return this.writeFile(id, title, description, price, thumbnails, code, category, stock);

            const products = JSON.parse(content);

            products.push({
                id,
                title,
                description,
                price,
                thumbnails: thumbnails ? [...thumbnails] : [],
                code,
                status: true,
                category,
                stock
            });

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));

        } else {
            this.writeFile(id, title, description, price, thumbnails, code, category, stock);
        }
    }

    updateProduct = async (id, updateValues) => {

        if (fs.existsSync(this.path)) {

            const content = await fs.promises.readFile(this.path, 'utf-8');

            if (!content) return 'No hay nada en el archivo, agregar un producto nuevo.';

            const products = JSON.parse(content);

            if (products.length == 0) return 'No hay productos en la lista, agregar un producto nuevo.';

            const changingObj = products.find(el => el.id == id);

            const updatedObj = { ...changingObj, ...updateValues };

            const index = products.map(e => e.id).indexOf(id);

            products.splice(index, 1, updatedObj);

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2))

            return 'Se ha actualizado el producto';
            
        } else {
            return 'El archivo no existe';
        }
    }

    deleteProduct = async (id) => {

        if (fs.existsSync(this.path)) {

            const content = await fs.promises.readFile(this.path, 'utf-8');

            if (!content) return 'No hay nada en el archivo, agregar un producto nuevo.';

            const products = JSON.parse(content);

            if (products.length == 0) return 'No hay productos en la lista, agregar un producto nuevo.';

            const indexDeletedObj = products.map(e => e.id).indexOf(id);

            products.splice(indexDeletedObj, 1)

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2))

            return 'Se ha eliminado el producto de la lista'

        } else {
            return 'El archivo no existe'
        }
    }
}

export default ProductManager