import express from 'express'
import { getPartsproduct,getPartsproducts,addPartsproduct,upadatePartsproduct,deletePartsproduct } from '../Controllers/Partsproduct.controller';


const router=express.Router();


router.get('/get-Partsproducts',getPartsproducts)
router.get('/get-Partsproduct/:Partsproduct_id', getPartsproduct)
router.post('/add-Partsproduct',addPartsproduct)
router.put('/update-Partsproduct/:Partsproduct_id',upadatePartsproduct)
router.delete('/delete-Partsproduct/:Partsproduct_id',deletePartsproduct)

export default router;