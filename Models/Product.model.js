import mongoose from "mongoose";
import CategoryModel from "../Models/Category.model";
import BrandModel from "../Models/Brand.model";

const Schema = mongoose.Schema;

const Productschema = new Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        required: null,
        ref: CategoryModel
    },
    brand: {
        type: Schema.Types.ObjectId,
        required: null,
        ref: BrandModel
    },
    body: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    model:{
        type:String,
        required:true
    },
    year:{
        type:Number,
        required:true
    },
    fuel: {
        type: String,
        required: true
    },
    transmission: {
        type: String,
        required: true
    },
    mileage: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        default: null
    },
    images: {
        type: Array,
        default: null
    },
    status: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})
export default mongoose.model('products', Productschema);

