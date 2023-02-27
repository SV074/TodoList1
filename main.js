let nameTask = document.getElementById('edit-task-field-name');
let infoTask = document.getElementById('edit-task-field-info');;
let inputDate = document.getElementById('edit-task-field-date');
const check = document.querySelector('.check');
const list = document.querySelector('.list');
const completedList = document.querySelector('.list-completed');
const activeList = document.querySelector('.list-active');
const bntClearTask = document.querySelector('.clear-tasks');
let editTaskBtn = document.querySelector('.enter');
const saveEdit = document.getElementById('button-task-edit');
const counter = document.querySelector('.counter');

const editTaskModalElement = document.getElementById('editTaskModal');
const editTaskModal = new bootstrap.Modal(editTaskModalElement);

const toastTaskElement = document.getElementById('toast-task');
const toastTask = new bootstrap.Toast(toastTaskElement);
const toastText = document.getElementById('toast-text');
const btnDeleteYes = document.getElementById('button-ask-delete-yes');
const btnsAskDelete = document.getElementById('buttons-ask-delete');
const plus = document.getElementById('plus');
const btnCloseToast = document.getElementById('button-toast-close');

const modalBody = document.getElementById('modal-body');
const modalTitle = document.querySelector('.modal-title');
const btnCloseModal = document.getElementById('button-task-close');

let toDoList = [];
let toDoListDone = [];
let toDoListActive = [];

renderTasks();
renderTasksDone();
renderTasksActive();
// dragLi();

//Кол-во задач
function countClick() {
    if(toDoList.length > 0) {
        counter.innerHTML = toDoList.length;
    } else {
        counter.innerHTML = '';
    }
};

// Когда модальное окно закрыто стирается содержимое инпутов и ...
editTaskModalElement.addEventListener('hidden.bs.modal', (event) => {
    nameTask.value = '';
    infoTask.value = '';
    inputDate.value = '';
    modalBody.classList.remove('hidden');
    modalTitle.innerHTML = '';
});

// Закрытие модального окна после ...
function closeEditModal() {
    const editTaskModalInstance = bootstrap.Modal.getInstance(editTaskModalElement);
    editTaskModalInstance.hide();
}

//Добавление задачи
plus.addEventListener('click', event => {
    event.stopPropagation();
    modalTitle.innerHTML = 'Задача';
    editTaskModal.toggle();
    editTaskBtn.innerHTML = "Создать задачу";
    btnsAskDelete.classList.add('hidden');

    let listener = function (event) {
        event.stopPropagation();
        // reminderTasks();
        countClick();

        let newToDo = {
            todo: nameTask.value,
            info: infoTask.value,
            dateTaskAdd: replaceDateTimeFormat(new Date()),
            completed: false,
            important: false,
            reminderTask: replaceReminderDateTime(inputDate.value),
        };

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(newToDo)
        };
        if ('' !== nameTask.value && infoTask.value !== '' && inputDate.value) {
            fetch('http://localhost/todolists/create', options)
                .then(response => response.json())
                .then((data) => {
                    toastText.innerHTML = 'Задача создана !';
                    toastTask.show();
                    closeEditModal();
                    addTask(data, toDoList, list);


                    // toDoList.push(data);
                    // let html = document.createElement('li');
                    // html.className = 'li';
                    // html.id = `task-${data.id}`;
                    // html.innerHTML = templateWithoutLi(data);
                    // list.append(html);

                    //addListenertsToTask(html);
                    countClick();
                    saveEdit.removeEventListener('click', listener);
                })
                .catch(error => console.error(error));
        }
    }

    saveEdit.addEventListener('click', listener);
})

// Функция которая меняет формат даты
function replaceDateTimeFormat(d) {
    return ( d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2))
    + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
}
   
const replaceReminderDateTime = (date) => {
    return date.replace('T', ' ');
}

// function renderTasks(filterCallback, array, element) {
//     fetch('http://localhost/todolists')
//         .then(response => response.json())
//         .then(result => {
//                 let tasks = result.filter(filterCallback);
//                 array = tasks;
//             renderHtml(element, array);

//             countClick();
//         })
// }

// Функция отображения списка задач
function renderTasks() {
    fetch('http://localhost/todolists')
        .then(response => response.json())
        .then(result => {
                let uncompletedTasks = result.filter(item => (item.completed === false && (item.reminder > item.date)));
                toDoList = uncompletedTasks;
            renderHtml(list, toDoList);
            
            countClick();
        })
}

// Отображение списка завершенных задач
function renderTasksDone() {
    fetch('http://localhost/todolists/done')
        .then(response => response.json())
        .then(result => {
            let doneTasks = result.filter((element) => { return element.completed === true});
            toDoListDone = doneTasks;
            renderHtml(completedList, toDoListDone);
            

        })
}

function renderTasksActive() {
    fetch('http://localhost/todolists/active')
        .then(response => response.json())
        .then(result => {
            
            let activeTask = result.filter(element => (element.date >= element.reminder));
            toDoListActive = activeTask;

            // reminderTasks();
            renderHtml(activeList, toDoListActive);
        })
}

function renderHtml(element, array) {
    element.innerHTML = '';
    
    array.forEach(function (item) {
        element.innerHTML += template(item);

    });
    addEventListeners();
    emptyTodoList();
}

// Функция отрисовки одной задачи(конкатенация c li)
const template = (item) => {
    return `<li class='form-floating li' id='task-${item.id}'>${templateWithoutLi(item)}</li>`;
}

//Функция отрисовки без li
const templateWithoutLi = (item) => {
    return `<div class="name-info text-start p-3">
    <h5 class="name-task text-start ${item.important ? 'important' : ' '} ${item.completed ? 'li-active' : ''}">${item.name}</h5>
    <div class="task-value text-start ${item.completed ? 'li-active' : ''} ">${item.info}</div>
</div>
<div class="buttons">
    <div class="form-check mb-2 d-flex justify-content-between">
        <label for="flexCheckChecked"
            class="form-check-label label ms-3">
            <input class="form-check-input check" type="checkbox" role="switch" id="flexSwitchCheckChecked" ${item.completed ? 'checked' : ''}>
        </label>
        <div class="spans d-flex">
        <div class="import-btn ${item.important ? 'important' : ' '}">
        <svg   xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 21 21"><path fill="none " stroke="#888888" stroke-linecap="round" stroke-linejoin="round" d="M10.5 6.5c.5-2.5 4.343-2.657 6-1c1.603 1.603 1.5 4.334 0 6l-6 6l-6-6a4.243 4.243 0 0 1 0-6c1.55-1.55 5.5-1.5 6 1z"/></svg>
        </div>
            <div class="edit-btn ms-1" data-task='{"name": "${item.name}", "info": "${item.info}", "date": "${item.reminder}"}'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 21 21"><g fill="none" fill-rule="evenodd" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4.5H5.5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V11"/><path d="M17.5 3.467a1.462 1.462 0 0 1-.017 2.05L10.5 12.5l-3 1l1-3l6.987-7.046a1.409 1.409 0 0 1 1.885-.104zm-2 2.033l.953 1"/></g></svg>
        </div>
        <div class="close-btn ms-1 me-2"> 
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 21 21"><g fill="none" fill-rule="evenodd" stroke="#888888" stroke-linecap="round" stroke-linejoin="round" transform="translate(2 2)"><circle cx="8.5" cy="8.5" r="8"/><path d="m5.5 5.5l6 6m0-6l-6 6"/></g></svg>
        </div>
        </div>
</div>`;
}

//Функция переноса задачи
// function dragLi() {
//     let dropField = document.querySelector('.list-active');
//     let dragTask = document.getElementById((`task-${item.id}`));

//     dropField.ondragover = allowDrop;

//     function allowDrop(event) {
//         event.preventDefault();
//     }

    
//     dragTask.ondragstart = drag;
    
    

//     function drag(event) {
//         event.dataTransfer.setData('id', event.target.id);
//         console.log(event.target.id);
//     }

    
//     dropField.ondrop = drop;

//     function drop(event) {
        
//         let taskId = event.dataTransfer.getData('id');
//         console.log(taskId);
//         event.target.append(document.getElementById(taskId));
//     }

// }


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

function findTaskIndex(taskId, array) {
    return array.findIndex(element => element.id === taskId);
};

function removeTask(id, array, element) {
    let index = findTaskIndex(id, array);
    let removedTasks = array.splice(index, 1);
    element.remove();
    return removedTasks.shift();
}

function addTask(task, array, element) {
    array.push(task);
    let html = document.createElement('li');
    html.className = 'li';
    html.id = `task-${task.id}`;
    html.innerHTML = templateWithoutLi(task);
    element.append(html);
    addListenertsToTask(html);
}

// Вешаем слушатели на каждую задачу один раз
function addListenertsToTask(taskElement) {
    const item = taskElement;
    const liId = item.getAttribute('id');
    const label = item.querySelector('.label');
    const check = item.querySelector('.form-check-input');

    check.addEventListener('change', (event) => {
        event.stopPropagation();
        const checkId = formattedTaskId(liId);
        let upToDo = {
            completed: check.checked
        };
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(upToDo)
        };
        fetch(`http://localhost/todolists/${checkId}/completed-status`, options)
            .then(response => response.json())
            .then((result) => {
                if (result.completed) {
                    label.classList.remove('li-active');
                    let removedTask = removeTask(liId, toDoList, item);
                    addTask(removedTask, toDoListDone, completedList);
                } else {
                    label.classList.add('li-active');
                    
                }
                //renderTasks();
                //renderTasksDone();
                emptyTodoList();
                countClick();
            })
    });

    const deleteBtn = item.querySelector('.close-btn');
    deleteBtn.addEventListener('click', event => {
        event.stopImmediatePropagation();
        const taskId = formattedTaskId(liId);
        editTaskBtn.innerHTML = "Да";
        btnCloseModal.innerHTML = "Нет";
        modalBody.classList.add('hidden');
        modalTitle.innerHTML = 'Вы уверены, что хотите удалить задачу?';
        editTaskModal.toggle();
        btnsAskDelete.classList.add('hidden');

        let listener = (event) => {

            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
    
            }
            fetch(`http://localhost/todolists/${taskId}`, options)
                .then(response => response.json())
                .then((data) => {
                    toastText.innerHTML = 'Задача удалена.';
                    toastTask.show();
                    closeEditModal();
                    removeTask(data.id, toDoList, item);
                    countClick();
                    saveEdit.removeEventListener('click', listener);
                })
    

        }
        saveEdit.addEventListener('click', listener, false);
        
    })

    const editBtn = item.querySelector('.edit-btn');
    editBtn.addEventListener('click', event => {
        event.stopPropagation();
        modalTitle.innerHTML = 'Редактирование задачи';
        editTaskModal.toggle();
        editTaskBtn.innerHTML = "Редактировать";
        btnsAskDelete.classList.add('hidden');
        const taskId = formattedTaskId(liId);
        let dataTask = JSON.parse(editBtn.getAttribute('data-task'));
        nameTask.value = dataTask.name;
        infoTask.value = dataTask.info;
        inputDate.value = dataTask.date;
        
        let listener = (event) => {

            event.stopPropagation();
            let editToDo = {
                name: nameTask.value,
                info: infoTask.value,
                reminder:replaceReminderDateTime(inputDate.value),
            };
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(editToDo)
            };

            fetch(`http://localhost/todolists/${taskId}/edit`, options)
                .then(response => response.json())
                .then((result) => {
                    console.log(result);
                    toastText.innerHTML = 'Задача отредактирована!';
                    toastTask.show();
                    closeEditModal();
                    item.innerHTML = templateWithoutLi(result.editTask);
                    // editBtn.setAttribute
                    addListenertsToTask(item);
                    renderTasks();
                    renderTasksDone();
                    renderTasksActive();
                    saveEdit.removeEventListener('click', listener);
                })
        }
        saveEdit.addEventListener('click', listener, false);
    });

    const importantBtn = item.querySelector('.import-btn');
    importantBtn.addEventListener('click', event => {
        event.stopPropagation();
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

                renderTasks();
            })
    });

    // let dropField = document.querySelector('.list-active');
    // let dragTask = item.getElementById('.li');

    // dropField.ondragover = allowDrop;

    // function allowDrop(event) {
    //     event.preventDefault();
    // }

    // // console.log(dragTask);
    
    // //for(i=0;i<dragTask.length;i++) {
        
    //     dragTask.ondragstart = drag;
    // //}
    

    // function drag(event) {
    //     event.dataTransfer.setData('id', event.target.id);
    //     console.log(event.target.id);
    // }

    
    // dropField.ondrop = drop;

    // function drop(event) {
        
    //     let taskId = event.dataTransfer.getData('id');
    //     console.log(taskId);
    //     event.target.append(document.getElementById(taskId));
    // }
}

// Кнопка удаления всех задач
bntClearTask.addEventListener('click', (event) => {
    event.stopPropagation();
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
    }

    fetch('http://localhost/todolists', options)
        .then(response => response.json())
        .then(result => {

            list.innerHTML = '';
            completedList.innerHTML = '';
            activeList.innerHTML = '';
            counter.innerHTML = '';
            toDoList = [];
            toDoListDone = [];
            toDoListActive = [];
        })
    emptyTodoList();
})

// 
function emptyTodoList() {
    if (toDoListDone.length > 0) {
        const info = document.querySelector('.information');
        info.classList.add('hidden');
    } else if (toDoListDone === 0) {
        info.classList.remove('hidden');
    }
}

