
const card = (t) => {
  return `
   <li data-id="${t.id}" class="line">
        <div class="line2">
          <input
            type="checkbox"
            ${t.completed ? 'checked' : ''}
            class="tick"
            data-id="${t.id}"
            >
            <span class="${t.completed ? 'description-completed' : ''}">${t.description}</span>
        </div>
        <i class="material-icons" data-id="${t.id}">clear</i>
    </li>
   `;
};

let taskList = [];
const inp = document.querySelector('#todos');

function onCreateTask(event) {
  if (event.key !== 'Enter') {
    return;
  }
  const inputTask = inp.value;
  if (inputTask) {
    const newTask = {
      description: inputTask,
      id: Date.now(),
      completed: false,
    };
    taskList.unshift(newTask);
    inp.value = '';
    renderTasks(taskList);
  }
}
function renderTasks(localTasks = []) {
  const $tasks = document.querySelector('.todo-list');
  if (localTasks.length >= 0) {
    $tasks.innerHTML = localTasks.map(t => card(t)).join(' ');
    counter();
  }
}
function checkClickField(e) {
  if (e.target.tagName === 'INPUT') {
    onCompleteTask(e);
  }
  if (e.target.tagName === 'I') {
    onDeleteTask(e);
  }
}
function onCompleteTask(e) {
  const id = e.target.getAttribute('data-id');
  const i = taskList.findIndex(t => t.id === +id);
  if (i !== -1) {
    taskList[i].completed = true;
  }
  const ic = taskList.findIndex(t => t.completed === true);
  if (ic !== -1) {
    const comp = taskList.splice(ic, 1);
    taskList.push(comp[0]);
  }
  renderTasks(taskList);
}
function onDeleteTask(e) {
  const id = e.target.getAttribute('data-id');
  const i = taskList.findIndex((t) => t.id === +id);
  if (i !== -1) {
    taskList.splice(i, 1);
    renderTasks(taskList);
  }
}
 function sortingAllToDo() {
   renderTasks(taskList);
 }

function sortingActiveToDo() {
  const ActiveToDo = taskList.filter(task => !task.completed);
  if (ActiveToDo.length !== 0) {
    renderTasks(ActiveToDo);
  } else {
    renderTasks([]);
    let ul = document.querySelector('.todo-list');
    let li = document.createElement('li');
    li.className = 'lineTask';
    li.innerHTML = 'There are no active tasks';
    ul.append(li);
   }
}
function sortingCompToDo() {
  const CompToDo = taskList.filter(task=> task.completed);
  if (CompToDo.length !== 0) {
  renderTasks(CompToDo);
} else {
    renderTasks([]);
    let ul = document.querySelector('.todo-list');
    let li = document.createElement('li');
    li.className = 'lineTask';
    li.innerHTML = 'No completed tasks';
    ul.append(li);
  }
}
function AllClearTasks() {
  taskList = taskList.filter(task => {return !task.completed});
  renderTasks(taskList);
}
function sortingAlphabet() {
  let alphaTask = taskList.sort(function (a,b) {
    let alc = a.description.toLowerCase(), blc = b.description.toLowerCase();
    return alc > blc ? 1 : alc < blc ? -1 : 0;
  });
  alphaTask = alphaTask.sort(function (a,b) {
    return a.completed - b.completed;
  });
  renderTasks(alphaTask);
}
const counter = () => {
   const tasksCounter =  taskList.filter(task=> !task.completed);
   const count = document.getElementById('todosLeft');
   const counterString = tasksCounter.length === 1 ? 'task' : 'tasks';
   count.innerText = `${tasksCounter.length} ${counterString} left`;
}

document.addEventListener('DOMContentLoaded', () => {
  inp.addEventListener('keyup', onCreateTask);
  document.querySelector('.todo-list').addEventListener('click', checkClickField);
  document.querySelector('.AllClear').addEventListener('click', AllClearTasks);
  document.getElementById('itemAll').addEventListener('click', sortingAllToDo);
  document.getElementById('itemActive').addEventListener('click', sortingActiveToDo);
  document.getElementById('itemCompleted').addEventListener('click', sortingCompToDo);
  document.getElementById('itemAlphabet').addEventListener('click', sortingAlphabet);

});
