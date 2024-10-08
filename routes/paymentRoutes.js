const express = require("express");
const SSLCommerzPayment = require("sslcommerz-lts");
const { v4: uuidv4 } = require("uuid"); // Import UUID library
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");

const store_id = process.env.Store_ID;
const store_passwd = process.env.Store_Password;
const is_live = false;

router.post("/payment", async (req, res) => {
  const uId = uuidv4();
  const {
    customerName,
    customerAddress,
    customerEmail,
    customerMobile,
    products,
    totalAmount,
  } = req.body;

  if (!customerName || !customerEmail || !products || !totalAmount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Extract product and seller IDs dynamically
  const productIds = products.map((product) => product.productId);
  const sellerIds = products.map((product) => product.sellerId);

  // Common values
  const defaultCity = "Dhaka";
  const defaultCountry = "Bangladesh";
  const defaultPostcode = "1000";

  // Data for SSLCommerz payment
  const data = {
    total_amount: totalAmount,
    currency: "BDT",
    tran_id: uId, // use a unique tran_id for each API call
    success_url: `http://localhost:5000/api/payment/success/${uId}`,
    fail_url: `http://localhost:5000/api/payment/fail/${uId}`,
    cancel_url: `http://localhost:5000/api/payment/cancel/${uId}`,
    ipn_url: "http://localhost:5000/ipn",
    shipping_method: "Courier",
    product_name: "Product Purchase", // Customize product name as needed
    product_category: "General",
    product_profile: "general",
    cus_name: customerName,
    cus_email: customerEmail,
    cus_add1: customerAddress,
    cus_add2: defaultCity,
    cus_city: defaultCity,
    cus_state: defaultCity,
    cus_postcode: defaultPostcode,
    cus_country: defaultCountry,
    cus_phone: customerMobile || "N/A",
    cus_fax: customerMobile || "N/A",
    ship_name: customerName, // Reuse customer info for shipping
    ship_add1: customerAddress,
    ship_add2: defaultCity,
    ship_city: defaultCity,
    ship_state: defaultCity,
    ship_postcode: "1800",
    ship_country: defaultCountry,
  };

  try {
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.init(data).then(async (apiResponse) => {
      const { GatewayPageURL } = apiResponse;
      // console.log("Gateway",GatewayPageURL);
      if (GatewayPageURL) {
        // console.log("From here", data.tran_id);
        // Save the new order in the database
        const newOrder = new Order({
          tran_id: data.tran_id,
          transactionId: data.tran_id,
          customerName: data.cus_name,
          customerEmail: data.cus_email,
          customerAddress: data.cus_add1,
          customerMobile: data.cus_phone,
          totalAmount: data.total_amount,
          products,
          status: false,
          sellerIds,
          productIds,
          currency: data.currency,
          shipping_method: data.shipping_method,
          cus_country: data.cus_country,
          ship_name: data.ship_name, // Reuse data fields
          ship_add1: data.ship_add1,
          ship_add2: data.ship_add2,
          ship_city: data.ship_city,
          ship_state: data.ship_state,
          ship_postcode: data.ship_postcode,
          ship_country: data.ship_country,
        });

        await newOrder.save();

        // Redirect to payment gateway
        res.json({ GatewayPageURL });
      } else {
        res.status(500).json({ error: "Failed to initiate payment" });
      }
    });
  } catch (error) {
    console.error("Payment initiation error:", error);
    res
      .status(500)
      .json({ error: "Payment initiation failed", details: error.message });
  }

  // Success route
  router.post("/payment/success/:id", async (req, res) => {
    const { id } = req.params;  // This `id` is the `tran_id`, not the `_id`
    
    try {
      // Update the order status
      const result = await Order.updateOne(
        { tran_id: id },  // Use `tran_id` for the Order model
        {
          $set: {
            status: true,
          },
        }
      );
  
      if (result.modifiedCount > 0) {
        // Assuming that the Product schema also has a `tran_id` or related field
        // const productUpdate = await Product.updateOne(
        //   { _id: productIds[0] },  // Ensure you're using the correct field in Product schema
        //   {
        //     $push: {
        //       order: id,  // Add the `tran_id` to the `order` field in Product
        //     },
        //   }
        // );
  
        // if (productUpdate.modifiedCount > 0) {
        //   // Redirect after successful product update
          res.redirect(`http://localhost:5173/payment/success/${id}`);
        // } else {
        //   res.status(404).json({ error: "Product not found or already updated" });
        // }
      } else {
        res.status(404).json({ error: "Order not found or already updated" });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({
        error: "Failed to update order status or product",
        details: error.message,
      });
    }
  });
  

  //   Cancel route
  router.post("/payment/cancel/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await Order.updateOne({ tran_id: id }, { $set: { status: false } });
      res.redirect(`http://localhost:5173/payment/cancel/${id}`);
    } catch (error) {
      console.error("Error handling cancel order:", error);
      res.status(500).json({
        error: "Failed to handle cancel order",
        details: error.message,
      });
    }
  });

  router.post("/payment/fail/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await Order.updateOne({ tran_id: id }, { $set: { status: false } });
      res.redirect(`http://localhost:5173/payment/fail/${id}`);
    } catch (error) {
      console.error("Error handling failed order:", error);
      res.status(500).json({
        error: "Failed to handle failed order",
        details: error.message,
      });
    }
  });
});
module.exports = router;
