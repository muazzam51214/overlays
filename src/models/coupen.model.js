import mongoose, { Schema } from "mongoose";

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100"],
    },
    expiryDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model("Coupon", couponSchema);
