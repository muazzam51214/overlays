import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    customer: {
      name: {
        type: String,
        required: [true, "Customer name is required"],
      },
      email: {
        type: String,
        required: [true, "Customer email is required"],
      },
      phone: {
        type: String,
        required: [true, "Customer phone number is required"],
      },
      address: {
        type: String,
        required: [true, "Shipping address is required"],
      },

      city: {
        type: String,
        required: [true, "City is required"],
      },

      postalCode: {
        type: String,
        required: [true, "postalCode is required"],
      },

      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
        },
      },
    ],

    shippingCharges: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
    },

    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
