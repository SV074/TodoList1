let inputTask = document.querySelector('.input-task');
let btnAddTask = document.querySelector('.add-task');
let list = document.querySelector('.list');


let toDoList = [];


if (localStorage.getItem('toDo')) {

    toDoList = JSON.parse(localStorage.getItem('toDo'));
    displayMessages();
}


btnAddTask.addEventListener('click', function () {
    let newToDo = {
        todo: inputTask.value,
        checked: false,
        important: false,
    };

    toDoList.push(newToDo);
    displayMessages();

    localStorage.setItem('toDo', JSON.stringify(toDoList));




})

function displayMessages() {
    let displayMessage = '';
    if(toDoList.length === 0) list.innerHTML = '';
    toDoList.forEach(function (item, i) {

        displayMessage += `
    <li>
        <input type='checkbox' id='item_${i}' ${item.checked ? 'checked' : ''}>
        <label for='item_${i}' class="${item.important ? 'important' : ''}">${item.todo}</label>
        <span class='close'>X</sapan>
    </li>
    `;
        list.innerHTML = displayMessage;
    });

}


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

list.addEventListener('contextmenu', function(event) {
    event.preventDefault();
    toDoList.forEach(function(item, i) {
        if(item.todo === event.target.innerHTML) {
            if(event.delKey|| event.ctrlKey) {
                toDoList.splice(i, 1);
            } else {
                item.important = !item.important;
            }
            
            displayMessages();
            localStorage.setItem('toDo', JSON.stringify(toDoList));
        }
    })
});

