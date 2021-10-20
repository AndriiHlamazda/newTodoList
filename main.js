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
            <span data-id="${t.id}" class="task-title ${t.completed ? 'description-completed' : ''}" contentEditable="${t.contentEditable}">${t.description}</span>
        </div>
        <i class="material-icons" data-id="${t.id}">clear</i>
    </li>
   `;
};

let taskList = [];
const inp = document.querySelector('#todos');
let indexForTask;
const modal = document.querySelector('.modal');

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
      contentEditable: false,
    };
    taskList.unshift(newTask);
    inp.value = '';
    renderTasks(taskList);
  }
}
function renderTasks(localTasks = []) {
  const $tasks = document.querySelector('#active');
  const compTask = document.querySelector('#comp');
  if (localTasks.length >= 0 ) {
    const activeTask = taskList.filter(task => !task.completed);
    if (activeTask.length >= 0){
      $tasks.innerHTML = activeTask.map(t => card(t)).join(' ');
  //    counter();
      interestDoneTask();
      testHash();
    }
    const cTask = taskList.filter(task => task.completed);
    if (cTask.length >= 0) {
      compTask.innerHTML = cTask.map(t => card(t)).join(' ');
 //     counter();
      interestDoneTask();
      testHash();
    }
  }
}
function onEditingTask(e) {
  if (e.target.tagName === 'SPAN') {
    const id = e.target.getAttribute('data-id');
    const i = taskList.findIndex(t => t.id === +id);
    if (i !== -1) {
      taskList[i].contentEditable = "true";
    }
  }
  renderTasks(taskList);
  const focusTask = document.querySelector('span[contentEditable="true"]');
  focusTask.focus();
  document.getSelection().setBaseAndExtent(focusTask, 0, focusTask, focusTask.childNodes.length);
  focusTask.addEventListener('keypress', enterEditingTask);
  focusTask.addEventListener('focusout', function (e) {
    const focusTask = document.querySelector('span[contentEditable="true"]');
    const id = e.target.getAttribute('data-id');
    const i = taskList.findIndex(t => t.id === +id);
    if (i !== -1) {
      taskList[i].description = focusTask.innerHTML;
      taskList[i].contentEditable = "false";
    }
    renderTasks(taskList);

  });
}
   function enterEditingTask(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const focusTask = document.querySelector('span[contentEditable="true"]');
        const id = event.target.getAttribute('data-id');
        const i = taskList.findIndex(t => t.id === +id);
        if (i !== -1) {
          taskList[i].description = focusTask.innerHTML;
          taskList[i].contentEditable = "false";
        }
        renderTasks(taskList);
      }


  }
function checkCompleteField(e) {
  if (e.target.tagName === 'I') {
    onDeleteTask(e);
  }
  if (e.target.tagName === 'INPUT') {
    ofCompleteTask(e);
  }
}
function ofCompleteTask(e) {
  const id = e.target.getAttribute('data-id');
  const i = taskList.findIndex(t => t.id === +id);
  if (i !== -1) {
    taskList[i].completed = false;
  }
  renderTasks(taskList);
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
  const text = document.querySelector('.modal__text');
  const id = e.target.getAttribute('data-id');
  indexForTask = taskList.findIndex((t) => t.id === +id);
  if (indexForTask !== -1) {
    modal.classList.add("open");
    text.innerHTML = (`Are you sure you want to delete task "${taskList[indexForTask].description}" ?`);
  }
}
function DeleteTask(){
      taskList.splice(indexForTask, 1);
      renderTasks(taskList);
      modal.classList.remove("open");
}
function noDeleteTask() {
  modal.classList.remove("open");
}
// function sortingAllToDo() {
//   renderTasks(taskList);
 //}
function utf8_to_b64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}
function testHash() {
  const stringTask = JSON.stringify(taskList);
  const codeTask = utf8_to_b64(stringTask);
  window.location.hash = '#' + codeTask;
}
function b64_to_utf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}
function renderHash() {
  const h = window.location.hash;
  if (h.length !== 0) {
    const h2 = h.substring(1);
    const hash = b64_to_utf8(h2);
    taskList = JSON.parse(hash);
    const i = taskList.findIndex(t => t.contentEditable === 'true');
    if (i !== -1) {
      taskList[i].contentEditable = false;
    }
    renderTasks(taskList);
  }
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
  const interestDoneTask = () => {
    const cTask = taskList.filter(task => task.completed);
    const count = document.getElementById('todosLeft');
    const interest = Math.floor(cTask.length / taskList.length * 100);
    if (taskList.length !== 0) {
    count.innerText = `${cTask.length} / ${taskList.length} ( ${interest}% done) `;
  } else { count.innerText = ``;
    }
  }
 /*(active task account function)
 const counter = () => {
   const tasksCounter =  taskList.filter(task=> !task.completed);
   const count = document.getElementById('todosLeft');
   const counterString = tasksCounter.length === 1 ? 'task' : 'tasks';
   count.innerText = `${tasksCounter.length} ${counterString} left`;
} */

document.addEventListener('DOMContentLoaded', () => {
  inp.addEventListener('keyup', onCreateTask);
  document.querySelector('.todo-list').addEventListener('click', checkClickField);
  document.querySelector('.todo-list').addEventListener('dblclick', onEditingTask );
  document.querySelector('#comp').addEventListener('click', checkCompleteField);
  document.querySelector('.AllClear').addEventListener('click', AllClearTasks);
 // document.getElementById('itemAll').addEventListener('click', sortingAllToDo);
  document.getElementById('itemActive').addEventListener('click', sortingActiveToDo);
  document.getElementById('itemCompleted').addEventListener('click', sortingCompToDo);
  document.getElementById('itemAlphabet').addEventListener('click', sortingAlphabet);
  document.getElementById('yes').addEventListener('click', DeleteTask);
  document.getElementById('no').addEventListener('click', noDeleteTask);
  renderHash()
});
