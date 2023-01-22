let inputTask = document.querySelector('.field-task');
let btnAddTask = document.querySelector('.add-task');
let li = document.querySelector('.li');
const check = document.querySelector('.check');
let list = document.querySelector('.list');
let btnClose = document.querySelectorAll('.close-btn');
let btnTask = document.querySelector('.get-task');
let bntClearTask = document.querySelector('.clear-tasks');

let toDoList = [];

// Добавление задачи

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


    fetch('http://localhost/todolists/create', options)
        .then(response => response.json())
        .then((result) => {
            alert(result.message);
        })
        .catch(error => console.error(error));

})


// Кнопка вывода списка задач с сервера

function renderTasks() {

    fetch('http://localhost/todolists')
    .then(response => response.json())
    .then(result => {
            const html = 
            (id, checked, important, name) => {
                return `<li class='li'>
                         <input class='check'  type='checkbox' id='${id}' ${checked ? 'checked' : ''}>
                        <label for='' class="${important ? 'important' : ''}">${name}</label>
                        <button class='close-btn' data-task-id='${id}'>Delete</button>
                        
                     </li>
                     `;
            }
            result.tasks.forEach(element => {
                toDoList += html(
                    element.id,
                    element.checked,
                    element.important,
                    element.name

                )
            });
            list.innerHTML = toDoList;
         

    })
    console.log(toDoList);
}   
 
renderTasks();
  
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
    
    if(event.target.classList.contains('close-btn')) {
        
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
                 console.log(data);
            
             })

            
    }

    

})

// Отмечаем выполненную задачу
// list.addEventListener('change', event => {

//     if (event.target.classList.contains('check')) {

//         const checkId = event.target.getAttribute('id');

//         let upToDo = {

//             checked: true,
//             important: true,
//             id: checkId
//         };

//         const options = {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json;charset=utf-8'
//             },
//             body: JSON.stringify(upToDo)
//         };

//         fetch(`http://localhost/todolists/${checkId}`, options)
//             .then(response => response.json())
//             .then((result) => {
//                 console.log(result);




//             })

//     }

// })

list.addEventListener('click', event => {
    
    const checks = document.getElementsByClassName('check');

    for (i = 0; i <= checks.length; i++) {
        let item = checks[i];
        console.log(item);
        if (item) {
            item.addEventListener('change', (event) => {
                const checkId = event.target.getAttribute('id');

                if (item.checked) {
                    let upToDo = {
                        checked: true,
                        important: true,

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
                        })

                } else if (!item.checked) {
                    let upToDo = {
                        checked: false,
                        important: false,

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

// Функция отображения задачи

// function displayMessages() {
//     let displayMessage = '';
//     if(toDoList.length === 0) list.innerHTML = '';


//         toDoList.forEach(function (item, i) {

//             displayMessage += `
//         <li class='li'>
//             <input type='checkbox' id='item_${i}' ${item.checked ? 'checked' : ''}>
//             <label for='item_${i}' class="${item.important ? 'important' : ''}">${item.todo}</label>
//             <span class='close' data-delete='${item.id}'>X</span>
//         </li>
//         `;
//             list.innerHTML = displayMessage;

//         });

//         emptyTodoList();


// }

// const html = result.tasks
//             .map((item,i) => {
//                 return `<li class='li'>
//                          <input class='check'  type='checkbox' id='${item.id}' ${item.checked ? 'checked' : ''}>
//                         <label for='item_${i}' class="${item.important ? 'important' : ''}">${item.name}</label>
//                         <button class='close-btn' data-task-id='${item.id}'>Delete</button>
                        
//                      </li>
//                      `;
//             })
//             .join("");
//           toDoList.push(html);
//         list.innerHTML = toDoList;
 
// Отмечаем завершенную задачу

// list.addEventListener('change', function (event) {
//     let idInput = event.target.getAttribute('id');
//     let forLabel = document.querySelector('[for=' + idInput + ']');
//     let valueLabel = forLabel.innerHTML;

//     toDoList.forEach(function (item) {
//         if (item.todo === valueLabel) {
//             item.checked = !item.checked;
//             localStorage.setItem('toDo', JSON.stringify(toDoList));
//             forLabel.classList.toggle('li-active');
//         }
//     });


//  });



// // Функция выведения Empty при отсутствии задач

function emptyTodoList() {
    if (toDoList.length === 0) {

        const emptyTodoListHTML =
            `<li class="clear">Empty</li>`;

        list.insertAdjacentHTML('afterbegin', emptyTodoListHTML);
    }

    if (toDoList.length > 0) {

        // const emptyTodoListEl = document.querySelector('.clear');

        // emptyTodoListEl ? emptyTodoListEl.remove() : null;
        
    }

}

emptyTodoList();