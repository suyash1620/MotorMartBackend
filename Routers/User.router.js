import express from 'express'

import { adduser, deleteuser, getuser, getusers, logIn, signUp, upadateuser } from '../Controllers/User.controller';
const router=express.Router();


router.get('/get-users',getusers)
router.get('/get-user/:user_id', getuser)
router.post('/add-user',adduser)
router.put('/update-user/:user_id',upadateuser)
router.delete('/delete-user/:user_id',deleteuser)


router.post('/sign-up',signUp)
router.post('/user-login',logIn)




export default router
