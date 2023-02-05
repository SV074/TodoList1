let inputTask = document.querySelector('.field-task');
let btnAddTask = document.querySelector('.add-task');
const check = document.querySelector('.check');
let list = document.querySelector('.list');
let btnClose = document.querySelectorAll('.close-btn');
let bntClearTask = document.querySelector('.clear-tasks');

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
                list.innerHTML += template(data);
                const newTaskElement = list.querySelector(`#task-${data.id}`);
                addListenertsToTask(newTaskElement);
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
            toDoList.forEach(function (item) {
                list.innerHTML += template(item);
               
            });
            addEventListeners();
        })

}

const template = (item) => {
    return `<li class='li' id='task-${item.id}'>${templateWithoutLi(item)}</li>`;
}

const templateWithoutLi = (item) => {
    return `<input class='check'  type='checkbox' id='${item.id}' ${item.checked ? 'checked' : ''}>
    <label for='item' id='${item.id}' class="${item.important ? 'important': ' '}" >${item.name}</label>
    <div class='butons'>
    <button class='span'><span type='button' class="material-symbols-outlined ${item.important ? 'important': ' '}"  data-important-id='${item.id}'>
    label_important
    </span>
    </button>
    <button class='edit-btn'>Edit</button>
    <button class='close-btn'>Delete</button>
    </buttons>`;
}

function addEventListeners() {
    const tasks = document.querySelectorAll('.li');
    for(let i=0;i<tasks.length;i++) {        
        addListenertsToTask(tasks[i]);        
    }
}

function addListenertsToTask(taskElement) {
    let item = taskElement;
    let liId = item.getAttribute('id');
    
    const check = item.querySelector('.check');
    check.addEventListener('change', (event) => {
        const checkId = event.target.getAttribute('id');
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
                     let label = document.querySelectorAll('label');
                     for (i = 0; i < label.length; i++) {
                         item = label[i];
                        if (result.updateTask.name === item.innerText) {
                            item.classList.add('li-active');
                        }
                    }
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
                item.remove();
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
        if(inputTask.value!=='') {
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
        
        // if(importantBtn.className !== 'important') {
            let importantToDo = {
                important: true
            }
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(importantToDo)
            }
            fetch(`http://localhost/todolists/${importantId}/important`, options)
                .then(response => response.json())
                .then((result) => {
                     console.log(result);
                    
                  
                    // if (result.updateTask.important === true) {
                    //     item.classList.add('important');
                    //     item.classList.add('importants');
                    // }
    
                })
            //}
    })
    // const getUnimportantBtn = item.querySelector('.importants');
    // console.log(getUnimportantBtn);
    // getUnimportantBtn.addEventListener('click', event => {
    //     const importantId = formattedTaskId(liId);
    //     let importantToDo = {
    //         important: false
    //     }
    //     const options = {
    //         method: 'PUT',
    //         headers: {
    //             'Content-Type': 'application/json;charset=utf-8'
    //         },
    //         body: JSON.stringify(importantToDo)
    //     }
    //     fetch(`http://localhost/todolists/${importantId}/unimportant`, options)
    //         .then(response => response.json())
    //         .then((result) => {
    //             console.log(result);
    //             if (result.updateTask.important === false) {
    //                 item.classList.remove('important');
    //                 // addListenertsToTask(item);
    //             }

    //         })
    // })
}

// task-{id} => id Функция удаления префикса task из task-id
const formattedTaskId = (stringId) => {
    return stringId.replace('task-', '');
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


// // Функция выведения Empty при отсутствии задач

function emptyTodoList() {
    if (list.innerHTML ==='') {
        const emptyTodoListHTML =
            `<li class="empty">Empty</li>`;
        list.insertAdjacentHTML('afterbegin', emptyTodoListHTML);
    }
    if (list.innerHTML!== '') {
        const emptyTodoListEl = document.querySelector('.empty');
        emptyTodoListEl ? emptyTodoListEl.remove() : null;
    }
}

emptyTodoList();