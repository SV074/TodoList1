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
                renderTask();

            })
            .catch(error => console.error(error));

    }



})


//  Функция отоброжения списка задач с сервера

function renderTasks() {
    let html = '';
    fetch('http://localhost/todolists')
        .then(response => response.json())
        .then(result => {
            toDoList = result;
            renderTask();
        })

}

// Функция отображения одной задачи

function renderTask() {
    let html = '';
    toDoList.forEach(function (item) {
        html +=
            `<li class='li'>
                        <input class='check'  type='checkbox' id='${item.id}' ${item.checked ? 'checked' : ''}>
                        <label for='' class="${item.important ? 'important' : ''}">${item.name}</label>
                        <div class='butons'>
                        <button class='edit-btn' data-edit-id='${item.id}'>Edit</button>
                        <button class='close-btn' data-task-id='${item.id}'>Delete</button>
                        </buttons>
                     </li>`;
        list.innerHTML = html;
    });
};

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
        })
})

// Удаление одной задачи

list.addEventListener('click', event => {
    if (event.target.classList.contains('close-btn')) {
        const taskId = event.target.dataset.taskId;
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },

        }
        fetch(`http://localhost/todolists/${taskId}`, options)
            .then(response => response.json())
            .then((data) => {
            })
    }
})

// Отмечаем завершенную задачу 

list.addEventListener('click', event => {
    const checks = document.getElementsByClassName('check');
    for (i = 0; i <= checks.length; i++) {
        let item = checks[i];
        if (item) {
            item.addEventListener('change', (event) => {
                const checkId = event.target.getAttribute('id');
                if (item.checked) {
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
                            let label = document.querySelectorAll('label');
                            for (i = 0; i < label.length; i++) {
                                item = label[i];
                                if (result.updateTask.name === item.innerText) {
                                    item.classList.add('li-active');
                                }
                            }
                        })
                } else if (!item.checked) {
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
                        })
                }
            })
        }
    }
})

//Редактируем задачу

list.addEventListener('click', event => {
    if (event.target.classList.contains('edit-btn')) {
        const editId = event.target.dataset.editId;
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
        fetch(`http://localhost/todolists/${editId}/edit`, options)
            .then(response => response.json())
            .then((result) => {
                console.log(result);
            })
    }

});

// Функция выведения Empty при отсутствии задач

function emptyTodoList() {
    if (toDoList.length === 0) {
        const emptyTodoListHTML =
            `<li class="empty">Empty</li>`;
        list.insertAdjacentHTML('afterbegin', emptyTodoListHTML);
    }
    if (toDoList.length > 0) {
        const emptyTodoListEl = document.querySelector('.empty');
        emptyTodoListEl ? emptyTodoListEl.remove() : null;
    }
}

emptyTodoList();