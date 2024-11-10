# Vaiyer Ponno - Backend

[Live Link](https://vaiyer-ponno-client.vercel.app/) |  [Front-end Code](https://github.com/zamanmonirbu/vaiyer-ponno-client.git) | [Socket Code](https://github.com/zamanmonirbu/vaiyer-ponno-socket) | [Demo Video](https://youtu.be/xU94ACV-VyQ)

---

## Backend Code Overview

This backend application is built with **Express** and connects to a **MongoDB** database. Key features include user authentication, data management for products and categories, real-time chat and notifications, and payment processing with secure token handling. The backend also includes middleware for error handling and structured API routing for ease of expansion.

## Key Technologies Used

- **Express** - Fast, minimal framework for building web servers in Node.js.
- **MongoDB & Mongoose** - NoSQL database with Mongoose for data modeling.
- **Socket.IO** - Real-time, bi-directional communication for chat and notifications.
- **JWT** - JSON Web Tokens for secure user authentication.
- **Bcrypt** - Password hashing for secure user authentication.
- **Multer** - Handles file uploads (e.g., product images).
- **Dotenv** - Manages environment variables.
- **CORS** - Middleware for Cross-Origin Resource Sharing.
- **cookie-parser** - Manages cookies for user sessions.
- **SSLCommerz** - Payment gateway integration for secure transactions.

## API Endpoints

Here’s an overview of the main API endpoints in Vaiyer Ponno's backend:

### Authentication & Users
- `/api/auth` - Manages user authentication and registration.
- `/api/users` - Manages user profiles, including updates and fetching details.

### Product & Vendor Management
- `/api/products` - Manages product information, updates, and listings.
- `/api/seller` - Manages vendor-specific data and settings.
- `/api/gallery` - Manages media uploads and product images.
- `/api/categories` - Handles product categories.
- `/api/banners` - Manages banners for the storefront.
  
### Orders & Payments
- `/api/orders` - Manages order creation, tracking, and fulfillment.
- `/api/payment` - Handles secure payment transactions via SSLCommerz.

### Notifications & Real-time Chat
- `/api/notifications` - Handles notifications for user actions and interactions.
- `/chat` - Manages real-time chat sessions.
- `/message` - Manages chat messages.

### Admin & Task Management
- `/api/admin` - Handles admin-specific functions and settings.
- `/api/task` - Task management for platform activities.

### Search & Images
- `/api/search` - Handles product and vendor search functionality.
- `/api/images` - Manages image storage and retrieval.
- `/api/video` - Video management and storage for media content.

### Location & Regions
- `/api/location` - Supports location-based data for region-specific shopping.

## Environment Variables

The backend uses **dotenv** to manage environment variables. Ensure that the following environment variables are set in your `.env` file:

```env
MONGO_URI=
PORT=
NODE_ENV=
JWT_SECRET=
JWT_REFRESH_SECRET=
GEMINAI_API_KEY=
YOUTUBE_API_KEY=
CLIENT_ID=
CLIENT_SECRET=
REDIRECT_URI=
REFRESH_TOKEN=
CLIENT_ID=
Store_ID=
Store_Password=
```

   
## Login Credentials

To access different roles within the platform, use the following credentials:

- **User Login**: 
  - Email: `user@gmail.com` 
  - Password: `user@gmail.com`

- **Seller Login**: 
  - Email: `seller@gmail.com`
  - Password: `seller@gmail.com`

- **Admin Login**: 
  - Email: `admin@gmail.com` 
  - Password: `admin@gmail.com`


    ## Getting Started

    ### Installation

    1. **Clone the repository**:
        ```bash
        git clone https://github.com/zamanmonirbu/vaiyer-ponno-backend.git
        cd vaiyer-ponno-backend
        ```

    2. **Install dependencies**:
        ```bash
        npm install
        ````

    4. **Run the application**:
        ```bash
        npm start



    ## Contributing

    Contributions are welcome! Please fork the repository and submit a pull request. For any issues or suggestions, feel free to open an issue.

    ## Connect with Me

    You can connect with me through the following platforms:

    - **Email:** [monir.cse6.bu@gmail.com](mailto:monir.cse6.bu@gmail.com)
    - **GitHub:** [![GitHub Icon](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/zamanmonirbu)
    - **LinkedIn:** [![LinkedIn Icon](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mdmoniruzzamanbu/)
    - **Codeforces:** [![Codeforces Icon](https://img.shields.io/badge/Codeforces-00FF00?style=for-the-badge&logo=codeforces&logoColor=white)](https://codeforces.com/profile/ZaMo)
    - **LeetCode:** [![LeetCode Icon](https://img.shields.io/badge/LeetCode-FFA116?style=for-the-badge&logo=leetcode&logoColor=white)](https://leetcode.com/u/moniruzzamancse6/)
    - **Portfolio:** [![Portfolio Icon](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=codeforces&logoColor=white)](https://moniruzzamanbu.netlify.app/)
    - **Medium:** [![Medium Icon](https://img.shields.io/badge/Medium-12100E?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@zamanmonirbu)

    Feel free to reach out or connect for collaborations, suggestions, or just to chat about technology!

