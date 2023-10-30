const todoFormElement = document.querySelector("#todo-management form");
const todoListElement = document.getElementById("todos-list");
let editedTodoElement;

async function loadTodos() {
    try {
        const response = await fetch("http://localhost:4000/todos");
        if (!response.ok) {
            throw new Error("Something Went Wrong");
        }
        const responseData = await response.json();
        const todos = responseData.todos;
        todos.forEach((todo) => createTodoListItem(todo.text, todo.id.toString()));
    } catch (error) {
        alert(error.message);
    }
}

function createTodoListItem(todoText, todoId) {
    const newTodoItemElement = document.createElement("li");
    newTodoItemElement.dataset.id = todoId;

    const todoTextElement = document.createElement("p");
    todoTextElement.textContent = todoText;

    const editTodoButtonElement = createButton("Edit", startTodoEditing);
    const deleteTodoButtonElement = createButton("Delete", deleteTodo);

    const todoActionsWrapperElement = document.createElement("div");
    todoActionsWrapperElement.appendChild(editTodoButtonElement);
    todoActionsWrapperElement.appendChild(deleteTodoButtonElement);

    newTodoItemElement.appendChild(todoTextElement);
    newTodoItemElement.appendChild(todoActionsWrapperElement);

    todoListElement.appendChild(newTodoItemElement);
}

async function createTodo(todoText) {
    try {
        const response = await fetch("http://localhost:4000/todos", {
            method: "POST",
            body: JSON.stringify({ text: todoText }),
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
            throw new Error("Something Went Wrong");
        }
        const responseData = await response.json();
        console.log(responseData); // Check the response data in the console
        createTodoListItem(todoText, responseData.id); // Update this line
    } catch (error) {
        alert(error.message);
    }
}




async function updateTodo(newTodoText) {
    const todoId = editedTodoElement.dataset.id;
    try {
        const response = await fetch(`http://localhost:4000/todos/${todoId}`, {
            method: "PATCH",
            body: JSON.stringify({ newText: newTodoText }),
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
            throw new Error("Something Went Wrong");
        }
        editedTodoElement.firstElementChild.textContent = newTodoText;
        editedTodoElement = null;
    } catch (error) {
        alert(error.message);
    }
}

async function deleteTodo(event) {
    const clickedButtonElement = event.target;
    const todoElement = clickedButtonElement.parentElement.parentElement;
    const todoId = todoElement.dataset.id;
    try {
        const response = await fetch(`http://localhost:4000/todos/${todoId}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Something Went Wrong");
        }
        todoElement.remove();
    } catch (error) {
        alert(error.message);
    }
}

function saveTodo(event) {
    event.preventDefault();
    const formInput = new FormData(event.target);
    const enteredTodoText = formInput.get("text");

    if (!editedTodoElement) {
        createTodo(enteredTodoText);
    } else {
        updateTodo(enteredTodoText);
    }
}

function startTodoEditing(event) {
    const clickedButtonElement = event.target;
    editedTodoElement = clickedButtonElement.parentElement.parentElement;
    const currentText = editedTodoElement.firstElementChild.textContent;
    todoFormElement.querySelector("input").value = currentText;
}

function createButton(label, clickHandler) {
    const buttonElement = document.createElement("button");
    buttonElement.textContent = label;
    buttonElement.addEventListener("click", clickHandler);
    return buttonElement;
}

todoFormElement.addEventListener("submit", saveTodo);
loadTodos();
