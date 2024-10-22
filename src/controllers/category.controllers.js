import { Category } from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllCategories = asyncHandler(async (req, res) => {
  const category = await Category.find({});

  if (!category) {
    throw new ApiError(500, "Something went wrong while fetching  category");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, category, "All Categories Fetched Successfully!")
    );
});

const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(500, "Something went wrong while fetching  category");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, category, "Category Fetched By ID Successfully!")
    );
});

const deleteCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new ApiError(400, "No Category Found!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Category Deleted Successfully"));
});


const addCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if(!title){
    throw new ApiError(400, "Title is required!");
  }


  const imageLocalPath = req.file?.path;

  if (!imageLocalPath) {
    throw new ApiError(400, "Category image is required!");
  }

  const image = await uploadOnCloudinary(imageLocalPath);

  if (!image) {
    throw new ApiError(400, "No valid category image was uploaded!");
  }

  const category = await Category.create({
    title,
    image: image.url,
  });

  const createdCategory = await Category.findById(category._id);

  if (!createdCategory) {
    throw new ApiError(500, "Something went wrong while adding new category");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdCategory, "Category Added Successfully!"));
});

export { getAllCategories, getCategoryById, deleteCategoryById, addCategory };
