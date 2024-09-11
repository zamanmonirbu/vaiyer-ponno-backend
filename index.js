const express = require('express');
const dotenv = require('dotenv');
const cors=require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const notificationRoutes = require('./routes/notificationRoutes');
const passwordRecoveryRoutes = require('./routes/passwordRecoveryRoutes');
const categoryRoutes = require("./routes/categoryRoutes");
const bannerRoutes = require('./routes/bannerRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const commentRoutes = require("./routes/commentRoutes");
const offerBannerRoutes=require("./routes/offerBannerRoutes")
const locationRoutes = require('./routes/locationRoutes');


dotenv.config();


connectDB();

const app = express();

app.use(express.json());
app.use(cors())

// Routes
app.use('/api/notifications', notificationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api', passwordRecoveryRoutes);
app.use("/api", categoryRoutes);
app.use('/api', bannerRoutes);
app.use("/api", commentRoutes);
app.use("/api/offer/banners",offerBannerRoutes);





// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
