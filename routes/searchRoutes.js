const express = require('express');
const { searchAll } = require('../controllers/searchController');
const router = express.Router();

// Search route for User, Seller, and Admin by name
router.get('/search', searchAll);

module.exports = router;
