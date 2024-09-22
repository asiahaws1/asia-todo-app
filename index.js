let todos = [
    { id: 1, name: 'Feed Dog', 
    status: 'Pending',
     category: 'Personal',
      dueDate: 'Tonight' },
    { id: 2, name: 'Meet with Stakeholders',
     status: 'Pending',
      category: 'Work',
       dueDate: 'Tomorrow' }
];


function renderTodos() {
    const todoList = document.getElementById('todo-list');
    todoList.textContent = ''; 

    todos.forEach(todo => {
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

        // i am using a dom element in order to do this and arrow functions
        const editForm = document.createElement('div');
        editForm.classList.add('todo-edit-form');
        editForm.style.display = 'none';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = todo.name;

        const statusInput = document.createElement('input');
        statusInput.type = 'text';
        statusInput.value = todo.status;

        const categoryInput = document.createElement('input');
        categoryInput.type = 'text';
        categoryInput.value = todo.category;

        const dueDateInput = document.createElement('input');
        dueDateInput.type = 'text';
        dueDateInput.value = todo.dueDate;

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.onclick = () => saveEdit(todo.id, nameInput, statusInput, categoryInput, dueDateInput);

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.onclick = () => toggleEditForm(todoElement);

        editForm.appendChild(nameInput);
        editForm.appendChild(statusInput);
        editForm.appendChild(categoryInput);
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


function toggleEditForm(todoElement) {
    const editForm = todoElement.querySelector('.todo-edit-form');
    const isEditing = editForm.style.display === 'block';
    editForm.style.display = isEditing ? 'none' : 'block';
}

function saveEdit(id, nameInput, statusInput, categoryInput, dueDateInput) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.name = nameInput.value;
        todo.status = statusInput.value;
        todo.category = categoryInput.value;
        todo.dueDate = dueDateInput.value;
    }
    renderTodos(); 
}


function deleteTodoItem(id) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
}

function toggleComplete(id) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.status = todo.status === 'Pending' ? 'Completed' : 'Pending';
    }
    renderTodos();
}

function updateTodoCount() {
    const pendingCount = todos.filter(todo => todo.status === 'Pending').length;
    document.getElementById('todo-count').textContent = `Todos left: ${pendingCount}`;
}

function clearCompletedTodos() {
    todos = todos.filter(todo => todo.status === 'Pending');
    renderTodos();
}




function addTodo() {
    const input = document.getElementById('todo-input');
    const newName = input.value;
    if (!newName) return;

    const newTodo = {
        id: todos.length + 1,
        name: newName,
        status: 'Pending',
        category: 'Personal',
        dueDate: 'Add A Due Date'
    };

    todos.push(newTodo);
    input.value = ''; 
    renderTodos();

    document.getElementById('todo-input').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTodo();
        }
    });
    
}
// this renders them
renderTodos();
