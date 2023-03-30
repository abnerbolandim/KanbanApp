const btnAdicionar = document.getElementById("btnAdicionar");

btnAdicionar.addEventListener("click", function () {
	const nomeTarefa = document.getElementById("nomeTarefa").value;
	if (nomeTarefa) {
		const task = createTask(nomeTarefa);
		addTaskToColumn(task, "Fazer");
		document.getElementById("nomeTarefa").value = "";
	}
});

function createTask(nome) {
	const task = document.createElement("div");
	task.classList.add("task");
	task.setAttribute("draggable", "true");
	task.setAttribute("id", `task-${Date.now()}`);
	const taskName = nome
		.split(" ")
		.map((word) => {
			return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
		})
		.join(" "); // Transforma a primeira letra da primeira palavra em maiúscula e mantém as demais em minúsculas
	task.textContent = taskName;
	task.addEventListener("dragstart", dragstart_handler);
	task.addEventListener("dragend", dragend_handler);

	const deleteBtn = document.createElement("button");
	deleteBtn.classList.add("delete-btn");
	deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
	deleteBtn.addEventListener("click", () => task.remove());
	task.appendChild(deleteBtn);

	deleteBtn.style.border = "none";

	return task;
}

function addTaskToColumn(task, columnName) {
	const column = document.querySelector(`#${columnName} .task-list`);
	column.appendChild(task);
	if (columnName === "Fazer") {
		task.classList.add("fazer");
	}
}

function dragstart_handler(ev) {
	ev.dataTransfer.setData("text/plain", ev.target.id);
	ev.dropEffect = "move";
}

function dragend_handler(ev) {
	ev.dataTransfer.clearData();
}

const columns = document.querySelectorAll(".column");
columns.forEach((column) => {
	column.addEventListener("dragover", dragover_handler);
	column.addEventListener("drop", drop_handler);
});

function dragover_handler(ev) {
	ev.preventDefault();
	ev.dataTransfer.dropEffect = "move";
	const column = ev.target.closest(".column");
	if (column) {
		column.classList.add("over"); // Adicionar classe à coluna
	}
}

function drop_handler(ev) {
	ev.preventDefault();
	const column = ev.target.closest(".column");
	if (column) {
		column.classList.remove("over"); // Remover classe da coluna
		const taskId = ev.dataTransfer.getData("text/plain");
		const task = document.getElementById(taskId);
		const currentColumn = task.closest(".column");
		if (currentColumn !== column) {
			addTaskToColumn(task, column.id);
		}
	}
}

// Salvar as tarefas no Local Storage
function saveTasks() {
	const columns = document.querySelectorAll(".column");
	const tasks = [];
	columns.forEach((column) => {
		const taskList = column.querySelector(".task-list");
		const tasksInColumn = taskList.querySelectorAll(".task");
		tasksInColumn.forEach((task) => {
			const taskData = {
				name: task.textContent,
				column: column.id,
			};
			tasks.push(taskData);
		});
	});
	localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Carregar as tarefas salvas no Local Storage
function loadTasks() {
	const savedTasks = JSON.parse(localStorage.getItem("tasks"));
	if (savedTasks) {
		savedTasks.forEach((savedTask) => {
			const task = createTask(savedTask.name);
			addTaskToColumn(task, savedTask.column);
		});
	}
}

// Chamar a função loadTasks quando a página for carregada
window.addEventListener("load", loadTasks);

// Adicionar um event listener para chamar a função saveTasks sempre que uma tarefa for adicionada ou removida
const taskLists = document.querySelectorAll(".task-list");
taskLists.forEach((taskList) => {
	taskList.addEventListener("DOMNodeInserted", saveTasks);
	taskList.addEventListener("DOMNodeRemoved", saveTasks);
});
