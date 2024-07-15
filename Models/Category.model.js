import mongoose, { Mongoose } from "mongoose";

const Schema = mongoose.Schema;

const categorySchema= new Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        default:null,
    },
    image:{
        type:String,
        default:null,
    },
    status:{
        type:Number,
        default:1
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }



});
export default mongoose.model('category', categorySchema);