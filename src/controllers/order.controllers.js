import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const placeOrder = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    address,
    city,
    postalCode,
    products,
    paymentMethod,
  } = req.body;

  // Check if required fields are provided
  if (
    [name, email, phone, address, city, postalCode, products].some(
      (field) => !field
    )
  ) {
    throw new ApiError(400, "All fields are required!");
  }

  // Ensure products array is provided and not empty
  if (!products || products.length === 0) {
    throw new ApiError(400, "At least one product is required!");
  }

  // Initialize variables for order calculation
  let orderItems = [];
  let subtotal = 0;

  // Loop through products array to validate and calculate
  for (let item of products) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new ApiError(400, `Product not found for ID ${item.product}`);
    }

    const productTotal = product.price * item.quantity;
    subtotal += productTotal;

    orderItems.push({
      product: product._id, // Reference to the product
      quantity: item.quantity,
    });
  }

  // Define additional charges (these could be dynamic or fixed)
  const shippingCharges = 0; // Example: Fixed shipping fee
  const discount = 0; // Discount can be applied based on business logic
  const totalAmount = subtotal + shippingCharges - discount;

  // Create the order with the updated schema structure
  const order = await Order.create({
    customer: {
      name,
      email,
      phone,
      address,
      city,
      postalCode,
      user: req.user?._id, // Assuming user is authenticated
    },
    products: orderItems, // Products with quantity
    shippingCharges,
    discount,
    totalAmount,
    paymentMethod,
    status: "Processing", // Default status
  });

  // Check if the order was created successfully
  const createdOrder = await Order.findById(order._id);

  if (!createdOrder) {
    throw new ApiError(500, "Something went wrong while placing the order");
  }

  // Send response
  return res
    .status(201)
    .json(new ApiResponse(200, createdOrder, "Order Placed Successfully!"));
});

const myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ "customer.user": req.user._id });
  if (!orders) {
    throw new ApiError(404, "No Order Found!");
  }
  return res
    .status(200)
    .json(new ApiResponse(201, orders, "Your orders fetched Successfully!"));
});

const allOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({});
  if (!orders) {
    throw new ApiError(404, "No Order Found!");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, orders, "All orders fetched Successfully!"));
});

const orderDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Order ID Not Found!");
  }
  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, "No Order Found!");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order Details fetched Successfully!"));
});

const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Order ID Not Found!");
  }
  const order = await Order.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order Deleted Successfully!"));
});

const processOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!id) {
    throw new ApiError(400, "Order ID Not Found!");
  }

  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(400, "Order Not Found!");
  }
  order.status = status;

  await order.save();

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order Processed Successfully!"));
});

export {
  placeOrder,
  myOrders,
  allOrders,
  orderDetails,
  deleteOrder,
  processOrder,
};
