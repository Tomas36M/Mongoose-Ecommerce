import { Router } from "express";
import productModel from "../../dao/models/products-model.js";
import cartsModel from "../../dao/models/carts-model.js";

const router = Router();

router.get('/', async (req, res) => {
    const limit = req.query?.limit || 3
    const page = req.query?.page || 1
    const sort = req.query?.sort 
    const query = req.query?.filter || req.body?.filter || ''

    const search = {};
    if (query) {
        search["$or"] = [
            { title: { $regex: query } },// Expresiones Regulares
            { category: { $regex: query } }
        ]
    }

    const result = await productModel.paginate(search, {
        limit,
        page,
        lean: true,
        sort: sort ? {price: sort} : null
    })

    const cart = await cartsModel.findOne({ _id: '63c644ddc42b52268bb69ac5' }).populate('products.product').lean().exec();
    

    result.prevLink = result.hasPrevPage ? `/products?page=${result.prevPage}` : ''
    result.nextLink = result.hasNextPage ? `/products?page=${result.nextPage}` : ''
    result.isValid = !(page <= 0 || page > result.totalPages)

    res.render('index', {
        result,
        cart,
        username: req.session.user
    });
})

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const product = await productModel.findOne({ _id: id }).lean().exec();
    res.render('one-product', {
        product
    });
})

export default router;