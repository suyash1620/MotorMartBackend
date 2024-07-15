import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }, 
     password:{
        type:String,
        required:true
    },
    contact:{
        type:String,
        default:null
    },
    image:{
        type:String,
        default:null
    },
    role: {
        type: String,
        default: 'user', // 'user' or 'admin'
        enum: ['user', 'admin']
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

export default mongoose.model('User',UserSchema)