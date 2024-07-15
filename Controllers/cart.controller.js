import cartModel from "../Models/cart.model";
import ProductModel from "../Models/Product.model";
// import UserModel from "../Models/User.model";

export const addToCart= async (req, res) => {
    try {
        const { productID, userID,partsproductID } = req.body;

        const cartData = await cartModel.findOne({ productID: productID, userID: userID, partsproductID:partsproductID  });
        console.log(cartData)
        if (cartData) {
            let quantity = cartData.quantity + 1;

            if (quantity > 10) {
                return res.status(200).json({ message: 'max exceed' })
            }
            const updated = await cartModel.updateOne({ _id: cartData._id }, {
                $set: {
                    quantity: quantity
                }
            });

            if (updated.acknowledged) {
                return res.status(200).json({
                    message: 'added to cart'
                })
            }
        } else {
            const products = await ProductModel.findOne({ _id: [productID,partsproductID] });

            if (products) {
                const cartData = new cartModel({
                    userID: userID,
                    productID: productID,
                    partsproductID:partsproductID ,
                    title: products.title,
                    price: products.price,
                    quantity: 1,
                    image: products.thumbnail
                });
                cartData.save();
                if (cartData) {
                    return res.status(200).json({
                        message: 'Added to cart'
                    })
                }
            }
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

// http://localhost:8001/update-quantity/658fdfc69f1791c13152cd4d?type=desc
export const updateQuantity = async (req,res) => {

    try {
        const cartID = req.params.item_id;
        const {type} = req.query;
        const cart = await cartModel.findOne({_id:cartID});
        console.log(cart)
        let quantity = cart.quantity;
        if(type == 'inc'){
            quantity += 1
        }
        if(type=='desc'){
            quantity -= 1
        }

        if( quantity > 10 ){
            return res.status(200).json({
                message: 'The Cart Quantity is Exceed'
            })
        }

        if(quantity == 0){
            const deleted = await cartModel.deleteOne({_id:cartID});
            if(deleted){
                return res.status(200).json({
                    message:'deleted'
                })
            }
        }

        const updated = await cartModel.updateOne({ _id: cartID }, {
            $set: {
                quantity: quantity
            }
        });

        if (updated.acknowledged) {
            return res.status(200).json({
                message: 'updated'
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


export const getCartItems = async (req, res) => {
    try {
        const userID = req.params.user_id
        const carts = await cartModel.find({ userID: userID })
        if (carts) {
            return res.status(200).json({
                data: carts,
                message: 'fetched',
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


export const deleteCart=async(req,res)=>{
    try {
        
        const cartID = req.params.item_id;
        const cart = await cartModel.deleteOne({_id:cartID});
        if (cart.acknowledged) {
            return res.status(200).json({
                message: "Deleted "
            })}

        return res.status(400).json({
            message: 'Bad request'
        })
    
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}
