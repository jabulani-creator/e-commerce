import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "please provide product review rating"],
    },
    title: {
      type: String,
      required: [true, "please provide product title"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    comment: {
      type: String,
      required: [true, "please provide product comment"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "null",
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);
  try {
    await this.model("Product").findOneAndUpdate(
      { _id: productId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};
reviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.product);
});
reviewSchema.post("remove", async function () {
  await this.constructor.calculateAverageRating(this.product);
});
export default mongoose.model("Review", reviewSchema);
