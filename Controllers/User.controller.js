import UserModel from "../Models/User.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult, body } from "express-validator";
import multer from "multer";
import path from 'path';
import fs from 'fs'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadUser = path.join(__dirname, '../uploads/Users');
        // const uploadUser="./uploads/Users";
        if (fs.existsSync(uploadUser)) {
            cb(null,uploadUser)
        } else {
            fs.mkdirSync(uploadUser, { recursive: true });
            // fs.mkdirSync(uploadUser);
            cb(null, uploadUser);
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

export const getusers = async (req, res) => {
    try {
        const users= await UserModel.find();
        if(users){
            return res.status(201).json({
                data:users,
                message:'All data Fetched',
                filepath:process.env.FILE_URL+"users/"

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


export const getuser = async (req, res) => {
    try {
        const UserID=req.params.user_id;
        const user=await UserModel.findOne({_id:UserID});
        if(user){
            return res.status(200).json({
                data:user,
                message:"Data is Fetched"
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



export const adduser = async (req, res) => {
    try {
        const updateData = upload.single('myimage');
        updateData(req, res, function (err) {
            if (err) return res.status(400).json({ message: err.message });

            const { name, email, password, contact } = req.body;

            let filename = null
            if (req.file) {
                filename = req.file.filename
            }
            const saveUser = new UserModel({
                name: name,
                email: email,
                password: password,
                contact: contact,
                image: filename
            });
            saveUser.save();
            if (saveUser) {
                return res.status(201).json({
                    data: saveUser,
                    message: "User Added successfully",
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


export const upadateuser = async (req, res) => {
    try {
        const updateData=upload.single('myimage');
        updateData(req,res,async function(err){
            if(err)return res.status(400).json({ message: err.message });

            const UserID=req.params.user_id;
            const existUser= await UserModel.findOne({_id:UserID})
            const{name,email,password,contact}=req.body

            let filename = existUser.image;
      if (req.file) {
        filename = req.file.filename;
        if (fs.existsSync("./uploads/users/" + existUser.image)) {
          fs.unlinkSync("./uploads/users/" + existUser.image);
        }
      }
      const updatedUser = await UserModel.updateOne(
        { _id: UserID },
        {
          $set: {
            name: name,
            email: email,
            password: password,
            contact: contact,
            image: filename,
          },
        }
      );
      if (updatedUser.acknowledged) {
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

export const deleteuser = async (req, res) => {
    try {
        const uploadUser="./uploads/Users/";
        const UserID=req.params.user_id;
        const existUser= await UserModel.findOne({_id:UserID});
        const user=await UserModel.deleteOne({_id:UserID});
        if(user.acknowledged){
            if(fs.existsSync(uploadUser +existUser.image)){
                fs.unlinkSync(uploadUser +existUser.image);
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



export const signUp = async (req, res) => {
    try {
        await Promise.all([
            body('name').notEmpty().withMessage('Name is required').run(req),
            body('email').isEmail().withMessage('Invalid email address').run(req),
            body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').run(req),
            body('contact').isLength({ min: 10, max: 10 }).isNumeric().withMessage('Invalid number').run(req),
            body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role').run(req)
        ]);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, contact, role } = req.body;
        const existUser = await UserModel.findOne({ email: email });

        if (existUser) {
            return res.status(200).json({
                message: 'User Already Exist. Please SignUp with a different UserID'
            });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const saveUser = await UserModel.create({
            name: name,
            email: email,
            password: hashedPassword,
            contact: contact,
            role: role || 'user'
        });

        if (saveUser) {
            return res.status(200).json({
                message: 'SignUp Successful'
            });
        }

        return res.status(400).json({
            message: "Bad request"
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

export const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existUser = await UserModel.findOne({ email: email });
        if (!existUser) {
            return res.status(200).json({ message: "User doesn't exist." });
        }
        const checkPassword = bcrypt.compareSync(password, existUser.password);
        if (!checkPassword) {
            return res.status(200).json({ message: "Invalid Password" });
        }

        const token = jwt.sign(
            {
                _id: existUser._id,
                email: existUser.email,
                role: existUser.role
            },
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: "1h" }
        );
        const resdata = {
            id: existUser._id,
            name: existUser.name,
            email: existUser.email,
            role: existUser.role
        };
        return res.status(200).json({
            data: resdata,
            token: token,
            message: "Login success"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


