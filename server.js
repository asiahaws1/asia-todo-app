const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();


app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));


mongoose.connect('mongodb://localhost:27017/todoapp')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));


const todoSchema = new mongoose.Schema({
    name: String,
    status: String,
    category: String,
    dueDate: String
});

const categorySchema = new mongoose.Schema({
    name: String
});

const Todo = mongoose.model('Todo', todoSchema);
const Category = mongoose.model('Category', categorySchema);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/api/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/todos', async (req, res) => {
    try {
        const newTodo = new Todo(req.body);
        await newTodo.save();
        res.json(newTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/api/todos/:id', async (req, res) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json(updatedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/todos/:id', async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        await Todo.deleteOne({ _id: req.params.id });
        res.json({ message: 'Todo deleted successfully', todo: deletedTodo });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



app.get('/api/categories/:category/todos', async (req, res) => {
    try {
        const categoryTodos = await Todo.find({ category: req.params.category });
        res.json(categoryTodos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.get('/api/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories.map(cat => cat.name));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/categories', async (req, res) => {
    try {
        if (!req.body.category) {
            return res.status(400).json({ message: 'Category name required' });
        }
        const newCategory = new Category({ name: req.body.category });
        await newCategory.save();
        res.json({ category: newCategory.name });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


app.put('/api/categories/:name', async (req, res) => {
    try {
        const oldName = req.params.name;
        const newName = req.body.category;
        const updatedCategory = await Category.findOneAndUpdate(
            { name: oldName },
            { name: newName },
            { new: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ category: updatedCategory.name });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/categories/:name', async (req, res) => {
    try {
        const deletedCategory = await Category.findOneAndDelete({ name: req.params.name });
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await Todo.deleteMany({ category: req.params.name });
        res.json({ message: 'Category deleted successfully', category: deletedCategory.name });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const PORT = 3003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}. Visit http://localhost:${PORT}`));
