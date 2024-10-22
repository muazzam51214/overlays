import { Router } from "express";

import { upload } from "../middlewares/multer.middleware.js";
import { isAdmin } from "../middlewares/auth.middlewares.js";

const router = Router();


export default router;
