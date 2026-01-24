const todoInput = document.querySelector(".TodoInput");
const todoAdd = document.querySelector(".TodoAdd");
const activeBtn = document.querySelector(".Active");
const completedBtn = document.querySelector(".Completed");
const allBtn = document.querySelector(".All");
const itemsLeft = document.querySelector(".ItemsLeft");
const clearCompleted = document.querySelector(".Clear");

//1.) capturing the task and setting enter key part
todoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTodo();
  }
});
let filter = "all"; // default filter

const todos = [];
loadTodos();
renderTodos();

// 2.) adding the task to the list part
//functions
function addTodo() {
  const value = todoInput.value.trim();
  if (value === "") return;
  todos.push({ text: value, completed: false });
  todoInput.value = "";
  renderTodos();
}

// 3.) rendering the task to the list part
function renderTodos() {
  const todoList = document.querySelector(".TodoList");
  todoList.innerHTML = "";
  todos
    // 6.)
    .filter((todo) => {
      if (filter === "completed") return todo.completed;
      if (filter === "all") return true;
      if (filter === "active") return !todo.completed;
    })
    .forEach((todo) => {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;
      // Toggling the completed status
      const li = document.createElement("li");
      const span = document.createElement("span");
      span.textContent = todo.text;
      const btn = document.createElement("button");
      btn.textContent = "Delete";
      btn.classList.add("delete-btn");
      li.append(checkbox, span, btn);
      todoList.appendChild(li);

      checkbox.addEventListener("change", () => {
        todo.completed = checkbox.checked;

        if (todo.completed) {
          li.classList.add("removing");
          li.addEventListener(
            "transitionend",
            () => {
              filter = "active";
              renderTodos();
            },
            { once: true },
          );
        } else {
          renderTodos();
        }
      });

      btn.addEventListener("click", () => {
        const index = todos.indexOf(todo);
        todos.splice(index, 1);
        renderTodos();
      });
    });
  itemsLeft.textContent = `Items left: ${todos.filter((todo) => !todo.completed).length}`;

  saveTodos();
}
// 4.) // setting up filters part
function filterType(type) {
  filter = type;
  renderTodos();
}

// 5.)evetn listeners for dynamically created elements

// Delete button functionality
todoAdd.addEventListener("click", addTodo);

allBtn.addEventListener("click", () => filterType("all"));
activeBtn.addEventListener("click", () => filterType("active"));
completedBtn.addEventListener("click", () => filterType("completed"));
clearCompleted.addEventListener("click", () => {
  for (let i = todos.length - 1; i >= 0; i--) {
    //backwrards loop to avoid index issues
    if (todos[i].completed) {
      todos.splice(i, 1);
    }
  }
  renderTodos();
});

function saveTodos() {
  if (todos.length === 0) localStorage.removeItem("todos");
  else localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  const savedTodos = localStorage.getItem("todos");
  if (savedTodos) {
    todos.push(...JSON.parse(savedTodos));
  }
}
