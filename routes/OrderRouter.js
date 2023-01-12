import express from "express";
import {
  createOrder,
  getAllOrders,
  getCurrentUserOrders,
  getsingleOrder,
  updateOrder,
} from "../controllers/OrderController.js";
import { authenticateUser, authorizePermisions } from "../middleware/auth.js";
const router = express.Router();

router
  .route("/")
  .post(authenticateUser, createOrder)
  .get(authenticateUser, authorizePermisions("admin"), getAllOrders);
router.route("/showAllMyOrders").get(authenticateUser, getCurrentUserOrders);
router
  .route("/:id")
  .patch(authenticateUser, updateOrder)
  .get(authenticateUser, getsingleOrder);

export default router;
