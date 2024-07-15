import mongoose from "mongoose";


const Schema=mongoose.Schema;

const cart = new Schema({
    userID:{
        type:Schema.Types.ObjectId,
        required:true,
    },
    productID:{
        type:Schema.Types.ObjectId,
        required:true,
    },
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        default:1
    },
    image:{
        type:String,
        required:true
    }
});
export default mongoose.model('cart',cart);