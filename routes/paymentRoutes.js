const express = require("express");
const SSLCommerzPayment = require("sslcommerz-lts");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

const store_id = process.env.Store_ID;
const store_passwd = process.env.Store_Password;
const is_live = false;

// Main payment route
router.post("/payment", async (req, res) => {
  const uId = uuidv4();
  
  const {
    customerId,
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

  const productIds = products.map((product) => product.productId);
  const sellerIds = products.map((product) => product.sellerId);

  const defaultCity = "Dhaka";
  const defaultCountry = "Bangladesh";
  const defaultPostcode = "1000";

  const data = {
    total_amount: totalAmount,
    currency: "BDT",
    tran_id: uId,
    success_url: `http://localhost:5000/api/payment/success/${uId}`,
    fail_url: `http://localhost:5000/api/payment/fail/${uId}`,
    cancel_url: `http://localhost:5000/api/payment/cancel/${uId}`,
    ipn_url: "http://localhost:5000/ipn",
    shipping_method: "Courier",
    product_name: "Product Purchase",
    product_category: "General",
    product_profile: "general",
    cus_name: customerName,
    cus_email: customerEmail,
    cus_add1: customerAddress,
    cus_city: defaultCity,
    cus_postcode: defaultPostcode,
    cus_country: defaultCountry,
    cus_phone: customerMobile || "N/A",
    ship_name: customerName,
    ship_add1: customerAddress,
    ship_city: defaultCity,
    ship_postcode: "1800",
    ship_country: defaultCountry,
  };

  try {
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.init(data).then(async (apiResponse) => {
      const { GatewayPageURL } = apiResponse;
      if (GatewayPageURL) {
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
          ship_name: data.ship_name,
          ship_add1: data.ship_add1,
          ship_city: data.ship_city,
          ship_postcode: data.ship_postcode,
          ship_country: data.ship_country,
          customerId,
        });

        await newOrder.save();
        res.json({ GatewayPageURL });
      } else {
        res.status(500).json({ error: "Failed to initiate payment" });
      }
    });
  } catch (error) {
    console.error("Payment initiation error:", error);
    res.status(500).json({ error: "Payment initiation failed", details: error.message });
  }
});

// Success route
router.post("/payment/success/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Order.updateOne(
      { tran_id: id },
      { $set: { status: true } }
    );

    const orderData = await Order.findOne({ tran_id: id });
    if (result.modifiedCount > 0) {
      for (let product of orderData.products) {
        const qty = product.qty && !isNaN(product.qty) ? product.qty : 0;
        if (qty > 0) {
          await Product.updateOne(
            { _id: product.productId },
            { $push: { order: orderData._id }, $inc: { quantity: -qty } }
          );
        } else {
          console.error(`Invalid quantity for product ${product.productId}`);
        }
      }

      const userUpdate = await User.updateOne(
        { _id: orderData.customerId },
        { $push: { order: orderData._id } }
      );

      if (userUpdate.modifiedCount > 0) {
        res.redirect(`http://localhost:5173/payment/success/${id}`);
      } else {
        res.status(404).json({ error: "User not found or already updated" });
      }
    } else {
      res.status(404).json({ error: "Order not found or already updated" });
    }
  } catch (error) {
    console.error("Error updating order status or product/user:", error);
    res.status(500).json({
      error: "Failed to update order status, product, or user",
      details: error.message,
    });
  }
});

// Cancel route
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

// Fail route
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





// COD payment route
router.post("/payment/cod", async (req, res) => {

  // console.log(req.body)

  const uId = uuidv4();
  const {
    customerId,
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

  try {
    const productIds = products.map((product) => product.productId);
    const sellerIds = products.map((product) => product.sellerId);

    const defaultCity = "Dhaka";
    const defaultCountry = "Bangladesh";
    const defaultPostcode = "1000";

    const newOrder = new Order({
      tran_id: uId,
      transactionId: uId,
      customerName,
      customerEmail,
      customerAddress,
      customerMobile: customerMobile || "N/A",
      totalAmount,
      products,
      status: false,
      sellerIds,
      productIds,
      currency: "BDT",
      shipping_method: "Courier",
      cus_country: defaultCountry,
      ship_name: customerName,
      ship_add1: customerAddress,
      ship_city: defaultCity,
      ship_postcode: defaultPostcode,
      ship_country: defaultCountry,
      customerId,
    });

    const savedData = await newOrder.save();

    if (savedData.tran_id) {
      const id = savedData.tran_id;

      try {
        const orderData = await Order.findOne({ tran_id: id });
        if (orderData) {
          for (let product of orderData.products) {
            const qty = product.qty && !isNaN(product.qty) ? product.qty : 0;
            if (qty > 0) {
              await Product.updateOne(
                { _id: product.productId },
                { $push: { order: orderData._id }, $inc: { quantity: -qty } }
              );
            } else {
              console.error(`Invalid quantity for product ${product.productId}`);
            }   
          }

          const userUpdate = await User.updateOne(
            { _id: orderData.customerId },
            { $push: { order: orderData._id } }
          );

          // console.log("userUpdate",userUpdate)
          if (userUpdate.modifiedCount > 0) {
            return res.status(200).json({redirectUrl: `/payment/success/${uId}` });
          } else {
            return res.status(404).json({ error: "User not found or already updated" });
          }
        } else {
          return res.status(404).json({ error: "Order not found or already updated" });
        }
      } catch (error) {
        console.error("Error updating order status or product/user:", error);
        return res.status(500).json({
          error: "Failed to update order status, product, or user",
          details: error.message,
        });
      }
    }
    
    // Only this response will be sent if above condition is not met
    res.status(200).json({ message: "Order placed successfully with Cash on Delivery!" });
  } catch (error) {
    console.error("Error placing COD order:", error);
    res.status(500).json({ error: "Failed to place COD order", details: error.message });
  }
});






module.exports = router;
