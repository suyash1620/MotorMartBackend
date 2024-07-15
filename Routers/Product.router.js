import express from 'express'
import { addProduct, deleteProduct, getProduct, getProducts, getProductsByAggr, updateProduct } from '../Controllers/Product.controller'

const router = express.Router();


router.get('/get-products', getProducts);
router.get('/get-products-aggr', getProductsByAggr);
router.get('/get-product/:product_id', getProduct);
router.post('/add-product', addProduct);
router.put('/update-product/:product_id', updateProduct);
router.delete('/delete-product/:product_id', deleteProduct);

export default router;