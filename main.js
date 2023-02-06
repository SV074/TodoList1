let inputTask = document.querySelector('.field-task');
let btnAddTask = document.querySelector('.add-task');
const check = document.querySelector('.check');
let list = document.querySelector('.list');
let btnClose = document.querySelectorAll('.close-btn');
let bntClearTask = document.querySelector('.clear-tasks');


let toDoList = [];
renderTasks();

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
    <label class="form-check-label ${item.important ? 'important' : ' '}  ${item.checked ? 'li-active' : ''}" for="flexSwitchCheckChecked">${item.name}</label>
    </div> 
    <div class='butons'>
    <button class='span'><span type='button' class="material-symbols-outlined ${item.important ? 'important' : ' '}" >
    label_important
    </span>
    </button>
    <button class='edit-btn'>Edit</button>
    <button class='close-btn'>Delete</button>
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
    const label = item.querySelector('.form-check-label');
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
                    
                    //addEventListeners();
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
                toDoList.sort((a, b) =>
                    b.important - a.important);
                renderHtml();

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
    if (list.innerHTML !== '')  {
        const emptyTodoListEl = document.querySelector('.empty');
        emptyTodoListEl ? emptyTodoListEl.remove() : null;
    }
}

emptyTodoList();