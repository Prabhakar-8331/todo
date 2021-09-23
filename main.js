const form=document.querySelector("#itemForm");
const inputItem=document.querySelector("#itemInput");
const itemsList=document.querySelector("#itemsList");
const filters=document.querySelectorAll(".nav-item");



let todoItems = [];

//filter items
const getItemFilter = function(type){
    let filterItems = [];
    switch(type){
        case "todo" : filterItems = todoItems.filter((item) => !item.isDone); break;
        case "done" : filterItems = todoItems.filter((item) => item.isDone); break;
        default : filterItems = todoItems;
    }
    getList(filterItems);
};



//delete
const removeItem = function(item){
    const removeIndex = todoItems.indexOf(item);
    todoItems.splice(removeIndex,1);
};

// update 
const updateItem = function(currentItemIndex , value){
    const newItem = todoItems[currentItemIndex];
    newItem.name = value;
    todoItems.splice(currentItemIndex,1,newItem);
    setLocalStorage(todoItems);
}

// handle item 
const handleItem = function(itemData){
    const items =document.querySelectorAll(".list-group-item");
    items.forEach((item) => {
        if(item.querySelector(".title").getAttribute("date-time") == itemData.addedAt){

            // done item
            item.querySelector("[data-done]").addEventListener("click",function(e){
                e.preventDefault();
                const itemIndex = todoItems.indexOf(itemData);
                const currentItem = todoItems[itemIndex];
                const currentClass = currentItem.isDone ? "bi-check-circle-fill" : "bi-check-circle";
                currentItem.isDone = currentItem.isDone ? false : true;

                todoItems.splice(itemIndex,1,currentItem);
                setLocalStorage(todoItems);

                const iconClass = currentItem.isDone ? "bi-check-circle-fill" : "bi-check-circle";
                this.firstElementChild.classList.replace(currentClass,iconClass);

                //done in todo tab (2)
                const filterType = document.querySelector("#tabValue").value;
                getItemFilter(filterType);
            });

            // edit
            item.querySelector("[data-edit]").addEventListener("click",function(e){
                e.preventDefault();
                inputItem.value=itemData.name;
                document.querySelector("#objIndex").value = todoItems.indexOf(itemData);
            });

            // delete
            item.querySelector("[data-delete]").addEventListener("click",function(e){
                e.preventDefault();
                if(confirm("Are you sure want to remove this item????")){
                      itemsList.removeChild(item);
                      removeItem(item);
                      setLocalStorage(todoItems);
                      return todoItems.filter((item) => item != itemData);
                }
            });
        }
    });
};

//display list of iteams from getlist to main page  
const getList = function(todoItems){
    itemsList.innerHTML = " ";
    if(todoItems.length > 0){
    
       todoItems.forEach((item) => {
           
        const iconClass = item.isDone ? "bi-check-circle-fill" : "bi-check-circle"; // indicate work is done
        itemsList.insertAdjacentHTML("afterbegin",

                     `<li class="list-group-item d-flex justify-content-between align-item-center change" ">
                         <span class="title" date-time="${item.addedAt}">${item.name}</span>
                         <span>
                             <a href="#" data-done><i class="bi ${iconClass} green"></i></a>
                             <a href="#" data-edit><i class="bi bi-pencil-square blue"></i></a>
                             <a href="#" data-delete><i class="bi bi-x-circle red"></i></a>
                         </span>
                     </li>`
             );
       
      
                handleItem(item);
       });
    }// show messege  "no record" if tabs have no any records
    else{
        itemsList.insertAdjacentHTML("afterbegin",
                    `<li class="list-group-item d-flex justify-content-between align-item-center">
                        <span>No record found..</span>
                        
                    </li>`
            );
    }
};

// get data from local storage into getlist
const getLocalStorage = function(){
    const todoStorage =localStorage.getItem("todoItems");
    if(todoStorage === "undefined" || todoStorage === null){
        todoItems = [];
    }else{
        todoItems = JSON.parse(todoStorage);
    }
    getList(todoItems);
};

// set data in local storage
const setLocalStorage = function(todoItems){
    localStorage.setItem("todoItems",JSON.stringify(todoItems));
};



// starting line
document.addEventListener("DOMContentLoaded",() => {
    form.addEventListener("submit",(e) => {
        e.preventDefault();
        const itemName = inputItem.value.trim();
        if(itemName.length === 0){
                  alert("Please enter a task...");
            
        }else{
                //edit
                const currentItemIndex = document.querySelector("#objIndex").value;
                if(currentItemIndex){
                    //update
                    updateItem(currentItemIndex,itemName);
                    document.querySelector("#objIndex").value= "";
                    
                }else {
                    const itemObj = {
                        name : itemName ,
                        isDone :false ,
                        addedAt : new Date().getTime(),
                    };
                    todoItems.push(itemObj);
                    setLocalStorage(todoItems);
                };
                getList(todoItems);
        };
        inputItem.value = "";
    });

    //filter tabs
    filters.forEach((tab) => {
        tab.addEventListener('click', function(e){
            e.preventDefault();
            const tabType = this.getAttribute("data-type");
            document.querySelectorAll(".nav-link").forEach((nav) => {
                nav.classList.remove("active");
            });
            this.firstElementChild.classList.add("active");
            getItemFilter(tabType);

            //done in todo tab (1)
            document.querySelector("#tabValue").value = tabType;
        })
    });   
    //load itmes
    getLocalStorage();
});