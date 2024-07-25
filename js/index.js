const button = document.querySelector(".window__add-button")
const inputField = document.querySelector(".window__input")

const list = document.querySelector(".window__list")
const windowInputPanel = document.querySelector(".window__input-panel")

button.onclick = function (){
    let value = inputField.value.trimStart();
    if (value === ""){
        let errorMessage = document.createElement("div");
        errorMessage.innerHTML = "Input is empty!";
        errorMessage.id = "error-message";
        windowInputPanel.appendChild(errorMessage);
        errorMessage.classList.add("show");
        
        setTimeout(() => {
            errorMessage.remove();
        }, 2000);
    }
    else {
        let listItem = createListItem(value);
        list.appendChild(listItem);
        inputField.value = "";
    }
}

function createListItem(text){
    let item = document.createElement("li");
    item.classList.add("item");
    item.setAttribute("draggable", "true");
    item.innerHTML = `<div class="item__check-mark">
                         <div class="item__check-mark-body">
                            <img class = "hidden" src="img/check-mark.png" alt="">
                         </div>
                      </div>
                      <div class="item__text">${text}</div>
                      <div class="item__delete-button"></div>`

    return item;
}

document.querySelector("body").addEventListener("dragover", (e) => e.preventDefault());

list.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("item")) {
        setTimeout(() => e.target.classList.add("dragging"), 0)
    }
});
list.addEventListener("dragend", (e) => {
    if (e.target.classList.contains("item")) {
        e.target.classList.remove("dragging");
    }
});

let scrollInterval = null;
let currentScrollSpeed = 0;

list.addEventListener("dragover",(e) =>{
    e.preventDefault();
    const draggingItem = list.querySelector(".dragging");
    const items = [...list.querySelectorAll(".item:not(.dragging)")];

    let nextItem = items.find(item =>{
        return e.clientY + list.scrollTop <= item.offsetTop + item.offsetHeight / 2;
    })
    list.insertBefore(draggingItem, nextItem);

    //Auto Scroll
    let offsetTop = e.clientY - list.offsetTop;
    let offsetBottom = list.offsetTop + list.clientHeight - e.clientY;

    let maxOffset = 150;
    if (offsetTop < maxOffset){
        currentScrollSpeed = -(maxOffset + 10 - offsetTop) / 20;
        if (!scrollInterval){
            scrollInterval = setInterval(() => list.scrollBy(0, currentScrollSpeed), 5);
        }
    }else if (offsetBottom < maxOffset){
        currentScrollSpeed = (maxOffset + 10 - offsetBottom) / 20;
        if (!scrollInterval){
            scrollInterval = setInterval(() => list.scrollBy(0, currentScrollSpeed), 5);
        }
    }
    else {
        currentScrollSpeed = 0;
        clearInterval(scrollInterval);
        scrollInterval = null;
    }
})
list.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

list.addEventListener("dragenter", (e) => e.preventDefault());

document.querySelector("body").addEventListener("drop", () => {
    clearInterval(scrollInterval);
    scrollInterval = null;
})

list.addEventListener("click", (e) => {
    if(e.target.classList.contains("item__delete-button")){
        list.removeChild(e.target.closest(".item"));
    }
    else if(e.target.closest(".item__check-mark")){
        const item = e.target.closest(".item");

        const body = item.querySelector(".item__check-mark-body");
        body.classList.toggle("item__check-mark-body__active");

        const img = item.querySelector(".item__check-mark-body img");
        img.classList.toggle("hidden");

        const text = item.querySelector(".item__text")
        text.classList.toggle("line-through");
    }
})


let hideTimeout;

const mutationObserver = new MutationObserver(() => {
    list.classList.remove("hidden-scrollbar");
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
        list.classList.add("hidden-scrollbar");
    }, 2000);
});
mutationObserver.observe(list, { childList: true, subtree: true, characterData: true });

list.addEventListener("scroll", (e) => {
    list.classList.remove("hidden-scrollbar");

    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
        list.classList.add("hidden-scrollbar");
    }, 2000)
})