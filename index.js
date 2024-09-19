// make an array to store the memory 
let todos = [
    {
        id: 1,
        name: 'Feed Dog',
        status: 'Pending',  
        category: 'Personal',
        dueDate: 'Tonight'
    },
    {
        id: 2,
        name: 'Meet with Stakeholders',
        status: 'Done',
        category: 'Work',
        dueDate: 'Tomorrow'
    }
];

let categories = ['School', 'Work', 'Rest'];  

// add a to do
function addTodo() {
    const input = document.getElementById('todo-input');
    const newName = input.value;

    if (!newName) return;

    const newTodo = {
        id: todos.length + 1,
        name: newName,
        satus: 'Pending',
        category: 'Personal',
        dueDate: 'Pending'
    }
    todos.push(newTodo);
    input.value = '';
    renderTodos();
}

function editTodo(id, newValues) {
   
    const todo = todos.find(todo => todo.id === id);

   
    todo.name = newValues.name || todo.name;
    todo.status = newValues.status || todo.status;
    todo.category = newValues.category || todo.category;
    todo.dueDate = newValues.dueDate || todo.dueDate;

    console.log(`Your task ${id} has been successfully updated!`);
    renderTodos(); 
}



function renderTodos() {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';  

    todos.forEach(todo => {
        const todoElement = document.createElement('div');
        todoElement.classList.add('todo-item');
        todoElement.innerHTML = `
            <strong>${todo.name}</strong> - ${todo.status} - ${todo.category} - Due: ${todo.dueDate}
            <button onclick="editTodoPrompt(${todo.id})">Edit</button>
            <button onclick="deleteTodoPrompt(${todo.id})">Delete</button>
        `;
        todoList.appendChild(todoElement);
    });
}

// edit the to do //prompt makes ask the user a question
function editTodoPrompt(id) {
    const newName = prompt('Please enter your task name:');
    const newStatus = prompt('Please add your task status:');
    const newCategory = prompt('Add a new category');
    const newDueDate = prompt('Enter a due date for your task:');
    editTodo(id, {
        name: newName,
        status: newStatus,
        category: newCategory,
        dueDate: newDueDate
    });
}

// do you want to delete this task?
function deleteTodoPrompt(id) {
    if (confirm('Delete this task?')) {
        deleteTodo(id);
    }
}
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    console.log(`Todo with ID ${id} has been deleted.`);
    renderTodos();
}




renderTodos();
// this renders them 