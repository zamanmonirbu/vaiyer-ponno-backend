const express = require('express');
const router = express.Router();
const { loginAdmin, getAdmins, updateAdmin, deleteAdmin, requestAdmins, registerAdmin, getAdminById } = require('../controllers/adminController');



router.get('/request', requestAdmins);
router.get('/:id', getAdminById);
router.get('/', getAdmins);
router.post('/login', loginAdmin);
router.post('/register', registerAdmin);
router.post('/', registerAdmin);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);

module.exports = router;
