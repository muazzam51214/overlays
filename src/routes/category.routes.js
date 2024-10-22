import { Router } from "express";

import { upload } from "../middlewares/multer.middleware.js";
import { isAdmin } from "../middlewares/auth.middlewares.js";
import {
  getAllCategories,
  getCategoryById,
  deleteCategoryById,
  addCategory
} from "../controllers/category.controllers.js";

const router = Router();

router.route("/").get(getAllCategories);

router.route("/add").post( isAdmin, upload.single("image"), addCategory);

router.route("/:id")
  .get(getCategoryById)
  .delete(isAdmin, deleteCategoryById);

export default router;
