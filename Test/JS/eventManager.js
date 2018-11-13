
let eventHolder =  [];
let start = 0;
let eventIndexer = [];
function loopIt(arrayImagePath, arrayEventName){
    for(i=0;i<arrayImagePath.length;i++){
        let event = new Event(arrayImagePath[i],arrayEventName[i]);
        eventHolder.push(event);
        console.log(arrayEventName[i]);
        console.log(arrayImagePath[i]);
        console.log(event);
    }
}
function getEvents() {
    let arrayEventName = [];
    let arrayImagePath = [];

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let split = this.responseText;
            split = clearString(split);
            split = split.split(",");
            [arrayEventName, arrayImagePath] = breakArray(split);
            console.log(split);
            console.log(arrayEventName);
            console.log(arrayImagePath);
            loopIt(arrayImagePath, arrayEventName);
        }
    };
    xmlhttp.open("GET", "PHP/getEvents.php", true);
    xmlhttp.send();
}
function clearString(str){
    console.log(str);
    str = str.replace(/{|}|"|imageSrc|:|eventName/g,"");
    console.log(str);
    str = str.slice(1,-3);
    console.log(str);
    return str;
}
function breakArray(arr){
    let arrayEventName = [];
    let arrayImagePath = [];

    for(i=0; i<arr.length;i += 2){
        arrayEventName.push(arr[i]);
        arrayImagePath.push(arr[i+1]);
    }
    return [arrayEventName,arrayImagePath];
}
function Event(img, name){
    this.cleanImgID = img.replace("../Events/img/","");
    this.eventDiv = document.createElement("div");
    this.eventDiv.className = "EventContainer";
    this.eventName = document.createElement("h1");
    this.eventName.textContent = name;
    this.eventLink = document.createElement("a");
    this.eventLink.href = "http://intranet-secure.de/TicketCorner/Events/html/" + this.cleanImgID.replace(".jpg",".html");
    this.imgElement = document.createElement("img");
    this.imgElement.src = "http://intranet-secure.de/TicketCorner/Events/img/"+this.cleanImgID;
    this.imgElement.height = 400;
    this.imgElement.width = 800;

    document.getElementById("maintext").appendChild(this.eventDiv);
    this.eventDiv.appendChild(this.eventName);
    this.eventDiv.appendChild(this.eventLink);
    this.eventLink.appendChild(this.imgElement);
}

function sortEvents(int){
    if(start == 0){
        eventIndexer = Array.from(Array(eventHolder.length).keys());
        start ++;
    }

    if(int == 1){
        if(eventIndexer[0] != 0){
            let wrapper = $('.container'),
                items = wrapper.children('.EventContainer'),
                arr = eventIndexer;
            wrapper.append( $.map(arr, function (v){return items[v]}));
            eventIndexer.reverse();

        }
    }
    else if (int == 2){
        if(eventIndexer[0] == 0){
            let wrapper = $('.container'),
                items = wrapper.children('.EventContainer'),
                arr = eventIndexer.reverse();
            wrapper.append( $.map(arr, function (v){return items[v]}));

        }
    }
}
getEvents();
