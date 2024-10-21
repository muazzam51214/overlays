import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: ["Credit Card", "Cash On Delivery", "Bank Transfer"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
