//array
let todos = [];  
let categories = []; 


async function fetchInitialData() {
    const todosResponse = await fetch('http://localhost:3003/api/todos');
    todos = await todosResponse.json();
    
    const categoriesResponse = await fetch('http://localhost:3003/api/categories');
    categories = await categoriesResponse.json();
}

function renderTodos(filteredTodos = todos) {
    const todoList = document.getElementById('todo-list');
    todoList.textContent = '';

    filteredTodos.forEach(todo => {
        const todoElement = document.createElement('div');
        todoElement.classList.add('todo-item');
        todoElement.dataset.id = todo._id;  

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
        saveBtn.onclick = () => saveEdit(todo._id, nameInput, statusInput, categorySelect, dueDateInput);

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
        deleteBtn.onclick = () => deleteTodoItem(todo._id);

        const completeBtn = document.createElement('button');
        completeBtn.textContent = todo.status === 'Pending' ? 'Complete' : 'Undo';
        completeBtn.onclick = () => toggleComplete(todo._id);

        todoElement.appendChild(todoContent);
        todoElement.appendChild(editForm);
        todoElement.appendChild(editBtn);
        todoElement.appendChild(deleteBtn);
        todoElement.appendChild(completeBtn);

        todoList.appendChild(todoElement);
    });

    updateTodoCount();
}

function toggleEditForm(todoElement) {
    const editForm = todoElement.querySelector('.todo-edit-form');
    const isEditing = editForm.style.display === 'block';
    editForm.style.display = isEditing ? 'none' : 'block';

    if (!isEditing) {
        const todoId = todoElement.dataset.id;
        const todo = todos.find(todo => todo._id == todoId);
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

async function saveEdit(id, nameInput, statusInput, categorySelect, dueDateInput) {
    const updates = {
        name: nameInput.value,
        status: statusInput.value,
        category: categorySelect.value,
        dueDate: dueDateInput.value
    };

    const response = await fetch(`http://localhost:3003/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });

    const updatedTodo = await response.json();
    const index = todos.findIndex(todo => todo._id === id);
    todos[index] = updatedTodo;
    renderTodos();
}

async function deleteTodoItem(id) {
    await fetch(`http://localhost:3003/api/todos/${id}`, {
        method: 'DELETE'
    });
    todos = todos.filter(todo => todo._id !== id);
    renderTodos();
}

async function toggleComplete(id) {
    const todo = todos.find(todo => todo._id === id);
    if (todo) {
        const newStatus = todo.status === 'Pending' ? 'Completed' : 'Pending';
        const response = await fetch(`http://localhost:3003/api/todos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        const updatedTodo = await response.json();
        const index = todos.findIndex(t => t._id === id);
        todos[index] = updatedTodo;
        renderTodos();
    }
}

function updateTodoCount() {
    const pendingCount = todos.filter(todo => todo.status === 'Pending').length;
    document.getElementById('todo-count').textContent = `Todos left: ${pendingCount}`;
}

async function clearCompletedTodos() {
    const completedTodos = todos.filter(todo => todo.status === 'Completed');
    for (let todo of completedTodos) {
        await fetch(`http://localhost:3003/api/todos/${todo._id}`, {
            method: 'DELETE'
        });
    }
    todos = todos.filter(todo => todo.status === 'Pending');
    renderTodos();
}

async function addTodo() {
    const input = document.getElementById('todo-input');
    const categorySelect = document.getElementById('category-select');
    const newName = input.value;
    const selectedCategory = categorySelect.value;

    if (!newName || !selectedCategory) return;

    const newTodo = {
        name: newName,
        status: 'Pending',
        category: selectedCategory,
        dueDate: 'Add A Due Date'
    };

    const response = await fetch('http://localhost:3003/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
    });

    const savedTodo = await response.json();
    todos.push(savedTodo);
    input.value = '';
    renderTodos();
}

async function renderCategories() {
    const categoryList = document.getElementById('category-list');
    categoryList.innerHTML = '';

    categories.forEach((category) => {
        const categoryElement = document.createElement('div');
        categoryElement.classList.add('category-item');

        const categoryName = document.createElement('span');
        categoryName.textContent = category;

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => toggleEditCategory(category);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteCategory(category);

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

async function initializeApp() {
    await fetchInitialData();
    renderCategories();
    renderTodos();
}

function filterTodosByCategory(category) {
    if (category === 'All') {
        renderTodos();
    } else {
        const filteredTodos = todos.filter(todo => todo.category === category);
        renderTodos(filteredTodos);
    }
}

async function toggleEditCategory(oldCategory) {
    const categoryElement = Array.from(document.querySelectorAll('.category-item'))
        .find(el => el.querySelector('span').textContent === oldCategory);
    const categoryName = categoryElement.querySelector('span');
    const currentName = categoryName.textContent;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentName;

    input.onblur = async () => {
        const response = await fetch(`http://localhost:3003/api/categories/${currentName}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: input.value })
        });
        const data = await response.json();
        const index = categories.indexOf(currentName);
        if (index > -1) {
            categories[index] = data.category;
        }
        renderCategories();
    };

    categoryName.replaceWith(input);
    input.focus();
}

async function deleteCategory(category) {
    const response = await fetch(`http://localhost:3003/api/categories/${category}`, {
        method: 'DELETE'
    });
    const data = await response.json();
    const index = categories.indexOf(category);
    if (index > -1) {
        categories.splice(index, 1);
    }
    renderCategories();
}


document.getElementById('add-category-btn').addEventListener('click', async () => {
    const input = document.getElementById('new-category-input');
    const newCategory = input.value.trim();

    if (newCategory) {
        const response = await fetch('http://localhost:3003/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: newCategory })
        });
        const data = await response.json();
        categories.push(data.category);
        input.value = '';
        renderCategories();
    }
});

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

document.getElementById('get-categories').addEventListener('click', () => {
    console.log('GET Categories clicked!');
    fetch('http://localhost:3003/api/categories')
        .then(res => res.json())
        .then(data => {
            console.log('API Response:', data);
            document.getElementById('response-output').textContent = JSON.stringify(data, null, 2);
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

document.getElementById('post-todo').addEventListener('click', () => {
    console.log('POST Todo clicked!');
    fetch('http://localhost:3003/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

document.getElementById('post-category').addEventListener('click', () => {
    console.log('POST Category clicked!');
    fetch('http://localhost:3003/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            category: 'New Category'
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log('API Response:', data);
            document.getElementById('response-output').textContent = JSON.stringify(data, null, 2);
            renderCategories();
        });
});

document.getElementById('put-todo').addEventListener('click', () => {
    console.log('PUT Todo clicked!');
    fetch('http://localhost:3003/api/todos')
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {
                const todoId = data[0]._id;
                return fetch(`http://localhost:3003/api/todos/${todoId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'Updated Todo',
                        status: 'Completed',
                        category: 'Personal',
                        dueDate: 'Tomorrow'
                    })
                });
            }
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
    fetch('http://localhost:3003/api/categories')
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {
                return fetch(`http://localhost:3003/api/categories/${data[0]}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        category: 'Updated Category'
                    })
                });
            }
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
    fetch('http://localhost:3003/api/todos')
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {
                const todoId = data[0]._id;
                return fetch(`http://localhost:3003/api/todos/${todoId}`, {
                    method: 'DELETE'
                });
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log('API Response:', data);
            document.getElementById('response-output').textContent = JSON.stringify(data, null, 2);
            renderTodos();
        });
});

document.getElementById('delete-category').addEventListener('click', () => {
    console.log('DELETE Category clicked!');
    fetch('http://localhost:3003/api/categories')
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {
                return fetch(`http://localhost:3003/api/categories/${data[0]}`, {
                    method: 'DELETE'
                });
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log('API Response:', data);
            document.getElementById('response-output').textContent = JSON.stringify(data, null, 2);
            renderCategories();
        });
});
