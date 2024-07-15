import mongoose from "mongoose";


const Schema=mongoose.Schema;

const brands = new Schema({
    name:{
        type:String,
        required:true,
    },
    Logo:{
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
export default mongoose.model('brands',brands);