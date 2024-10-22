import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getLatestProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 }).limit(6);

  if (!products) {
    throw new ApiError(
      500,
      "Something went wrong while fetching latest products"
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, products, "Latest Products Fetched Successfully!")
    );
});

const getAllProducts = asyncHandler(async (req, res) => {
  const { search, sort, category, price } = req.query;

  const page = Number(req.query.page) || 1;
  const limit = Number(process.env.PRODUCT_PER_PAGE) || 12;
  const skip = (page - 1) * limit;

  const baseQuery = {};

  if (search) {
    baseQuery.title = {
      $regex: search,
      $options: "i",
    };
  }

  if (price) {
    baseQuery.price = {
      $lte: Number(price),
    };
  }

  if (category) {
    baseQuery.category = category;
  }

  const totalProducts = await Product.countDocuments(baseQuery);
  const totalPages = Math.ceil(totalProducts / limit);

  const products = await Product.find(baseQuery)
    .sort(sort ? { price: sort === "asc" ? 1 : -1 } : { _id: 1 }) // fallback sort by _id
    .limit(limit)
    .skip(skip);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { totalPages, products },
        "All Products Fetched Successfully"
      )
    );
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(500, "Something went wrong while fetching  product");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product Fetched By ID Successfully!"));
});

const addProduct = asyncHandler(async (req, res) => {
  const { title, description, price, category, size } = req.body;

  if ([title, description, price, size].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All field are required!");
  }

  const imageLocalPaths = req.files?.map((file) => file.path);

  if (!imageLocalPaths || imageLocalPaths.length === 0) {
    throw new ApiError(400, "At least one product image is required!");
  }

  const uploadedImages = [];
  for (const imageLocalPath of imageLocalPaths) {
    const image = await uploadOnCloudinary(imageLocalPath);
    if (image) {
      uploadedImages.push(image.url);
    }
  }

  if (uploadedImages.length === 0) {
    throw new ApiError(400, "No valid product images were uploaded!");
  }

  const product = await Product.create({
    title,
    description,
    price,
    category,
    features: { size },
    productImage: uploadedImages,
  });

  const createdProduct = await Product.findById(product._id);

  if (!createdProduct) {
    throw new ApiError(500, "Something went wrong while adding new product");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdProduct, "Product Added Successfully!"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, price, category, size, inStock } = req.body;

  const product = await Product.findById(id);
  if (title) product.title = title;
  if (description) product.description = description;
  if (price) product.price = price;
  if (category) product.category = category;
  if (inStock) product.inStock = inStock;
  if (size) product.features.size = size;

  if (req.files && req.files.length > 0) {
    const uploadedImages = [];

    for (const imageLocalPath of req.files.map((file) => file.path)) {
      const image = await uploadOnCloudinary(imageLocalPath);
      if (image) {
        uploadedImages.push(image.url);
      }
    }

    if (uploadedImages.length > 0) {
      product.productImage = [...product.productImage, ...uploadedImages];
    }
  }

  // Save the updated product
  await product.save();

  return res
    .status(200)
    .json(new ApiResponse(201, product, "Product Updated Successfully"));
});

const deleteProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new ApiError(400, "No Product Found!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product Deleted Successfully"));
});

const getAdminProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});

  if (!products) {
    throw new ApiError(500, "Something went wrong while fetching  products");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products Fetched Successfully!"));
});

export {
  addProduct,
  getLatestProducts,
  getAllProducts,
  getProductById,
  deleteProductById,
  updateProduct,
  getAdminProducts,
};
