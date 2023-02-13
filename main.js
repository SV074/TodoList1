let nameTask = document.querySelector('.field-task1');
let infoTask = document.querySelector('.field-task2');
let btnAddTask = document.querySelector('.enter');
const check = document.querySelector('.check');
let list = document.querySelector('.list');
let completedList = document.querySelector('.list-important');
let btnClose = document.querySelectorAll('.close-btn');
let bntClearTask = document.querySelector('.clear-tasks');
let myModal = document.getElementById('.exampleModal');
let counter = document.querySelector('.counter');


let toDoList = [];
let toDoListDone = [];

renderTasks();
renderTasksDone();
emptyTodoList();

let click = 0;

function countClick() {
    counter.innerHTML = ++click;
};

//Добавление задачи
btnAddTask.addEventListener('click', function () {

    countClick();
    let newToDo = {
        todo: nameTask.value,
        info: infoTask.value,
        checked: false,
        important: false,
    };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(newToDo)
    };
    if (nameTask.value !== '') {
        fetch('http://localhost/todolists/create', options)
            .then(response => response.json())
            .then((data) => {
                toDoList.push(data);
                let html = document.createElement('li');
                html.className = 'li';
                html.id = `task-${data.id}`;
                html.innerHTML = templateWithoutLi(data);
                list.append(html);
                addListenertsToTask(html);

                infoTask.value = '';
            })
            .catch(error => console.error(error));
    }
})


//  Функция отоброжения списка задач с сервера
function renderTasks() {
    fetch('http://localhost/todolists')
        .then(response => response.json())
        .then(result => {
            let uncheckedTasks = result.filter(element => element.checked === false);
            toDoList = uncheckedTasks;
            renderHtml();

        })
}

function renderTasksDone() {
    fetch('http://localhost/todolists/done')
        .then(response => response.json())
        .then(result => {
            console.log(result);
            let checkedTasks = result.filter(element => element.checked === true);
            console.log(checkedTasks);
            toDoListDone = checkedTasks;
            renderHtmlDone();
            emptyTodoList();

        })
}

//Функция проходиться по каждому item в результате каждой операции 
function renderHtml() {
    list.innerHTML = '';

    toDoList.forEach(function (item) {
        list.innerHTML += template(item);

    });
    addEventListeners();

};

function renderHtmlDone() {
    completedList.innerHTML = '';

    toDoListDone.forEach(function (item) {
        completedList.innerHTML += template(item);

    });
    addEventListeners();
    
};

// Функция отрисовки одной задачи(конкатенация c li)
const template = (item) => {
    return `<li class='li' id='task-${item.id}'>${templateWithoutLi(item)}</li>`;
}

//Функция отрисовки без li
const templateWithoutLi = (item) => {
    return ` <div class="form-check form-switch">
    <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" ${item.checked ? 'checked' : ''}>
    <label class="form-check-label label ${item.important ? 'important' : ' '}  ${item.checked ? 'li-active' : ''}"  >${item.name}</label>
    <div class="text ${item.checked ? 'li-active' : ''}" " >${item.info}</div>
    </div> 
    <div class="buttons">
    <button class="panel">
    <span class="material-symbols-outlined import-btn ${item.important ? 'important' : ' '}" >priority_high</span>
    </button>
        
        <button class="panel"><span class="material-symbols-outlined  edit-btn">
            edit
        </span>
         </button>
        <button class="panel">
        <span class="material-symbols-outlined close-btn">
            delete
        </span>
        </button>
       </buttons>`;
}

// Функция, которая перебирает все li и к ним применяет ф-цию addListenersToTask()
function addEventListeners() {
    const tasks = document.querySelectorAll('.li');
    for (let i = 0; i < tasks.length; i++) {
        addListenertsToTask(tasks[i]);
    }
}

// task-{id} => id Функция удаления префикса task из task-id
const formattedTaskId = (stringId) => {
    return stringId.replace('task-', '');
}

function findTaskIndex(taskId) {
    return toDoList.findIndex(element => element.id === taskId);
};

// Вешаем слушатели на каждую задачу один раз
function addListenertsToTask(taskElement) {
    const item = taskElement;
    const liId = item.getAttribute('id');
    const label = item.querySelector('.label');
    const check = item.querySelector('.form-check-input');

    check.addEventListener('change', (event) => {
        const checkId = formattedTaskId(liId);
        let upToDo = {
            checked: check.checked
        };
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(upToDo)
        };
        fetch(`http://localhost/todolists/${checkId}/check-status`, options)
            .then(response => response.json())
            .then((result) => {
                console.log(result);
                
                if (result.checked) {
                    label.classList.remove('li-active');
                } else {
                    label.classList.add('li-active');
                }
                renderTasks();
                renderTasksDone();
                emptyTodoList();
        })
    });

    const deleteBtn = item.querySelector('.close-btn');
    deleteBtn.addEventListener('click', event => {
        const taskId = formattedTaskId(liId);

        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },

        }
        fetch(`http://localhost/todolists/${taskId}`, options)
            .then(response => response.json())
            .then((data) => {
                let index = findTaskIndex(data.id);
                console.log(index);
                toDoList.splice(index, 1);
                item.remove();
                console.log(toDoList);
            })
    })

    const editBtn = item.querySelector('.edit-btn');
    editBtn.addEventListener('click', event => {

        const taskId = formattedTaskId(liId);
        console.log(liId);
        let editToDo = {
            name: nameTask.value,
            info: infoTask.value,
        };
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(editToDo)
        };
        if (nameTask.value !== '' || infoTask.value !== '') {
            fetch(`http://localhost/todolists/${taskId}/edit`, options)
                .then(response => response.json())
                .then((result) => {
                    item.innerHTML = templateWithoutLi(result.editTask);
                    addListenertsToTask(item);
                })
        }
    });

    const importantBtn = item.querySelector('.material-symbols-outlined');
    importantBtn.addEventListener('click', event => {

        const importantId = formattedTaskId(liId);
        let importantToDo = {

            important: !importantBtn.classList.contains('important')
        }
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(importantToDo)
        }
        fetch(`http://localhost/todolists/${importantId}/change-important-status`, options)
            .then(response => response.json())
            .then((result) => {
                console.log(result);
                if (result.important) {
                    label.classList.remove('important');
                    importantBtn.classList.remove('important');
                } else {
                    label.classList.add('important');
                    importantBtn.classList.add('important');

                }
                let taskImportant = toDoList.findIndex(element => element.id === result.updateTask.id);
                toDoList[taskImportant] = result.updateTask;
                toDoList.sort((a, b) => b.important - a.important);
                console.log(toDoList);
                renderTasks();
            })
    });

}

// Кнопка удаления всех задач
bntClearTask.addEventListener('click', () => {
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
    }

    fetch('http://localhost/todolists', options)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            list.innerHTML = '';
            completedList.innerHTML ='';
        })
})

function emptyTodoList() {
    if(toDoListDone.length > 0) {
        const info = document.querySelector('.info-task');
        info.innerHTML = '';
        
        
    }
}

// console.log(info);