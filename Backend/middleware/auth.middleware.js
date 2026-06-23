import jwt from "jsonwebtoken";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "../utils/ApiError.utils.js";

export const authMiddleware = async(req,res,next)=>{
    try{
        const accessToken = req.cookies?.accessToken;
        if(!accessToken){
            return next(new NotFoundError("Access Token Missing"));
        }
        const decoded = jwt.verify(accessToken,process.env.ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch(err){
        return next(new UnauthorizedError("Invalid or Expired Token"));
    }
};

export const authoriseRoles = (...allowedRoles)=>{
    return (req,res,next)=>{
        if(!req.user){
            return next(new UnauthorizedError("User not Authenticated"));
        }
        if(!allowedRoles.includes(req.user.role)){
            return next(new ForbiddenError("You are not allowed to access this resource"));
        }
        next();
    }
};