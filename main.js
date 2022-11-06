let inputTask = document.querySelector('.input-task');
let btnAddTask = document.querySelector('.add-task');
let list = document.querySelector('.list');


let toDoList = [];

function storage() {
    if(toDoList===[]) {
        console.log(localStorage);
        let listStorage = JSON.parse(localStorage.getItem('toDo')); 
        list.innerHTML = listStorage;
    }
}

btnAddTask.addEventListener('click', function () {
    let newToDo = {
        todo: inputTask.value,
        checked: false,
        important: false,
    };
    
    toDoList.push(newToDo);
    displayMessages();
    
    localStorage.setItem('toDo',JSON.stringify(toDoList));
    



})

function displayMessages() {
    let displayMessage = '';
    toDoList.forEach(function (item, i) {

        displayMessage += `
    <li>
        <input type='checkbox' id='item_${i}' ${item.checked ? 'checked' : ''}>
        <label for='item_${i}'>${item.todo}</label>
    </li>
    `;
        list.innerHTML = displayMessage;
    });

}