const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = async(req,res,next)=>{
    try {
        
        const token = req.headers.authorization.split(' ')[1];//Bearer token formatından tokenın alınması
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");//şifre hariç kullanıcı bilgilerini getir
        next();
    } catch (error) {
        res.status(401).json({message:"Not Authorized, token failed."});
    }
};

module.exports = authenticate;