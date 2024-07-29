import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import express from 'express';
import Userrouter from './Routers/User.router';
import Categoryrouter from './Routers/Category.router'
import Brandrouter from './Routers/Brand.router'
import Productrouter from './Routers/Product.router'
import Cartrouter from './Routers/cart.router'
import Partsproductrouter from './Routers/Partsproduct.router'
import cors from 'cors'



const app =express();
app.use(express.json());
app.use(cors());

app.use('/uploads',express.static('uploads'))

const PORT=process.env.PORT || 5001


mongoose.connect(process.env.DB_PATH+process.env.DB_NAME)
.then(()=>console.log("Connected!"));

app.listen(PORT,()=>{
    console.log("server is Running on http://localhost:"+PORT)
});
app.use(Userrouter);
app.use(Categoryrouter);
app.use(Brandrouter);
app.use(Productrouter);
app.use(Cartrouter);
app.use(Partsproductrouter);
