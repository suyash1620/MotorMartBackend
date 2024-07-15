import ProductModel from "../Models/Product.model";
import multer from "multer";
import path from 'path'
import fs from 'fs'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads/products');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const orName = file.originalname;
        const ext = path.extname(orName);
        const basename = path.parse(orName).name;
        const filename = `${basename}-${Date.now()}${ext}`;
        cb(null, filename);
    }
});
const upload = multer({ storage: storage })

export const getProducts = async (req, res) => {
    try {


        // /get-products?page=1&limit=3
        // /get-products?search=abc
        console.log(req.query)
        const { page, limit, search } = req.query;

        const skipno = (page - 1) * limit;

        const generateSearchRgx = (pattern) => new RegExp(`.*${pattern}.*`);
        const searchRgx = generateSearchRgx(search);
        let filter = {}

        if (search) {

            filter = {
                $or: [
                    { title: { $regex: searchRgx, $options: "i" } },
                    { short_description: { $regex: searchRgx, $options: "i" } },
                    { description: { $regex: searchRgx, $options: "i" } },

                ],
            }

        }


        const products = await ProductModel.find(filter).populate(['category', 'brand']).limit(limit).skip(skipno).sort({ _id: 1 });

        if (products) {
            return res.status(200).json({
                data: products,
                message: 'Fetched!',
                filepath:`http://localhost:${process.env.PORT}/uploads/products/`
            })
        }
        return res.status(400).json({
            message: 'Bad request'
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const getProductsByAggr = async (req, res) => {
    try {
        // https://studio3t.com/knowledge-base/articles/mongodb-aggregation-framework/#mongodb-limit
        // const products = await ProductModel.find().populate('category');
        const products = await ProductModel.aggregate([

            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryData"
                },
            },
            { $unwind: "$categoryData" },
            { $sort: { '_id': -1 } },
            { $limit: 2 },


            {
                $lookup: {
                    from: "brands",
                    localField: "brand",
                    foreignField: "_id",
                    as: "BrandData"
                },
            },
            { $unwind: "$BrandData" },
            { $sort: { '_id': -1 } },
            { $limit: 2 },
        ]);



        // console.log(products)
        if (products) {
            return res.status(200).json({
                data: products,
                message: 'Fetched!'
            })
        }
        return res.status(400).json({
            message: 'Bad request'
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}                    
export const getProduct = async (req, res) => {
    try {
        const productID = req.params.product_id;
        const product = await ProductModel.findOne({ _id: productID }).populate(['category', 'brand']);
        if (product) {
            return res.status(200).json({
                data: product,
                message: 'Fetched!',
                filepath:`http://localhost:${process.env.PORT}/uploads/products/`
            })
        }
        return res.status(400).json({
            message: 'Bad request'
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const addProduct = (req, res) => {
    try {
        const addProductWithFile = upload.fields([{ name: "thumbnail", maxCount: 1 }, { name: 'images', maxCount: 10 }]);

        addProductWithFile(req, res, function (err) {
            if (err) return res.status(500).json({ message: err.message });

            const { title, body, description, fuel, transmission, mileage, price, model, year } = req.body;

            let thumbnail = null;
            if (req.files['thumbnail']) {
                thumbnail = req.files['thumbnail'][0].filename;
            }

            let imageArr = [];
            if (req.files['images']) {
                for (let index = 0; index < req.files['images'].length; index++) {
                    const element = req.files['images'][index];
                    imageArr.push(element.filename);
                }
            }

            const productData = new ProductModel({
                title,
                price,
                body,
                fuel,
                transmission,
                mileage,
                description,
                model,
                year,
                thumbnail,
                images: imageArr
            });

            productData.save().then(() => {
                return res.status(201).json({
                    data: productData,
                    message: 'Created'
                });
            }).catch(error => {
                return res.status(400).json({ message: 'Bad request' });
            });
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};
export const updateProduct = async (req, res) => {
    try {
        const productFields = upload.fields([
            { name: 'thumbnail', maxCount: 1 },
            { name: 'images', maxCount: 10 },
        ]);

        productFields(req, res, async function (err) {
            if (err) throw new Error(err);

            const productId = req.params.product_id;
            const {
                title,  body, description, fuel, transmission, mileage, price, model, year
            } = req.body;

            const existingProduct = await ProductModel.findOne({ _id: productId });

            let thumbnail = existingProduct.thumbnail;
            let imageArr = existingProduct.images;

            if (req.files['thumbnail']) {
                thumbnail = req.files['thumbnail'][0].filename;
            }

            if (req.files['images']) {
                imageArr = [];
                req.files['images'].forEach((element) => {
                    imageArr.push(element.filename);
                });
            }

            const updatedProduct = await ProductModel.updateOne(
                { _id: productId },
                {
                    $set: {
                        title,
                        price,
                        body,
                        fuel,
                        transmission,
                        mileage,
                        description,
                        model,
                        year,
                        thumbnail,
                        images: imageArr
                    },
                }
            );

            if (!updatedProduct.matchedCount) throw new Error('Updation failed');

            return res.status(200).json({
                message: 'Product updated successfully',
            });
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};


export const deleteProduct = async (req, res) => {
    try {
        const productID = req.params.product_id;
        const product = await ProductModel.deleteOne({ _id: productID });
        if (product.acknowledged) {
            return res.status(200).json({
                message: "Deleted "
            })
        }
        return res.status(400).json({
            message: 'Bad request'
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}