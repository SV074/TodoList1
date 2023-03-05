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
const counterActiveTask = document.querySelector('.counter-active-task');
const counterCompletedTask = document.querySelector('.counter-completed-task');

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
    event.stopImmediatePropagation();
    modalTitle.innerHTML = 'Задача';
    editTaskModal.toggle();
    editTaskBtn.innerHTML = "Создать задачу";
    btnsAskDelete.classList.add('hidden');

    let listener = function (event) {
        event.stopPropagation();

        let newToDo = {
            todo: nameTask.value,
            info: infoTask.value,
            dateTaskAdd: new Date(),
            completed: false,
            important: false,
            actualDate: inputDate.value,
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
                    
                    toastTask.show();
                    toastText.innerHTML = 'Задача создана !';
                    closeEditModal();

                    let currentDate = new Date();
                    let actualDate = new Date(data.actual_date);
                    
                    if(actualDate <= currentDate) {
                        addTask(data, toDoListActive, activeList);
                    } else {
                        addTask(data, toDoList, list);
                    }
                    saveEdit.removeEventListener('click', listener);
                })
                .catch(error => console.error(error));
        }
    }

    saveEdit.addEventListener('click', listener);
})

//Кол-во задач
function countClick(array, element) {
    if (array.length > 0) {
        element.innerHTML = array.length;
    } else {
        element.innerHTML = '';
    }
};

// Функции которые меняют формат даты
function replaceDateTimeFormat(date) {
    let dateInput = new Date(date);
    const year = dateInput.getFullYear();
    const month = ("0" + (dateInput.getMonth() + 1)).slice(-2);
    const day = ("0" + dateInput.getDate()).slice(-2);
    
    return `${year}-${month}-${day}`;
}

// Функция отображения списка задач
function renderTasks() {
    fetch('http://localhost/todolists')
        .then(response => response.json())
        .then(result => {
            toDoList = result.filter(item => ((item.completed) === false && (Date.parse(item.actual_date)) > Date.parse(new Date())));
            toDoListDone = result.filter((element) => { return element.completed === true });
            toDoListActive = result.filter(element => (element.completed) === false && (Date.parse(new Date()) >= Date.parse(element.actual_date)));
            
            renderHtml(list, toDoList, counter);
            renderHtml(completedList, toDoListDone, counterCompletedTask);
            renderHtml(activeList, toDoListActive, counterActiveTask);

            addEventListeners();
            emptyTodoList();
            
        })
}

function renderHtml(element, array, count) {
    element.innerHTML = '';

    array.forEach(function (item) {
        element.innerHTML += template(item);
    });
    count.innerHTML = array.length || '';
}

// Функция отрисовки одной задачи(конкатенация c li)
const template = (item) => {
    return `<li class='form-floating li ${item.important ? 'important-li' : ' '}' id='task-${item.id}'>${templateWithoutLi(item)}</li>`;
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
        <div class="import-btn">
        <svg   xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 21 21"><path fill="none " stroke="#888888" stroke-linecap="round" stroke-linejoin="round" d="M10.5 6.5c.5-2.5 4.343-2.657 6-1c1.603 1.603 1.5 4.334 0 6l-6 6l-6-6a4.243 4.243 0 0 1 0-6c1.55-1.55 5.5-1.5 6 1z"/></svg>
        </div>
            <div class="edit-btn ms-1" data-task='{"name": "${item.name}", "info": "${item.info}", "date": "${item.actual_date}"}'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 21 21"><g fill="none" fill-rule="evenodd" stroke="#888888" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4.5H5.5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V11"/><path d="M17.5 3.467a1.462 1.462 0 0 1-.017 2.05L10.5 12.5l-3 1l1-3l6.987-7.046a1.409 1.409 0 0 1 1.885-.104zm-2 2.033l.953 1"/></g></svg>
        </div>
        <div class="close-btn ms-1 me-2"> 
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 21 21"><g fill="none" fill-rule="evenodd" stroke="#888888" stroke-linecap="round" stroke-linejoin="round" transform="translate(2 2)"><circle cx="8.5" cy="8.5" r="8"/><path d="m5.5 5.5l6 6m0-6l-6 6"/></g></svg>
        </div>
        </div>
</div>`;
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

function deleteAndAdd(task, array1, array2) {
    let id = task.id;
    let index = findTaskIndex(id, array1);
    array1.splice(index, 1);
    let element = document.getElementById(`task-${id}`);
    element.remove();
    array2.push(task);
    let html = document.createElement('li');
    html.className = 'li';
    html.id = `task-${task.id}`;
    html.innerHTML = templateWithoutLi(task);
    ?
    addListenertsToTask(html);
}

function removeAndAddTask(id, array1, item, data, array2, element) {
    removeTask(id, array1, item);
    addTask(data, array2, element);
};

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
                let currentDate = new Date();
                let actualDate = new Date(result.actual_date);
                if (result.completed) {
                    label.classList.remove('li-active');
                    if(currentDate < actualDate) {
                        deleteAndAdd(result, toDoList, toDoListDone, item);
                        // removeAndAddTask(liId, toDoList, item, result, toDoListDone, completedList);
                    } else {
                        removeAndAddTask(liId, toDoListActive, item, result, toDoListDone, completedList);
                    }
                } else {
                    label.classList.add('li-active');
                    if(currentDate >= actualDate) {
                        
                        removeAndAddTask(liId, toDoListDone, item, result, toDoListActive, activeList);
                    } else {
                        removeAndAddTask(liId, toDoListDone, item, result, toDoList, list);
                    }
                   
                }

                emptyTodoList();
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
                    
                    saveEdit.removeEventListener('click', listener);
                })
        }
        saveEdit.addEventListener('click', listener, false);

    })

    const editBtn = item.querySelector('.edit-btn');
    editBtn.addEventListener('click', event => {
        event.stopImmediatePropagation();
        modalTitle.innerHTML = 'Редактирование задачи';
        editTaskModal.toggle();
        editTaskBtn.innerHTML = "Редактировать";
        btnsAskDelete.classList.add('hidden');

        const taskId = formattedTaskId(liId);
        let dataTask = JSON.parse(editBtn.getAttribute('data-task'));
        nameTask.value = dataTask.name;
        infoTask.value = dataTask.info;
        inputDate.value = replaceDateTimeFormat(dataTask.date);
        
        let listener = (event) => {

            event.stopImmediatePropagation();
            let editToDo = {
                name: nameTask.value,
                info: infoTask.value,
                actual_date: new Date(inputDate.value),
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
                    toastText.innerHTML = 'Задача отредактирована!';
                    toastTask.show();
                    closeEditModal();

                    item.innerHTML = templateWithoutLi(result);
                    addListenertsToTask(item);
                    saveEdit.removeEventListener('click', listener);
                })
        }
        saveEdit.addEventListener('click', listener, false);
    });

    const importantBtn = item.querySelector('.import-btn');
    importantBtn.addEventListener('click', event => {

        event.stopPropagation();
        const nameTaskText = item.querySelector('.name-task');
        const importantId = formattedTaskId(liId);

        let importantToDo = {
            important: !nameTaskText.classList.contains('important')
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
                    item.classList.add('important-li');
                } else {
                    item.classList.remove('important-li');
                }
                item.innerHTML = templateWithoutLi(result);
                addListenertsToTask(item);
            })
    });
}

//Кнопка удаления всех задач
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


function emptyTodoList() {
    if (toDoListDone.length > 0) {
        const info = document.querySelector('.information');
        info.classList.add('hidden');
    } else if (toDoListDone === 0) {
        info.classList.remove('hidden');
    }
}

