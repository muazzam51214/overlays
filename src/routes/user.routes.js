import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  getAllUsers,
  getUserById,
  deleteUserById
} from "../controllers/user.controllers.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middlewares.js";

const router = Router();
// User Routes 

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").patch(verifyJWT, changeCurrentPassword);

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/update-account").patch(verifyJWT, updateAccountDetails);

// Admin Routes

router.route("/all-users").get( isAdmin, getAllUsers );
router.route("/u/:id")
  .get(isAdmin, getUserById)
  .delete(isAdmin, deleteUserById)


export default router;
