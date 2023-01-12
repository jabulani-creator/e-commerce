import express from "express";
import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from "../controllers/userController.js";
import { authenticateUser, authorizePermisions } from "../middleware/auth.js";
const router = express.Router();

router
  .route("/")
  .get(authenticateUser, authorizePermisions("admin"), getAllUsers);
router.route("/showMe").get(authenticateUser, showCurrentUser);
router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/updatePassword").patch(authenticateUser, updateUserPassword);
router
  .route("/:id")
  .get(authenticateUser, authorizePermisions("admin", "user"), getSingleUser);

export default router;
