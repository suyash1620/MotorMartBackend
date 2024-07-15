import CategoryModel from "../Models/Category.model";
import multer from "multer";
import path from 'path';
import fs from 'fs'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadcategory = path.join(__dirname, '../uploads/categorys');
       
        if (fs.existsSync(uploadcategory)) {
            cb(null,uploadcategory)
        } else {
            fs.mkdirSync(uploadcategory, { recursive: true });
          
            cb(null, uploadcategory);
        }
    },

    filename: function (req, file, cb) {
        let orName = file.originalname;
        let ext = path.extname(orName);
        let basename = path.parse(orName).name;
        let filename = basename + "-" + Date.now() + ext;
        cb(null, filename)
    }

}

);
const upload = multer({ storage: storage })

export const getCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.find();
        if (categories) {
            return res.status(201).json({
                data: categories,
                message: 'All data Fetched',
                filepath: process.env.FILE_URL + "category/"
               
            })
        }
        return res.status(400).json({
            message: "Bad request",
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })

    }

}


export const getCategory = async (req, res) => {
    try {
        const CategoryID = req.params.category_id;
        const category = await CategoryModel.findOne({ _id: CategoryID });
        if (category) {
            return res.status(200).json({
                data: category,
                message: "Data is Fetched"
            })
        };
        return res.status(400).json({
            message: "Bad request",
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })

    }

}



export const addcategory = async (req, res) => {
    try {
        const updateData = upload.single("Categoryimage");
        updateData(req, res, function (err) {
            if (err) return res.status(400).json({ message: err.message });

            const { name, description } = req.body;

            let filename = null
            if (req.file) {
                filename = req.file.filename
            }
            const saveCategory = new CategoryModel({
                name: name,
                description: description,
                image: filename
            });
            saveCategory.save();
            if (saveCategory) {
                return res.status(201).json({
                    data: saveCategory,
                    message: "New Data Added successfully",
                });
            }
            return res.status(400).json({
                message: "Bad request",
            });
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
};


export const updatecategory = async (req, res) => {
    try {
        const updateData = upload.single("Categoryimage");
        updateData(req, res, async function (err) {
            if (err) return res.status(400).json({ message: err.message });

            const CategoryID = req.params.category_id;
            const existCategory = await CategoryModel.findOne({ _id: CategoryID })
            const { name, description } = req.body

            let filename=existCategory.image;
            if (req.file) {
                filename = req.file.filename;
                if (fs.existsSync("./uploads/category/" + existCategory.image)) {
                    fs.unlinkSync("./uploads/category/" + existCategory.image);
                }
            }
            const updatedcategory = await CategoryModel.updateOne(
                { _id: CategoryID },
                {
                    $set: {
                        name: name,
                        description: description,
                        image: filename,
                    },
                }
            );
            if (updatedcategory.acknowledged) {
                return res.status(200).json({
                    message: " Data is Updated succesfully",
                });
            } return res.status(400).json({
                message: "Bad request",
            });

        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })

    }

}

export const deletecategory = async (req, res) => {
    try {
        const uploadCategory = "./uploads/category/";
        const CategoryID = req.params.category_id;
        const existCategory = await CategoryModel.findOne({ _id: CategoryID });
        const category = await CategoryModel.deleteOne({ _id: CategoryID });
        if (category.acknowledged) {
            if (fs.existsSync(uploadCategory + existCategory.image)) {
                fs.unlinkSync(uploadCategory + existCategory.image);
            }
            return res.status(200).json({
                message: "Data is Deleted",
            });
        }
        return res.status(400).json({
            message: "Bad request",
        });
    }

    catch (error) {
        return res.status(500).json({
            message: error.message
        })

    }

}