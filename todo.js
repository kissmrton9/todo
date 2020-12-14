function setDate(){
    const date=new Date().toLocaleDateString('en',{
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    //timeZoneName: 'long'
  }).split(',');
    today.firstElementChild.textContent=date[0];
    today.childNodes[1].textContent=date[1].replace(/\//g,'-');//+date[2];
}
function importTodoList(){
    const todoListObject = JSON.parse(localStorage.getItem(myStorageKey));
    return todoListObject===null ? {} : todoListObject;
}
function exportTodoList(){
    localStorage.setItem(myStorageKey,JSON.stringify(todoListObject));
}
function addTodoItem(str){
    const date = new Date();
    if (date.getDay('long') !== today.firstElementChild.textContent) setDate();
    const key = date.toISOString();
    todoListObject[key] = str;
    exportTodoList();
    NumberOfPendingTodos += 1;
    setChill();
    setCompletedPercent();
    showTodoItem(key);
}
function showTodoItem(key){
    const parent = document.querySelector('.todo-list.pending');
    const newTodoElement = document.createElement('div');
    newTodoElement.setAttribute('class','todo pending');
    newTodoElement.setAttribute('id',key);
    //newTodoElement.setAttribute('class','todo ' + key);
    //showDeleteIcon(event.target.parentNode.className.substring(5)));
    const newDivElement = document.createElement('div');
    const newCheckbox = document.createElement('input');
    newCheckbox.setAttribute('type','checkbox');
    const newSpanElement = document.createElement('span');
    newSpanElement.setAttribute('class','description');
    newSpanElement.textContent = todoListObject[key];
    parent.insertBefore(newTodoElement, parent.firstChild);
    newTodoElement.appendChild(newDivElement);
    newDivElement.appendChild(newCheckbox);
    newCheckbox.addEventListener('change',()=>{completeTodoItem(key)});
    newDivElement.appendChild(newSpanElement);
    //completeTodoItem(event.target.parentNode.className.substring(5)));
    addDeleteIcon(key);
    const img = document.querySelector(`.pending [id="${key}"]>div>img`);
    newTodoElement.addEventListener('mouseover',()=>{AddClassName(img,'fadein');RemoveClassName(img,'hidden')});
    newTodoElement.addEventListener('mouseout',()=>{AddClassName(img,'hidden');RemoveClassName(img,'fadein')});
}
function showCompletedTodoItem(key){
    const parent = document.querySelector('.todo-list.completed');
    const newTodoElement = document.createElement('div');
    newTodoElement.setAttribute('class','todo completed');
    const newDivElement = document.createElement('div');
    const newCheckbox = document.createElement('input');
    newCheckbox.setAttribute('type','checkbox');
    newCheckbox.checked = true;
    const newSpanElement = document.createElement('span');
    newSpanElement.setAttribute('class','description');
    newSpanElement.textContent = completedTodos[key];
    parent.insertBefore(newTodoElement, parent.firstChild);
    newTodoElement.appendChild(newDivElement);
    newDivElement.appendChild(newCheckbox);
    newDivElement.appendChild(newSpanElement);
}
function completeTodoItem(key){
    completedTodos[key] = todoListObject[key];
    removeTodoItem(key);
    showCompletedTodoItem(key);
}
function removeTodoItem(key){
    //console.log('Item ' + key + ' removed from todo list');
    delete todoListObject[key];
    exportTodoList();
    NumberOfPendingTodos -= 1;
    setChill();
    setCompletedPercent();
    document.querySelector(`.pending [id="${key}"]`).remove();
    setDate();
}
function addDeleteIcon(key){
    const parent = document.querySelector(`.pending [id="${key}"]`);
    const newTrashDiv = document.createElement('div');
    newTrashDiv.setAttribute('class','trash');
    const newTrashImg = document.createElement('img');
    newTrashImg.setAttribute('src','trash.png');
    newTrashImg.setAttribute('alt','click image to delete this todo');
    newTrashImg.setAttribute('class','trash hidden');
    newTrashImg.addEventListener('click',()=>{removeTodoItem(key)}); 
    parent.appendChild(newTrashDiv);
    newTrashDiv.appendChild(newTrashImg);
}
function AddClassName(node,str){
    const patt = new RegExp(`(?:^|\\s)${str}(?!\\S)`,'');
    if (!patt.test(node.className)){
        node.className+=' '+str;
    }
}
function RemoveClassName(node,str){
    const patt = new RegExp(`(?:^|\\s)${str}(?!\\S)`,'g');
        node.className = node.className.replace(patt,'').replace(/  /g, ' ').replace(/^ /, '');
}
function ToggleClassName(node,str){
    const patt = new RegExp(`(?:^|\\s)${str}(?!\\S)`,'');
    if (patt.test(node.className)){
        //console.log(node.className + ' yes');
        //node.className = node.className.replace(patt,'').replace(/  /g, ' ').replace(/^ /, '');
        RemoveClassName(node,str);
    }
    else {
        //console.log(node.className + ' no');
        //node.className += ' '+str;
        AddClassName(node,str);
    }
}
function showHide(){
    ToggleClassName(document.querySelector('.todo-list.completed'),'none');
    button.value = (button.value === 'Hide Completed') ? 'Show Completed' : 'Hide Completed';
};
function ClearAll(){
    const pending = document.querySelector('.todo-list.pending');
    Object.values(pending.children).map((node)=>removeTodoItem(node.id));
    //Object.values(pending.children).map((node)=>removeTodoItem(node.className.substring(5)));
}
function setChill(){
    document.querySelector('.number-of-pending-items').textContent =
        //NumberOfPendingTodos === 0 ? 'Time to chill! You have no todos' : 
        NumberOfPendingTodos === 1 ? 'You have one pending item' : `You have ${NumberOfPendingTodos} pending items`;
        const section = document.querySelector('section.todos');
        const chill = Object.values(document.querySelectorAll('.chill'));
        const footer = document.querySelector('footer');
        if (NumberOfPendingTodos === 0) {
            AddClassName(section,'none');
            AddClassName(footer,'none');
            chill.map(node=>RemoveClassName(node,'none'));
        }
        else {
            RemoveClassName(section,'none');
            RemoveClassName(footer,'none');
            chill.map(node=>AddClassName(node,'none'));
        }
}
function setCompletedPercent(){
    NumberOfCompletedTodos = Object.keys(completedTodos).length;
    completedPercent = (NumberOfCompletedTodos === 0) ? 0 : Math.floor(100*NumberOfCompletedTodos/(NumberOfPendingTodos+NumberOfCompletedTodos));
    completed.textContent = `Completed: ${completedPercent}%`
}
function init(){
    setDate();
    const pending = document.querySelector('.todo-list.pending');
    Object.values(pending.children).map((node)=>node.remove());
    Object.keys(todoListObject).map(key=>showTodoItem(key));
    const completed = document.querySelector('.todo-list.completed');
    Object.values(completed.children).map((node)=>node.remove());
    showHide();
    setChill();
    setCompletedPercent();
    const addButton = document.querySelector('[name~="add"]');
    const input = document.querySelector('[name~="new-todo"]');
    input.setAttribute('value','Take the garbage out');
    addButton.addEventListener('click',()=>{
        if (input.value !== ''){
            addTodoItem(input.value);
            input.value = '';
        }
        else addTodoItem('New Todo');
        //input.value = 'New Todo';
    });
    button.addEventListener('click', showHide);
    clearAllButton.addEventListener('click',ClearAll);
}

const myStorageKey = 'todoList';
let todoListObject = importTodoList();
let NumberOfPendingTodos = Object.keys(todoListObject).length;
const completedTodos = {};
let completedPercent = 0;
const completed = document.querySelector('.completed>header>h4');
let today = document.querySelector('.today');
const button = document.querySelector('.toggle-completed');
const clearAllButton = document.querySelector('[value="Clear All"]');
init();

