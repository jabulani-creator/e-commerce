import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";

import Product from "../models/Product.js";
import Review from "../models/Review.js";
import checkPermissions from "../utils/checkPermissions.js";

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new NotFoundError(`No product found with id ${productId}`);
  }
  const alreadySubmited = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (alreadySubmited) {
    throw new BadRequestError(`Already submited review for this product`);
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name company price",
  });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};
const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new NotFoundError(`no review with id ${reviewId}`);
  }
  res.status(StatusCodes.OK).json({ review });
};
const updateReview = async (req, res) => {
  const { rating, title, comment } = req.body;

  const { id: reviewId } = req.params;

  if (!rating || !title || !comment) {
    throw new BadRequestError("Please Provide All users");
  }
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new NotFoundError(`no review with id ${reviewId}`);
  }
  checkPermissions(req.user, review.user);
  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();
  res.status(StatusCodes.OK).json({ review });
};
const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new NotFoundError(`no review with id ${reviewId}`);
  }
  checkPermissions(req.user, review.user);

  await review.remove();
  res.status(StatusCodes.OK).json({ msg: "delete review" });
};

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};
export {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
