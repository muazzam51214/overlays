import { Router } from "express";
import {
  addProduct,
  getLatestProducts,
  getAllProducts,
  getProductById,
  deleteProductById,
  updateProduct,
  getAdminProducts,
} from "../controllers/product.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { isAdmin } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/").get(getAllProducts);

router.route("/latest").get(getLatestProducts);

// Secured Routes
router
  .route("/add")
  .post(
    isAdmin,
    upload.array("productImage", 5),
    addProduct
  );

router.route("/admin-products").get(isAdmin, getAdminProducts);
router
  .route("/:id")
  .get(getProductById)
  .delete(isAdmin, deleteProductById)
  .patch(isAdmin, upload.array("productImage"), updateProduct);

export default router;
