import { Router } from "express";
import {
  placeOrder,
  myOrders,
  allOrders,
  orderDetails,
  deleteOrder,
  processOrder,
} from "../controllers/order.controllers.js";
import { isAdmin, verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/place").post(verifyJWT, placeOrder);
router.route("/my-orders").get(verifyJWT, myOrders);
router.route("/all-orders").get(isAdmin, allOrders);
router
  .route("/:id")
  .get(verifyJWT, orderDetails)
  .patch(isAdmin, processOrder)
  .delete(isAdmin, deleteOrder);

// Secured Routes

export default router;
