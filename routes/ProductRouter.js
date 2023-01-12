import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  uploadImage,
} from "../controllers/productController.js";
import { getSingleProductReviews } from "../controllers/reviewController.js";
import { authenticateUser, authorizePermisions } from "../middleware/auth.js";
const router = express.Router();

router
  .route("/")
  .post(authenticateUser, authorizePermisions("admin"), createProduct)
  .get(getAllProducts);

router
  .route("/upload")
  .post(authenticateUser, authorizePermisions("admin"), uploadImage);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch(authenticateUser, authorizePermisions("admin"), updateProduct)
  .delete(authenticateUser, authorizePermisions("admin"), deleteProduct);
router.route("/:id/reviews").get(getSingleProductReviews);

export default router;
