const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Route to create a new task
router.post('/tasks', taskController.createTask);

// Route to get all tasks by sellerId
router.get('/tasks/:sellerId', taskController.getTasksBySeller);

// Route to delete a task by task ID
router.delete('/tasks/:id', taskController.deleteTask);

// Route to update a task by task ID
router.put('/tasks/:id', taskController.updateTask);

module.exports = router;
