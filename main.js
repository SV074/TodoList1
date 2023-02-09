let inputTask = document.querySelector('.field-task');
let btnAddTask = document.querySelector('.enter');
const check = document.querySelector('.check');
let list = document.querySelector('.list');
let btnClose = document.querySelectorAll('.close-btn');
let bntClearTask = document.querySelector('.clear-tasks');
let myModal = document.getElementById('.exampleModal');

let toDoList = [];
renderTasks();

// myModal.addEventListener('hide.bs.modal', () => {
//     inputTask.value = '';
// })

//Добавление задачи
btnAddTask.addEventListener('click', function () {
    
    let newToDo = {
        todo: inputTask.value,
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
    if (inputTask.value !== '') {
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
                inputTask.value = '';
            })
            .catch(error => console.error(error));
    }
})


//  Функция отоброжения списка задач с сервера
function renderTasks() {
    fetch('http://localhost/todolists')
        .then(response => response.json())
        .then(result => {
            toDoList = result;
            renderHtml();

        })

}

function renderHtml() {
    list.innerHTML = '';
    
    toDoList.forEach(function (item) {
        list.innerHTML += template(item);

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
    </div> 
    <div class='buttons'>
    <button class="panel">
    <span class="material-symbols-outlined import-btn ${item.important ? 'important' : ' '}" >
         priority_high
         </span>
    </button>
        </span>
         <button class="panel">
         <span class="material-symbols-outlined  edit-btn">
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
        
        if (check.checked) {
            let upToDo = {
                checked: true,
            };
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(upToDo)
            };
            fetch(`http://localhost/todolists/${checkId}/checked`, options)
                .then(response => response.json())
                .then((result) => {
                    console.log(result);
                    label.classList.add('li-active');

                })
        } else if (!check.checked) {
            let upToDo = {
                checked: false,
            };
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(upToDo)
            };
            fetch(`http://localhost/todolists/${checkId}/unchecked`, options)
                .then(response => response.json())
                .then((result) => {
                    console.log(result);
                    label.classList.remove('li-active');
                    addListenertsToTask(item);
                })
        }
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
            name: inputTask.value,
        };
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(editToDo)
        };
        if (inputTask.value !== '') {
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
        })
})

// Функция выведения Empty при отсутствии задач
function emptyTodoList() {
    if (list.innerHTML === '') {
        const emptyTodoListHTML =
            `<li class="empty">Empty</li>`;
        list.insertAdjacentHTML('afterbegin', emptyTodoListHTML);
    }
    if (list.innerHTML !== '') {
        const emptyTodoListEl = document.querySelector('.empty');
        emptyTodoListEl ? emptyTodoListEl.remove() : null;
    }
}

emptyTodoList();