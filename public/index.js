//array
let todos = JSON.parse(localStorage.getItem('todos')) || [
    { id: 1, name: 'Feed Dog', status: 'Pending', category: 'Personal', dueDate: 'Tonight' },
    { id: 2, name: 'Meet with Stakeholders', status: 'Pending', category: 'Work', dueDate: 'Tomorrow' }
];

let categories = JSON.parse(localStorage.getItem('categories')) || ['Personal', 'Work'];

function saveTodosToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function saveCategoriesToLocalStorage() {
    localStorage.setItem('categories', JSON.stringify(categories));
}

function renderTodos(filteredTodos = todos) {
    const todoList = document.getElementById('todo-list');
    todoList.textContent = '';

    filteredTodos.forEach(todo => {
        const todoElement = document.createElement('div');
        todoElement.classList.add('todo-item');
        todoElement.dataset.id = todo.id;

        const todoContent = document.createElement('div');
        todoContent.classList.add('todo-content');

        const todoName = document.createElement('strong');
        todoName.textContent = todo.name;

        const todoDetails = document.createElement('span');
        todoDetails.textContent = ` - ${todo.status} - ${todo.category} - Due: ${todo.dueDate}`;

        todoContent.appendChild(todoName);
        todoContent.appendChild(todoDetails);

        const editForm = document.createElement('div');
        editForm.classList.add('todo-edit-form');
        editForm.style.display = 'none';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Edit name';

        const statusInput = document.createElement('input');
        statusInput.type = 'text';
        statusInput.placeholder = 'Edit status';

        const dueDateInput = document.createElement('input');
        dueDateInput.type = 'text';
        dueDateInput.placeholder = 'Edit due date';

        const categorySelect = document.createElement('select');
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            if (cat === todo.category) option.selected = true;
            categorySelect.appendChild(option);
        });

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.onclick = () => saveEdit(todo.id, nameInput, statusInput, categorySelect, dueDateInput);

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.onclick = () => toggleEditForm(todoElement);

        editForm.appendChild(nameInput);
        editForm.appendChild(statusInput);
        editForm.appendChild(categorySelect);
        editForm.appendChild(dueDateInput);
        editForm.appendChild(saveBtn);
        editForm.appendChild(cancelBtn);

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => toggleEditForm(todoElement);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteTodoItem(todo.id);

        const completeBtn = document.createElement('button');
        completeBtn.textContent = todo.status === 'Pending' ? 'Complete' : 'Undo';
        completeBtn.onclick = () => toggleComplete(todo.id);

        todoElement.appendChild(todoContent);
        todoElement.appendChild(editForm);
        todoElement.appendChild(editBtn);
        todoElement.appendChild(deleteBtn);
        todoElement.appendChild(completeBtn);

        todoList.appendChild(todoElement);
    });

    updateTodoCount();
    saveTodosToLocalStorage();
}


function toggleEditForm(todoElement) {
    const editForm = todoElement.querySelector('.todo-edit-form');
    const isEditing = editForm.style.display === 'block';
    editForm.style.display = isEditing ? 'none' : 'block';

    if (!isEditing) {
        const todoId = todoElement.dataset.id;
        const todo = todos.find(todo => todo.id == todoId);
        if (todo) {
            const nameInput = editForm.querySelector('input[type="text"]');
            const statusInput = editForm.querySelectorAll('input[type="text"]')[1];
            const dueDateInput = editForm.querySelectorAll('input[type="text"]')[2];
            const categorySelect = editForm.querySelector('select');

            nameInput.value = todo.name;
            statusInput.value = todo.status;
            dueDateInput.value = todo.dueDate;
            categorySelect.value = todo.category;
        }
    }
}


function saveEdit(id, nameInput, statusInput, categorySelect, dueDateInput) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.name = nameInput.value;
        todo.status = statusInput.value;
        todo.category = categorySelect.value;
        todo.dueDate = dueDateInput.value;
        saveTodosToLocalStorage();
    }
    renderTodos();
}


function deleteTodoItem(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodosToLocalStorage();
    renderTodos();
}


function toggleComplete(id) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.status = todo.status === 'Pending' ? 'Completed' : 'Pending';
        saveTodosToLocalStorage();
    }
    renderTodos();
}

function updateTodoCount() {
    const pendingCount = todos.filter(todo => todo.status === 'Pending').length;
    document.getElementById('todo-count').textContent = `Todos left: ${pendingCount}`;
}

function clearCompletedTodos() {
    todos = todos.filter(todo => todo.status === 'Pending');
    saveTodosToLocalStorage();
    renderTodos();
}


function addTodo() {
    const input = document.getElementById('todo-input');
    const categorySelect = document.getElementById('category-select');
    const newName = input.value;
    const selectedCategory = categorySelect.value;

    if (!newName || !selectedCategory) return;

    const newTodo = {
        id: Date.now(),
        name: newName,
        status: 'Pending',
        category: selectedCategory,
        dueDate: 'Add A Due Date'
    };

    todos.push(newTodo);
    saveTodosToLocalStorage();
    input.value = '';
    renderTodos();
}


function renderCategories() {
    const categoryList = document.getElementById('category-list');
    categoryList.innerHTML = '';

    categories.forEach((category, index) => {
        const categoryElement = document.createElement('div');
        categoryElement.classList.add('category-item');

        const categoryName = document.createElement('span');
        categoryName.textContent = category;

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => toggleEditCategory(index);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteCategory(index);

        categoryElement.appendChild(categoryName);
        categoryElement.appendChild(editBtn);
        categoryElement.appendChild(deleteBtn);
        categoryList.appendChild(categoryElement);
    });

    updateCategorySelects();
}

function updateCategorySelects() {
    const categoryFilter = document.getElementById('category-filter');
    const categorySelect = document.getElementById('category-select');
    
    categoryFilter.innerHTML = '<option value="All">All</option>';
    categorySelect.innerHTML = '';
    
    categories.forEach(category => {
        const filterOption = document.createElement('option');
        filterOption.value = category;
        filterOption.textContent = category;
        categoryFilter.appendChild(filterOption);

        const selectOption = document.createElement('option');
        selectOption.value = category;
        selectOption.textContent = category;
        categorySelect.appendChild(selectOption);
    });
}

document.getElementById('add-todo-btn').addEventListener('click', () => {
    addTodo();
});

document.getElementById('clear-completed-btn').addEventListener('click', () => {
    clearCompletedTodos();
});

document.getElementById('todo-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTodo();
    }
});

document.getElementById('category-filter').addEventListener('change', (event) => {
    filterTodosByCategory(event.target.value);
});


function initializeApp() {
    renderCategories();
    renderTodos();
}


document.addEventListener('DOMContentLoaded', initializeApp);


document.getElementById('get-todos').addEventListener('click', () => {
    console.log('GET Todos clicked!');
    fetch('http://localhost:3003/api/todos')
        .then(res => res.json())
        .then(data => {
            console.log('API Response:', data);
            document.getElementById('response-output').textContent = JSON.stringify(data, null, 2);
        });
});

document.getElementById('post-todo').addEventListener('click', () => {
    console.log('POST Todo clicked!');
    fetch('http://localhost:3003/api/todos', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: 'New Todo',
            status: 'Pending',
            category: 'Personal',
            dueDate: 'Today'
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log('API Response:', data);
            document.getElementById('response-output').textContent = JSON.stringify(data, null, 2);
            renderTodos();
        });
});

document.getElementById('put-category').addEventListener('click', () => {
    console.log('PUT Category clicked!');
    fetch('http://localhost:3003/api/categories/0', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            category: 'Updated Category'  
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log('API Response:', data);
        document.getElementById('response-output').textContent = JSON.stringify(data, null, 2);
        renderCategories();
    });
});


document.getElementById('delete-todo').addEventListener('click', () => {
    console.log('DELETE Todo clicked!');
    fetch('http://localhost:3003/api/todos/1', {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(data => {
            console.log('API Response:', data);
            document.getElementById('response-output').textContent = JSON.stringify(data, null, 2);
            renderTodos();
        });
});

document.getElementById('get-category-todos').addEventListener('click', () => {
    console.log('GET Category Todos clicked!');
    fetch('http://localhost:3003/api/categories/Personal/todos')
        .then(res => res.json())
        .then(data => {
            console.log('API Response:', data);
            document.getElementById('response-output').textContent = JSON.stringify(data, null, 2);
        });
});

document.getElementById('get-categories').addEventListener('click', () => {
    console.log('GET Categories clicked!');
    fetch('http://localhost:3003/api/categories')
        .then(res => res.json())
        .then(data => {
            console.log('API Response:', data);
            document.getElementById('response-output').textContent = JSON.stringify(data, null, 2);
        });
});

document.getElementById('post-category').addEventListener('click', () => {
    console.log('POST Category clicked!');
    fetch('http://localhost:3003/api/categories', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: 'New Category'
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log('API Response:', data);
            document.getElementById('response-output').textContent = JSON.stringify(data, null, 2);
            renderCategories();
        });
});

document.getElementById('put-category').addEventListener('click', () => {
    console.log('PUT Category clicked!');
    fetch('http://localhost:3003/api/categories/0', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: 'Updated Category'
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log('API Response:', data);
            document.getElementById('response-output').textContent = JSON.stringify(data, null, 2);
            renderCategories();
        });
});

document.getElementById('delete-category').addEventListener('click', () => {
    console.log('DELETE Category clicked!');
    fetch('http://localhost:3003/api/categories/0', {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(data => {
            console.log('API Response:', data);
            document.getElementById('response-output').textContent = JSON.stringify(data, null, 2);
            renderCategories();
        });
});
