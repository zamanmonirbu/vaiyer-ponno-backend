const getMostRatedProductsByCategory = async (req, res) => {
    try {
      const mostRatedProducts = await Product.aggregate([
        {
          $group: {
            _id: "$category", // Group by category
            mostRatedProduct: { $first: "$$ROOT" }, // Get the first product in the sorted list
          },
        },
        {
          $lookup: {
            from: "categories", // Collection name in MongoDB
            localField: "_id", // Field from the Product collection
            foreignField: "_id", // Field from the Category collection
            as: "categoryDetails",
          },
        },
        { $unwind: "$categoryDetails" }, // Unwind to get the category details
        {
          $sort: { "mostRatedProduct.ratings": -1 }, // Sort by ratings in descending order
        },
        {
          $limit: 1, // Pick only the top-rated product from each category
        },
        {
          $project: {
            _id: 0,
            category: "$categoryDetails.name",
            product: "$mostRatedProduct",
          },
        },
      ]);
  
      res.status(200).json(mostRatedProducts);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  module.exports = { getMostRatedProductsByCategory };
  