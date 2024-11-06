const Task = require('../models/Task.js');

// Controller to create a new task
exports.createTask = async (req, res) => {
  const { title, description, time, sellerId } = req.body;
  try {
    const task = await Task.create({ title, description, time, sellerId });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controller to get tasks by sellerId
exports.getTasksBySeller = async (req, res) => {
  const { sellerId } = req.params;
  try {
    const tasks = await Task.find({ sellerId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controller to delete a task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controller to update a task
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, time } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, time },
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
