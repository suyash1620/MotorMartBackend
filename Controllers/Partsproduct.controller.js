import PartsproductModel from "../Models/Partsproduct.model";
import multer from "multer";
import path from 'path';
import fs from 'fs'



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPartsproduct = path.join(__dirname, '../uploads/Partsproducts');
        // const uploadPartsproduct="./uploads/Partsproducts";
        if (fs.existsSync(uploadPartsproduct)) {
            cb(null,uploadPartsproduct)
        } else {
            fs.mkdirSync(uploadPartsproduct, { recursive: true });
            // fs.mkdirSync(uploadPartsproduct);
            cb(null, uploadPartsproduct);
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

export const getPartsproducts = async (req, res) => {
    try {
        const Partsproducts= await PartsproductModel.find();
        if(Partsproducts){
            return res.status(201).json({
                data:Partsproducts,
                message:'All data Fetched',
                filepath:process.env.FILE_URL+"Partsproducts/"

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


export const getPartsproduct = async (req, res) => {
    try {
        const PartsproductID=req.params.Partsproduct_id;
        const Partsproduct=await PartsproductModel.findOne({_id:PartsproductID});
        if(Partsproduct){
            return res.status(200).json({
                data:Partsproduct,
                message:"Data is Fetched",
                filepath:process.env.FILE_URL+"Partsproducts/"


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



export const addPartsproduct = async (req, res) => {
    try {
        const updateData = upload.single("Partsproductimage");
        updateData(req, res, function (err) {
            if (err) return res.status(400).json({ message: err.message });

            const { name , category, description,price} = req.body;

            let filename = null
            if (req.file) {
                filename = req.file.filename
            }
            const savePartsproduct = new PartsproductModel({
                name: name,
                category:category,
                description:description,
                price:price,
                image:filename
            });
            savePartsproduct.save();
            if (savePartsproduct) {
                return res.status(201).json({
                    data: savePartsproduct,
                    message: "Partsproduct Added successfully",
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


export const upadatePartsproduct = async (req, res) => {
    try {
        const updateData=upload.single("Partsproductimage");
        updateData(req,res,async function(err){
            if(err)return res.status(400).json({ message: err.message });

            const PartsproductID=req.params.Partsproduct_id;
            const existPartsproduct= await PartsproductModel.findOne({_id:PartsproductID})
            const{name,category, description,price}=req.body

            let filename = existPartsproduct.image;
      if (req.file) {
        filename = req.file.filename;
        if (fs.existsSync("./uploads/Partsproducts/" + existPartsproduct.image)) {
          fs.unlinkSync("./uploads/Partsproducts/" + existPartsproduct.image);
        }
      }
      const updatedPartsproduct = await PartsproductModel.updateOne(
        { _id: PartsproductID },
        {
          $set: {
            name: name,
            category:category,
            description:description,
            price:price,
            image: filename
          },
        }
      );
      if (updatedPartsproduct.acknowledged) {
        return res.status(200).json({
          message: "your Data is Updated",
        });
      }      return res.status(400).json({
        message: "Bad request",
      });
 
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })

    }

}

export const deletePartsproduct = async (req, res) => {
    try {
        const uploadPartsproduct="./uploads/Partsproducts/";
        const PartsproductID=req.params.Partsproduct_id;
        const existPartsproduct= await PartsproductModel.findOne({_id:PartsproductID});
        const Partsproduct=await PartsproductModel.deleteOne({_id:PartsproductID});
        if(Partsproduct.acknowledged){
            if(fs.existsSync(uploadPartsproduct +existPartsproduct.image)){
                fs.unlinkSync(uploadPartsproduct +existPartsproduct.image);
            }
            return res.status(200).json({
                message: "Deleted",
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