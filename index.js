const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");
const notificationRoutes = require("./routes/notificationRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const commentRoutes = require("./routes/commentRoutes");
const offerBannerRoutes = require("./routes/offerBannerRoutes");
const locationRoutes = require("./routes/locationRoutes");
const paymentRoutes = require("./routes/paymentRoutes.js");
const ChatRoute = require("./routes/ChatRoute.js");
const MessageRoute = require("./routes/MessageRoute.js");
const searchRoutes = require("./routes/searchRoutes.js");
const imageRoutes = require("./routes/imageRoutes");
const taskRoutes = require('./routes/taskRoutes');
const videoRoutes = require('./routes/videoRoutes');
const storeRoutes = require('./routes/storeRoutes');

const app = express();
dotenv.config();
connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/api/notifications", notificationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use('/api/store', storeRoutes);
app.use("/api", categoryRoutes);
app.use("/api", bannerRoutes);
app.use("/api", commentRoutes);
app.use("/api", offerBannerRoutes);
app.use("/api", paymentRoutes);
app.use("/chat", ChatRoute);
app.use("/message", MessageRoute);
app.use("/api",searchRoutes);
app.use("/api/images", imageRoutes);
app.use('/api', taskRoutes);
app.use('/api', videoRoutes);


// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
