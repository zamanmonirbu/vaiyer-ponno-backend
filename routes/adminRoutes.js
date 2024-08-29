const express = require('express');
const router = express.Router();
const { loginAdmin, getAdmins, updateAdmin, deleteAdmin, requestAdmins, registerAdmin } = require('../controllers/adminController');



router.post('/login', loginAdmin);
router.post('/register', registerAdmin);
router.post('/', registerAdmin);
router.get('/', getAdmins);
router.get('/request', requestAdmins);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);

module.exports = router;
