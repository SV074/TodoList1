let inputTask = document.querySelector('.input-task');
let btnAddTask = document.querySelector('.add-task');
let list = document.querySelector('.list');
let btnClose = document.querySelector('.close');

let toDoList = [];

// Условие при котором, при обновлении страницы задачи не исчезают

if (localStorage.getItem('toDo')) {

    toDoList = JSON.parse(localStorage.getItem('toDo'));
    displayMessages();
}

// Добавлении задачи

btnAddTask.addEventListener('click', function () {
    let newToDo = {
        id: Date.now(),
        todo: inputTask.value,
        checked: false,
        important: false,
    };
    if (inputTask.value !== '') {
        toDoList.push(newToDo);
        displayMessages();

        localStorage.setItem('toDo', JSON.stringify(toDoList));
    }
    




})

// Функция отображения задачи

function displayMessages() {
    let displayMessage = '';
    if(toDoList.length === 0) list.innerHTML = '';
    toDoList.forEach(function (item, i) {

        displayMessage += `
    <li class='li'>
        <input type='checkbox' id='item_${i}' ${item.checked ? 'checked' : ''}>
        <label for='item_${i}' class="${item.important ? 'important' : ''}">${item.todo}</label>
        <span class='close' data-delete='${item.id}'>X</sapan>
    </li>
    `;
        list.innerHTML = displayMessage;
    });

}

// Отмечаем завершенную задачу

list.addEventListener('change', function(event) {
    let idInput = event.target.getAttribute('id');
    let forLabel = document.querySelector('[for='+ idInput +']');
    let valueLabel = forLabel.innerHTML;
    
    toDoList.forEach(function(item) {
        if(item.todo === valueLabel) {
            item.checked = !item.checked;
            localStorage.setItem('toDo', JSON.stringify(toDoList));
        }
    });


});

// list.addEventListener('contextmenu', function(event) {
//     event.preventDefault();
//     toDoList.forEach(function(item, i) {
//         if(item.todo === event.target.innerHTML) {
//             if(event.delKey|| event.ctrlKey) {
//                 toDoList.splice(i, 1);
//             } else {
//                 item.important = !item.important;
//             }
            
//             displayMessages();
//             localStorage.setItem('toDo', JSON.stringify(toDoList));
//         }
//     })
// });

// btnClose.addEventListener('click', function(event) {
    
// });

list.addEventListener('click', function(event) {

    // Проверяем был ли клик по кнопке удалить задачу

    if(event.target.classList.contains('close')) {
        let productId = event.target.dataset.delete;
        console.log(productId);
        let findIndex = toDoList.findIndex((item) => {
            return productId === item.id;
        })
        toDoList.splice(findIndex,1);
        displayMessages();
        localStorage.setItem('toDo',JSON.stringify(toDoList));
    }
})
