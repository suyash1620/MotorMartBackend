import BrandModel from "../Models/Brand.model";
import multer from "multer";
import path from 'path';
import fs from 'fs'



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadBrand = path.join(__dirname, '../uploads/Brands');
        // const uploadBrand="./uploads/Brands";
        if (fs.existsSync(uploadBrand)) {
            cb(null,uploadBrand)
        } else {
            fs.mkdirSync(uploadBrand, { recursive: true });
            // fs.mkdirSync(uploadBrand);
            cb(null, uploadBrand);
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

export const getbrands = async (req, res) => {
    try {
        const brands= await BrandModel.find();
        if(brands){
            return res.status(201).json({
                data:brands,
                message:'All data Fetched',
                filepath:process.env.FILE_URL+"brands/"

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


export const getbrand = async (req, res) => {
    try {
        const BrandID=req.params.brand_id;
        const brand=await BrandModel.findOne({_id:BrandID});
        if(brand){
            return res.status(200).json({
                data:brand,
                message:"Data is Fetched",
                filepath:process.env.FILE_URL+"brands/"


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



export const addbrand = async (req, res) => {
    try {
        const updateData = upload.single("brandimage");
        updateData(req, res, function (err) {
            if (err) return res.status(400).json({ message: err.message });

            const { name } = req.body;

            let filename = null
            if (req.file) {
                filename = req.file.filename
            }
            const saveBrand = new BrandModel({
                name: name,
                Logo:filename
            });
            saveBrand.save();
            if (saveBrand) {
                return res.status(201).json({
                    data: saveBrand,
                    message: "Brand Added successfully",
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


export const upadatebrand = async (req, res) => {
    try {
        const updateData=upload.single("brandimage");
        updateData(req,res,async function(err){
            if(err)return res.status(400).json({ message: err.message });

            const BrandID=req.params.brand_id;
            const existBrand= await BrandModel.findOne({_id:BrandID})
            const{name}=req.body

            let filename = existBrand.image;
      if (req.file) {
        filename = req.file.filename;
        if (fs.existsSync("./uploads/brands/" + existBrand.image)) {
          fs.unlinkSync("./uploads/brands/" + existBrand.image);
        }
      }
      const updatedBrand = await BrandModel.updateOne(
        { _id: BrandID },
        {
          $set: {
            name: name,
            Logo: filename
          },
        }
      );
      if (updatedBrand.acknowledged) {
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

export const deletebrand = async (req, res) => {
    try {
        const uploadBrand="./uploads/Brands/";
        const BrandID=req.params.brand_id;
        const existBrand= await BrandModel.findOne({_id:BrandID});
        const brand=await BrandModel.deleteOne({_id:BrandID});
        if(brand.acknowledged){
            if(fs.existsSync(uploadBrand +existBrand.image)){
                fs.unlinkSync(uploadBrand +existBrand.image);
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