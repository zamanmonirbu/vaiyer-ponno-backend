const SSLCommerzPayment = require("sslcommerz-lts");
const store_id = process.env.Store_ID;
const store_passwd = process.env.Store_Password;
const is_live = false;

//sslcommerz init
app.get("/api/payment", (req, res) => {
  console.log(req.body);

 
});
