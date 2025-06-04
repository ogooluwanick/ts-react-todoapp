const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const { protect } = require('../middleware/authMiddleware');

// All routes here are protected
router.use(protect);

// GET /api/todos - Get all todos for the logged-in user
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(todos);
    } catch (error) {
        console.error('Get Todos error:', error.message);
        res.status(500).json({ message: 'Server error while fetching todos' });
    }
});

// POST /api/todos - Create a new todo
router.post('/', async (req, res) => {
    try {
        const { task, isDone } = req.body;
        if (!task) {
            return res.status(400).json({ message: 'Task description is required' });
        }

        const newTodo = new Todo({
            task,
            isDone: isDone || false,
            user: req.user.id
        });

        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (error) {
        console.error('Create Todo error:', error.message);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error while creating todo' });
    }
});

// PUT /api/todos/:id - Update a todo
router.put('/:id', async (req, res) => {
    try {
        const { task, isDone } = req.body;
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        // Check if the todo belongs to the user
        if (todo.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to update this todo' });
        }

        if (task !== undefined) todo.task = task;
        if (isDone !== undefined) todo.isDone = isDone;

        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    } catch (error) {
        console.error('Update Todo error:', error.message);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Todo not found (invalid ID format)' });
        }
        res.status(500).json({ message: 'Server error while updating todo' });
    }
});

// DELETE /api/todos/:id - Delete a todo
router.delete('/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        // Check if the todo belongs to the user
        if (todo.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to delete this todo' });
        }

        await todo.deleteOne(); // Changed from todo.remove() which is deprecated
        res.json({ message: 'Todo removed successfully' });
    } catch (error) {
        console.error('Delete Todo error:', error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Todo not found (invalid ID format)' });
        }
        res.status(500).json({ message: 'Server error while deleting todo' });
    }
});

module.exports = router;
