
let eventHolder =  [];
let eventEndorser = [];
let eventIndexer = [];
let start = 0;
let loadingIndex = 0;
let orderMode= 1;
let eventJsonObject = null;

function loopIt(sortMode) {

    if(sortMode === 1){
        console.log("eventHolder 1: ");
        console.log(eventHolder);
        for(let i=0; i<=4; i++) {
            //console.log("loopIt | arrayEvent[loadingIndex].ID: " +  eventHolder[loadingIndex].ID);
            /*let event = new Event(arrayEvent[loadingIndex].ID, arrayEvent[loadingIndex].imageSrc, arrayEvent[loadingIndex].eventName, arrayEvent[loadingIndex].eventDate, arrayEvent[loadingIndex].eventPrice, arrayEvent[loadingIndex].eventTickets, arrayEvent[loadingIndex].maxEventTickets);
            event.checkIsExpired();
            eventHolder.push(event);
            console.log(event);*/
            eventHolder[loadingIndex].checkIsExpired();
            createEventHTMLElements(eventHolder[loadingIndex]);
            loadingIndex++;
        }
    }
    if(sortMode === 2) {
        console.log("eventHolder 2: ");
        console.log(eventHolder);
        for (let i=eventHolder.length; i>=eventHolder.length-4; i--) {

           /* let event = new Event(arrayEvent[loadingIndex].ID, arrayEvent[loadingIndex].imageSrc, arrayEvent[loadingIndex].eventName, arrayEvent[loadingIndex].eventDate, arrayEvent[loadingIndex].eventPrice, arrayEvent[loadingIndex].eventTickets, arrayEvent[loadingIndex].maxEventTickets);
            event.checkIsExpired();
            eventHolder.push(event);
            console.log(event);*/
            eventHolder[loadingIndex].checkIsExpired();
            createEventHTMLElements(eventHolder[loadingIndex]);
            loadingIndex--;
        }
    }
    if(sortMode === 3) {

        console.log("EventEndorser: ");
        console.log(eventEndorser);
        for (let i=0; i<=4; i++) {
            /*let event = new Event(eventHolder[loadingIndex].ID, eventHolder[loadingIndex].imageSrc, eventHolder[loadingIndex].eventName, eventHolder[loadingIndex].eventDate, eventHolder[loadingIndex].eventPrice, eventHolder[loadingIndex].eventTickets, eventHolder[loadingIndex].maxEventTickets);
            event.checkIsExpired();
            eventHolder.push(event);
            console.log(event);*/

            createEventHTMLElements(eventEndorser[loadingIndex]);


            loadingIndex++;

        }
    }
}

/*function bubbleSort(arr){
    let arrTest = arr;
    let len = arrTest.length;
    for (let i = len-1; i>=0; i--){
        for(let j = 1; j<=i; j++){
            if(arrTest[j-1].endorsement>arrTest[j].endorsement){
                let temp = arrTest[j-1];
                arrTest[j-1] = arrTest[j];
                arrTest[j] = temp;
            }
        }
    }
    return arrTest;
}*/

function getEvents(cb) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let eventJsonObject = this.responseText;
            if(typeof eventJsonObject === 'string'){
                eventJsonObject = JSON.parse(eventJsonObject);
                cb(eventJsonObject);
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


function initEvents(eventJsonObject){
    for(let i=0; i<=eventJsonObject.length-1; i++){
        let event = new Event(eventJsonObject[i].ID, eventJsonObject[i].imageSrc, eventJsonObject[i].eventName, eventJsonObject[i].eventDate, eventJsonObject[i].eventPrice, eventJsonObject[i].eventTickets, eventJsonObject[i].maxEventTickets);
        eventHolder.push(event);
        console.log(event);

    }

    for(let i= 0; i<=eventHolder.length-1; i++){
        eventHolder[i].checkIsExpired();
        if(!eventHolder[i].expired){
            eventEndorser.push(eventHolder[i]);
        }
    }

    eventEndorser = quickSort(eventEndorser, 0, eventEndorser.length-1).reverse();
    return eventHolder;
}

function createEventHTMLElements(event){
    let img = event.img.replace("../Events/img/","");
    let eventDiv = document.createElement("div");
    eventDiv.className = "EventContainer";
    let eventName = document.createElement("h1");
    eventName.textContent = event.name;
    let eventDate = document.createElement("div");
    eventDate.textContent = event.date;
    let eventPrice = event.price;
    let eventLink = document.createElement("a");
    eventLink.href = "https://intranet-secure.de/TicketCorner/Events/html/" + img.replace(".jpg",".html");
    let imgElement = document.createElement("img");
    imgElement.src = "https://intranet-secure.de/TicketCorner/Events/img/"+ img;
    imgElement.height = 400;
    imgElement.width = 800;

    document.getElementById("maintext").appendChild(eventDiv);
    eventDiv.appendChild(eventName);
    eventDiv.appendChild(eventLink);
    eventLink.appendChild(imgElement);
}

function Event(id, img, name, date, price, tickets, maxTickets) {
    this.id = id;
    this.endorsement = (maxTickets - tickets) / maxTickets;
    this.img = img;
    this.name = name;
    this.date = date;
    this.price = price;
    this.expired = false;



    this.checkIsExpired = function() {
        console.log("checkIsExpired | got called");
        if(!this.date) {
            console.log("checkIsExpired | no date defined, returning");
            return;
        }

        let currentDate = new Date();

        currentDate.setHours(0, 0, 0, 0);


        let dateTransformed = this.date.split(".").reverse().join(".");
        let eventDate = new Date(dateTransformed);

        console.log("checkIsExpired | eventDate is: " + eventDate);

        if(eventDate < currentDate) {

            console.log("checkIsExpired | event is expired, should mark");

            //let expiredDiv = document.createElement("expiredDiv");
            //expiredDiv.className = "centered";

            //let text = document.createTextNode("ABGELAUFEN");
            //expiredDiv.appendChild(text);

            //this.imgElement.appendChild(expiredDiv);
            this.name = this.name.replace(" (ABGELAUFEN)","");
            this.name += " (ABGELAUFEN)";
            this.expired = true;
            console.log("checkIsExpired | should be marked as expired: " + this.name);
        }
        else{

            console.log("checkIsExpired | event is not expired, do nothing");
        }
    }
}

/*function getEventById(eventId) {
    event.preventDefault();
    console.log("eventManager | getEventById called with id: " + eventId);

    let foundEvent = null;


    getEvents(function(events) {
        console.log("eventManager | eventHolder.length: " + events.length);

        for (let i = 0; i < events.length; i++) {
            let currentEvent = events[i];
            let event = new Event(currentEvent.ID, currentEvent.imageSrc, currentEvent.eventName, currentEvent.eventDate);

            event.checkIsExpired();

            console.log("eventManager | loop | EventId: " + currentEvent.id);

            if(event.id === eventId) {

                console.log("eventManager | event was found in holder");

                if(event.expired) {
                    console.log("eventManager | event is expired, should show popup");
                    window.alert("Die Veranstaltung hat bereits stattgefunden");
                    return;
                }

                foundEvent = currentEvent;
            }
        }

        if(foundEvent) {
            buyProcess(foundEvent.id, foundEvent.eventName.textContent, foundEvent.eventPrice.textContent, foundEvent.eventDescription.textContent);
            console.log("eventManager | Ticket should be bought");
        }
        else
            window.alert("FEHLER: Die angegebene Veranstaltung konnte nicht gefunden werden!");
    });
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
    }*/
    /*else if (int == 2){
        if(eventIndexer[0] == 0){
            let wrapper = $('.container'),
                items = wrapper.children('.EventContainer'),
                arr = eventIndexer.reverse();
            wrapper.append( $.map(arr, function (v){return items[v]}));

        }
    }
}

getEvents(function(events) {
    loopIt(events, 1);
});*/


$(window).scroll(function() {
    if($(window).scrollTop() + $(window).height() == $(document).height() && orderMode === 1) {
        console.log("Bottom reached mode 1");
        loopIt(1);
    } else if($(window).scrollTop() + $(window).height() == $(document).height() && orderMode === 2) {
        console.log("Bottom reached mode 2");
        loopIt(2);
    } else if($(window).scrollTop() + $(window).height() == $(document).height() && orderMode === 3) {
        console.log("Bottom reached mode 3");
        loopIt(3);
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
        loopIt(int);
        orderMode = 1;

    }

    if(int===2){
        $("div").remove(".EventContainer");
        loadingIndex = eventHolder.length-1;
        loopIt(int);
        orderMode = 2;
    }

    if(int===3){
        $("div").remove(".EventContainer");
        loadingIndex = 0;
        loopIt(int);
        orderMode = 3;
    }

}

function quickSort(arr, left, right){
    let len = arr.length,
        pivot,
        partitionIndex;


    if(left < right){
        pivot = right;
        partitionIndex = partition(arr, pivot, left, right);

        //sort left and right
        quickSort(arr, left, partitionIndex - 1);
        quickSort(arr, partitionIndex + 1, right);
    }
    return arr;
}

function partition(arr, pivot, left, right){
    let pivotValue = arr[pivot].endorsement,
        partitionIndex = left;

    for(let i = left; i < right; i++){
        if(arr[i].endorsement < pivotValue){
            swap(arr, i, partitionIndex);
            partitionIndex++;
        }
    }
    swap(arr, right, partitionIndex);
    return partitionIndex;
}

function swap(arr, i, j){
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

