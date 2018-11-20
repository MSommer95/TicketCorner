
let eventHolder =  [];
let eventIndexer = [];
let start = 0;
let loadingIndex = 0;
let orderMode= 1;
let eventJson = null;

function loopIt(arrayEvent, sortMode) {

    if(sortMode === 1){

        for(let i=0; i<=4; i++) {
            let event = new Event(arrayEvent[loadingIndex].imageSrc, arrayEvent[loadingIndex].eventName, arrayEvent[loadingIndex].eventDate);
            event.checkIsExpired();
            eventHolder.push(event);
            console.log(event);
            loadingIndex++;
        }
    }
    if(sortMode === 2) {

        for (let i=eventJson.length; i>=eventJson.length-4; i--) {
            let event = new Event(arrayEvent[loadingIndex].imageSrc, arrayEvent[loadingIndex].eventName, arrayEvent[loadingIndex].eventDate);
            event.checkIsExpired();
            eventHolder.push(event);
            console.log(event);
            loadingIndex--;
        }
    }
}

function getEvents(cb) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            eventJson = this.responseText;
            if(typeof eventJson === 'string'){
                eventJson = JSON.parse(eventJson);
                cb(eventJson);
            }
        }
    };
    xmlhttp.open("GET", "PHP/getEvents.php", true);
    xmlhttp.send();

}

/*function checkIsEventExpired(event) {
    if(!event.eventDate)
        return;

    let currentDate = new Date();

    currentDate.setHours(0, 0, 0, 0);

    if(event.eventDate < currentDate) {
        let expiredDiv = document.createElement("div");
        expiredDiv.className = "Centered";
        expiredDiv.textContent = "ABGELAUFEN";
        event.imgElement.appendChild(expiredDiv);
    }
}*/

/*function getEvents() {
    let arrayEventName = [];
    let arrayImagePath = [];

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let split = this.responseText;
            let testJson = JSON.parse(split);
            console.log(testJson);
            console.log(testJson[0].eventName);
            split = clearString(split);
            split = split.split(",");
            [arrayEventName, arrayImagePath] = breakArray(split);
            loopIt(arrayImagePath, arrayEventName);
        }
    };
    xmlhttp.open("GET", "PHP/getEvents.php", true);
    xmlhttp.send();
}*/
/*function clearString(str){
    console.log(str);
    str = str.replace(/{|}|"|imageSrc|:|eventName/g,"");
    console.log(str);
    str = str.slice(1,-3);
    console.log(str);
    return str;
}*/
/*function breakArray(arr){
    let arrayEventName = [];
    let arrayImagePath = [];

    for(i=0; i<arr.length;i += 2){
        arrayEventName.push(arr[i]);
        arrayImagePath.push(arr[i+1]);
    }
    return [arrayEventName,arrayImagePath];
}*/
function Event(img, name, date) {
    this.cleanImgID = img.replace("../Events/img/","");
    this.eventDiv = document.createElement("div");
    this.eventDiv.className = "EventContainer";
    this.eventName = document.createElement("h1");
    this.eventName.textContent = name;
    this.eventDate = document.createElement("div");
    this.eventDate.textContent = date;
    this.eventLink = document.createElement("a");
    this.eventLink.href = "https://intranet-secure.de/TicketCorner/Events/html/" + this.cleanImgID.replace(".jpg",".html");
    this.imgElement = document.createElement("img");
    this.imgElement.src = "https://intranet-secure.de/TicketCorner/Events/img/"+this.cleanImgID;
    this.imgElement.height = 400;
    this.imgElement.width = 800;

    document.getElementById("maintext").appendChild(this.eventDiv);
    this.eventDiv.appendChild(this.eventName);
    this.eventDiv.appendChild(this.eventLink);
    this.eventLink.appendChild(this.imgElement);

    this.checkIsExpired = function() {
        console.log("checkIsExpired | got called");
        if(!this.eventDate.textContent) {
            console.log("checkIsExpired | no date defined, returning");
            return;
        }

        let currentDate = new Date();

        currentDate.setHours(0, 0, 0, 0);

        let eventDate = new Date(this.eventDate.textContent);

        console.log("checkIsExpired | eventDate is: " + eventDate);

        if(eventDate < currentDate) {

            console.log("checkIsExpired | event is expired, should mark");

            //let expiredDiv = document.createElement("expiredDiv");
            //expiredDiv.className = "centered";

            //let text = document.createTextNode("ABGELAUFEN");
            //expiredDiv.appendChild(text);

            //this.imgElement.appendChild(expiredDiv);
            this.eventName.textContent += " (ABGELAUFEN)";
            console.log("checkIsExpired | should be marked as expired: " + this.eventName.textContent);
        }
        else{
            console.log("checkIsExpired | event is not expired, do nothing");
        }
    }
}

/*function sortEvents(int){
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
    }*/
    /*else if (int == 2){
        if(eventIndexer[0] == 0){
            let wrapper = $('.container'),
                items = wrapper.children('.EventContainer'),
                arr = eventIndexer.reverse();
            wrapper.append( $.map(arr, function (v){return items[v]}));

        }
    }
}*/

getEvents(function(events){
    loopIt(events, 1);
});


$(window).scroll(function() {
    if($(window).scrollTop() + $(window).height() == $(document).height() && orderMode === 1) {
        console.log("Bottom reached");
        loopIt(eventJson, 1);
    } else if($(window).scrollTop() + $(window).height() == $(document).height() && orderMode === 2) {
        console.log("Bottom reached");
        loopIt(eventJson, 2);
    }
});

function sortEvents(int){
    if(start === 0){
        eventIndexer = Array.from(Array(eventHolder.length).keys());
        start ++;
    }
    if(int===1){
        $("div").remove(".EventContainer");
        loadingIndex = 0;
        loopIt(eventJson, int);
        orderMode = 1;

    }

    if(int===2){
        $("div").remove(".EventContainer");
        loadingIndex = eventJson.length-1;
        loopIt(eventJson, int);
        orderMode = 2;
    }

}