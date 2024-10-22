import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {

    title: {
      type: String,
      required: [true, "title is required"],
    },

    description: {
      type: String,
    },

    productImage: {
      type: [String],
      required: [true, "At least one productImage is required"],
    },

    price: {
      type: Number,
      required: [true, "product price is required"],
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },

    features: {
      size: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
