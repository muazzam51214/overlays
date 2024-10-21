import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(400, "Unauthorized Access");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Acces Token");
  }
});

const isAdmin = asyncHandler( async(req,res,next) => {

  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  
    if(!token){
      throw new ApiError(401, "Unauthorized Access");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
  
    if(!user){
      throw new ApiError(401, "Invalid Access Token");
    }
  
    if(user.role !== "admin"){
      throw new ApiError(401, "You are not admin");
    }
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Acces Token")
  }
})


export { verifyJWT, isAdmin };
