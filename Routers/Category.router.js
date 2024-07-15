import express from "express";
import auth from "../Midldleware/auth.middleware";
import { addcategory, deletecategory, getCategories, getCategory, updatecategory } from "../Controllers/Category.controller";
const router = express.Router();

router.get("/get-categories", getCategories);
router.get('/get-category/:category_id',getCategory)
router.post("/add-category",  addcategory);
router.put("/update-category/:category_id", updatecategory);
router.delete("/delete-category/:category_id", deletecategory);

export default router;