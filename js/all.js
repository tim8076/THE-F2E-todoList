
;(function(){
    //header 頁籤切換
    let tabs = document.querySelectorAll('.header a');
    tabs.forEach(function (tab) {
        tab.addEventListener('click', function (e) {
            e.preventDefault();
            this.classList.add('active');
            $(this).siblings().removeClass('active');
            switch(this.id){
                case 'tasks':
                    newToDo('todo','complete');
                    break
                case 'progress':
                    newToDo('todo');
                    break
                case 'completed':
                    newToDo('complete');
            }
        })
    })

    //dom元素綁定
    const container = document.querySelector('#container');

    const addTaskInput = document.querySelector('.input-area');
    const addTaskContent = document.querySelector('.add-task-area');

    const todoSection = document.querySelector('.todo-section');
    const addTaskSaveBtn = document.querySelector('.task-button-save');
    const addTaskCloseBtn = document.querySelector('.task-button-cancel');
    const leftTodo = document.querySelector('.left-todo');
    
    //新增代辦事項區域 事件綁定
    addTaskInput.addEventListener('click',function(){
        addTaskContent.classList.toggle('active');
    })
    addTaskSaveBtn.addEventListener('click',addToDo);
    addTaskCloseBtn.addEventListener('click', function () {
        addTaskContent.classList.toggle('active');
    })
 
    let todoData = JSON.parse(localStorage.getItem('todoList')) || [];  

    function sort(){
        //重要事項往前排
        todoData.sort(function (a) {
            return a.important === 'important' ? -1 : 1;
        }) 
    }
    sort(); //預設載入排序

    function newToDo(status,status2){
        let str = '';
        let todoNum = 0;
        let completeNum = 0;

        //寫入資料
        todoData.forEach(function(todo,index){
            let important = todo.important === 'important' ? 'fa-star' : 'fa-star-o';
            let alertColor = todo.important === 'important' ? 'active' : '';
            let dateIcon = todo.date !== '' ? 'active' : '';
            let fileIcon = todo.file !== '' ? 'active' : '';
            let commentIcon = todo.comment !== '' ? 'active' : '';
            let checked = todo.status === 'complete' ? 'checked="checked"' : '';
            //計算剩餘待辦事項
            if (todo.status === 'todo'){
                todoNum += 1;
            }else if(todo.status === 'complete'){
                completeNum += 1;
            }

            if(status === todo.status || status2 === todo.status ){
                str += `
                <li class="todo-list-item" data-num="${index}">
                    <div class="task-title ${alertColor}">
                        <div class="task-title-row">
                            <div class="input">
                                <input type="checkbox" class="checkbox" id="check-${index}" ${checked}>
                                <label for="check-${index}" class="checkbox-label">
                                    <i class="fa fa-check" aria-hidden="true"></i>
                                </label>              
                                <input type="text" class="text" readonly="true" ondblclick="this.readOnly='';" placeholder="Type Something Here..." value="${todo.title}" >
                            </div>
                            <div class="icons">
                                <i class="fa fa-trash" aria-hidden="true"></i>
                                <div class="icon-star">
                                    <i class="fa ${important} js-alert" aria-hidden="true"></i>
                                </div>
                                <i class="fa fa-pencil" aria-hidden="true"></i>
                            </div>
                        </div> 
                        <div class="task-title-row">
                            <div class="icon-row">
                                <i class="fa fa-calendar ${dateIcon}" aria-hidden="true"></i>
                                <span class="${dateIcon}">${todo.date}</span>
                                <i class="fa fa-file-o ${fileIcon}" aria-hidden="true"></i>
                                <i class="fa fa-commenting-o ${commentIcon}" aria-hidden="true"></i>
                            </div>
                        </div>
                    </div>
                    <div class="task-content">
                        <div class="task-content-area dead-line">
                            <div class="icon">
                                <i class="fa fa-calendar" aria-hidden="true"></i>
                            </div>
                            <div class="dead-line-input">
                                <h3>Dead line</h3>
                                <input class="js-date" type="text" readonly="true" ondblclick="this.readOnly='';"  placeholder="yyy/mm/dd" value="${todo.date}">
                                <input class="js-hour" type="text" readonly="true" ondblclick="this.readOnly='';" placeholder="hh/mm" value="${todo.hour}">
                            </div>
                        </div>
                        <div class="task-content-area file">
                            <div class="icon">
                                <i class="fa fa-file-o" aria-hidden="true"></i>
                            </div>
                            <div class="file-input">
                                <h3>File</h3>
                                <a href="${todo.file}">${todo.file}</a>
                                <label for="file-${index}" class="file-label">+</label>
                                <input class="js-file" type="file" id="file-${index}" value="${todo.file}">
                            </div>
                        </div>
                        <div class="task-content-area comment">
                            <div class="icon">
                                <i class="fa fa-commenting-o" aria-hidden="true"></i>
                            </div>
                            <div class="comment-input">
                                <h3>Comment</h3>
                                <textarea placeholder="Type your memo here" style="resize: none;" readonly="true" ondblclick="this.readOnly='';" >${todo.comment}</textarea>
                            </div>
                        </div>
                    </div>
                    <div class="task-button">
                        <button class="task-button-cancel">
                            <i class="fa fa-times" aria-hidden="true"></i>Close
                        </button>
                        <button class="task-button-save" type="reset">
                            <i class="fa fa-plus" aria-hidden="true"></i>Save
                        </button>
                    </div>
                </li>       
                `  
            }
        })
        todoSection.innerHTML = str;         
        leftTodo.textContent = `${todoNum} tasks left`;   
        if(status === 'complete'){
            leftTodo.textContent = `${completeNum} tasks completed`;   
        }
    }
    newToDo('todo','complete'); //預設載入資料

    function addToDo(){
        let title = addTaskContent.querySelector('.text');
        let date = addTaskContent.querySelector('.js-date');
        let hour = addTaskContent.querySelector('.js-hour');
        let file = addTaskContent.querySelector('.js-file');
        let comment = addTaskContent.querySelector('textarea'); 
        let star = addTaskContent.querySelector('.icon-star i');   
        let important = '';     
        if (star.classList.contains('fa-star')){
            important = 'important';
        }
        let todo = {
            'status':'todo',
            'title':title.value,
            'date': date.value,
            'hour': hour.value,
            'file':file.value,
            'comment':comment.value,  
            'important':important
           }
        todoData.push(todo);
        localStorage.setItem('todoList', JSON.stringify(todoData));//儲存local storage資料     
        title.value = '';
        date.value = '';
        hour.value = '';
        file.value = '';
        comment.value = '';
        addTaskContent.classList.toggle('active');
        
        sort();
        newToDo('todo'); //插入新list
    }
    
    //todoSection 偵聽
    todoSection.addEventListener('click',function(e){
        let target = e.target;
        //todo-list-item 儲存修改資料
        if(target.className === 'task-button-save'){

            let checkbox = $(target).parents('.todo-list-item').find('.checkbox');
            let status = checkbox.prop('checked') === true ? 'complete' : 'todo';
            let title = $(target).parents('.todo-list-item').find('.text').val();
            let date = $(target).parents('.todo-list-item').find('.js-date').val();
            let hour = $(target).parents('.todo-list-item').find('.js-hour').val();
            let file = $(target).parents('.todo-list-item').find('.js-file').val();
            let comment = $(target).parents('.todo-list-item').find('textarea').val();
            let alert = $(target).parents('.todo-list-item').find('.js-alert');
            let alertColor = alert.hasClass('fa-star') ? 'important' : '';
            
            let num = $(target).parents('.todo-list-item').data('num');  
     
            todoData[num].status = status;
            todoData[num].important = alertColor;      
            todoData[num].title = title;
            todoData[num].date = date;
            todoData[num].hour = hour;
            todoData[num].file = file;
            todoData[num].comment = comment;
            localStorage.setItem('todoList', JSON.stringify(todoData) );
            newToDo('todo', 'complete');

        }
        //上傳檔案，顯示文字
        if(target.className === 'file-label'){
            let fileInput = $(target).siblings('.js-file');         

            fileInput.on('change',function(){
                let file = $(target).siblings('.js-file').val(); 
                $(this).siblings('a').text(file);
            })    
        }
        //刪除單一項目
        if (target.classList.contains('fa-trash')){
            if(confirm('確定刪除項目?')){
                let num = $(target).parents('.todo-list-item').data('num');
                todoData.splice(num, 1);
                localStorage.setItem('todoList', JSON.stringify(todoData));
                newToDo('todo', 'complete');
            }        
        }
    })
    
    //全域 container 偵聽
    container.addEventListener('click', function (e) {
        let target = e.target;
        //點擊星星，設為重要事項
        if (target.classList.contains('fa-star-o')) {
            target.classList.remove('fa-star-o');
            target.classList.add('fa-star')
        } else if (target.classList.contains('fa-star')) {
            target.classList.remove('fa-star');
            target.classList.add('fa-star-o')
        }
        //點擊鉛筆 展開內容
        if (target.classList.contains('fa-pencil') || target.classList.contains('task-button-cancel')) {
            $(target).parents('.todo-list-item').find('.task-content').toggleClass('active');
            $(target).parents('.todo-list-item').find('.task-button').toggleClass('active');
            $(target).parents('.todo-list-item').find('.fa-pencil').toggleClass('active');
        }
    })

 
})();




