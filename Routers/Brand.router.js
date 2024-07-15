import express from 'express'
import { addbrand, deletebrand, getbrand, getbrands, upadatebrand } from '../Controllers/Brand.controller';


const router=express.Router();


router.get('/get-brands',getbrands)
router.get('/get-brand/:brand_id', getbrand)
router.post('/add-brand',addbrand)
router.put('/update-brand/:brand_id',upadatebrand)
router.delete('/delete-brand/:brand_id',deletebrand)

export default router;