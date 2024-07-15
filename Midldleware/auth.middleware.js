import jwt from 'jsonwebtoken'
 const auth=(req,res,next)=>{
    try {
        
        if(req.headers.authorization){
            const token=req.headers.authorization;
         let decodeToken=jwt.verify(token,process.env.TOKEN_SECRET_KEY);
         if(decodeToken){
            
            next();
         }else{
            return res.status(401).json({
                message:"Invalid Token",
            });
         }


        }else{
            return res.status(401).json({
                message:"Invalid Token",
            });
            
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
          });
        
    }
 }
 export default auth;