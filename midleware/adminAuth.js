import jwt from "jsonwebtoken"
const adminAuth=async(req,res,next)=>{
try{
const {token}=req.headers;
if(!token){
    return res.json({success:false,message:"Not Authorized login Again!!"})
}
const decode_token = await jwt.verify(token, process.env.JWT_SECRETE);
if(decode_token!==process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD){
        return res.json({
          success: false,
          message: "Not Authorized login Again!!",
        });

} next()
}catch(error){
    res.json({success:false,message:error.message})
}
}
export default adminAuth;