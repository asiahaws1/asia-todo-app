let todos = [
    { id: 1, name: 'Feed Dog', status: 'Pending', category: 'Personal', dueDate: 'Tonight' },
    { id: 2, name: 'Meet with Stakeholders', status: 'Pending', category: 'Work', dueDate: 'Tomorrow' }
];
// array
let categories = ['Personal', 'Work']; 
//render to do function
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
}
//edit
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
//save
function saveEdit(id, nameInput, statusInput, categorySelect, dueDateInput) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.name = nameInput.value;
        todo.status = statusInput.value;
        todo.category = categorySelect.value; 
        todo.dueDate = dueDateInput.value;
    }
    renderTodos(); 
}
//delete
function deleteTodoItem(id) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
}
//complete
function toggleComplete(id) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.status = todo.status === 'Pending' ? 'Completed' : 'Pending';
    }
    renderTodos();
}
//update counter
function updateTodoCount() {
    const pendingCount = todos.filter(todo => todo.status === 'Pending').length;
    document.getElementById('todo-count').textContent = `Todos left: ${pendingCount}`;
}
// clear
function clearCompletedTodos() {
    todos = todos.filter(todo => todo.status === 'Pending');
    renderTodos(); 
}

document.getElementById('clear-completed-btn').onclick = clearCompletedTodos; 
//add to do
function addTodo() {
    const input = document.getElementById('todo-input');
    const categorySelect = document.getElementById('category-select'); 
    const newName = input.value;
    const selectedCategory = categorySelect.value; 

    if (!newName || !selectedCategory) return;

    const newTodo = {
        id: todos.length + 1,
        name: newName,
        status: 'Pending',
        category: selectedCategory,
        dueDate: 'Add A Due Date'
    };

    todos.push(newTodo);
    input.value = ''; 
    renderTodos();
}
// enter key event listener for user
document.getElementById('todo-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTodo();
    }
});

//sort by category
function filterTodosByCategory(category) {
    if (category === 'All') {
        renderTodos(todos);
    } else {
        const filteredTodos = todos.filter(todo => todo.category === category);
        renderTodos(filteredTodos);
    }
}

const categoryFilter = document.getElementById('category-filter');
categoryFilter.addEventListener('change', (event) => {
    filterTodosByCategory(event.target.value);
});

//print them categories
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
}
//add a new category
function addCategory() {
    const newCategoryInput = document.getElementById('new-category-input');
    const newCategory = newCategoryInput.value.trim();
    if (!newCategory || categories.includes(newCategory)) return;

    categories.push(newCategory);
    newCategoryInput.value = '';
    renderCategories();
    renderTodos();
}
//edit the category
function toggleEditCategory(index) {
    const newCategoryInput = document.getElementById('new-category-input');
    newCategoryInput.value = categories[index];

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.onclick = () => saveEditCategory(index);
    
    newCategoryInput.parentNode.appendChild(saveBtn);
}
//save it
function saveEditCategory(index) {
    const newCategoryInput = document.getElementById('new-category-input');
    const editedCategory = newCategoryInput.value.trim();
    if (editedCategory) {
        categories[index] = editedCategory;
        newCategoryInput.value = '';
        renderCategories();
        renderTodos();
    }
}
//delete category
function deleteCategory(index) {
    categories.splice(index, 1);
    renderCategories();
    renderTodos();
}
//render
renderTodos();
renderCategories();
