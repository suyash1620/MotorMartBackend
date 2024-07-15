import mongoose from "mongoose";



const Schema=mongoose.Schema;

const Partsproductschema = new Schema({
    name:{
        type:String,
        required:true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image:{
        type:String,
        default:null
    },
    status:{
        type:Number,
        default:1,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});
export default mongoose.model('Partsproduct',Partsproductschema);