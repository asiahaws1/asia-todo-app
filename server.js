const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();


app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));


let todos = [
    { id: 1, name: 'Feed Dog', status: 'Pending', category: 'Personal', dueDate: 'Tonight' },
    { id: 2, name: 'Meet with Stakeholders', status: 'Pending', category: 'Work', dueDate: 'Tomorrow' }
];

let categories = ['Personal', 'Work'];


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/api/todos', (req, res) => {
    res.json(todos);
});

app.post('/api/todos', (req, res) => {
    const newTodo = {
        id: Date.now(),
        ...req.body
    };
    todos.push(newTodo);
    res.json(newTodo);
});

app.put('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) {
        return res.status(404).json({ message: 'Todo not found' });
    }
    todos[index] = { ...todos[index], ...req.body };
    res.json(todos[index]);
});

app.delete('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) {
        return res.status(404).json({ message: 'Todo not found' });
    }
    todos = todos.filter(todo => todo.id !== id);
    res.json({ message: 'Todo deleted successfully' });
});

app.get('/api/categories/:category/todos', (req, res) => {
    const categoryTodos = todos.filter(todo => todo.category === req.params.category);
    res.json(categoryTodos);
});


app.get('/api/categories', (req, res) => {
    res.json(categories);
});

app.post('/api/categories', (req, res) => {
    if (!req.body.category) {
        return res.status(400).json({ message: 'Need category name' });
    }
    categories.push(req.body.category);
    res.json({ category: req.body.category });
});

app.put('/api/categories/:index', (req, res) => {
    const index = parseInt(req.params.index);
    if (index >= categories.length || index < 0) {
        return res.status(404).json({ message: 'category is not found' });
    }
    if (!req.body.category) {
        return res.status(400).json({ message: 'Need category name' });
    }
    categories[index] = req.body.category;
    res.json({ category: categories[index] });
});

app.delete('/api/categories/:index', (req, res) => {
    const index = parseInt(req.params.index);
    if (index >= categories.length || index < 0) {
        return res.status(404).json({ message: 'category is not found' });
    }
    const deletedCategory = categories[index];
    categories.splice(index, 1);
    res.json({ message: 'successfully deleted category', category: deletedCategory });
});

const PORT = 3003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}. Visit http://localhost:${PORT}`));
