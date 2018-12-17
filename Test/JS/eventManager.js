
let eventHolder =  [];
let eventEndorser = [];
let eventIndexer = [];
let eventPricer = [];
let eventRatingsAll = [];
let start = 0;
let loadingIndex = 0;
let orderMode= 1;
let eventJsonObject = null;
//loopIt(sortMode) kümmert sich um die korrekte Reihenfolge der Events, je nachdem welche Art der User gewählt hat
function loopIt(sortMode) {

    //Sortiert das Event Array chronologisch nach den neusten
    if(sortMode === 1){
        console.log("eventHolder 1: ");
        console.log(eventHolder);
        for(let i=0; i<=4; i++) {
            //console.log("loopIt | arrayEvent[loadingIndex].ID: " +  eventHolder[loadingIndex].ID);
            /*let event = new Event(arrayEvent[loadingIndex].ID, arrayEvent[loadingIndex].imageSrc, arrayEvent[loadingIndex].eventName, arrayEvent[loadingIndex].eventDate, arrayEvent[loadingIndex].eventPrice, arrayEvent[loadingIndex].eventTickets, arrayEvent[loadingIndex].maxEventTickets);
            event.checkIsExpired();
            eventHolder.push(event);
            console.log(event);*/
            if(loadingIndex <= eventHolder.length-1) {
                eventHolder[loadingIndex].checkIsExpired();
                createEventHTMLElements(eventHolder[loadingIndex]);
            } else {
                console.log("out of bound");
                break;
            }

            loadingIndex++;
        }
    }
    //Sortiert das Event Array chronologisch nach den ältesten
    if(sortMode === 2) {
        console.log("eventHolder 2: ");
        console.log(eventHolder);
        for (let i=eventHolder.length; i>=eventHolder.length-4; i--) {

           /* let event = new Event(arrayEvent[loadingIndex].ID, arrayEvent[loadingIndex].imageSrc, arrayEvent[loadingIndex].eventName, arrayEvent[loadingIndex].eventDate, arrayEvent[loadingIndex].eventPrice, arrayEvent[loadingIndex].eventTickets, arrayEvent[loadingIndex].maxEventTickets);
            event.checkIsExpired();
            eventHolder.push(event);
            console.log(event);*/
           if(loadingIndex >=0){
               eventHolder[loadingIndex].checkIsExpired();
               createEventHTMLElements(eventHolder[loadingIndex]);
           } else {
               console.log("out of bound");
               break;
           }
            loadingIndex--;
        }
    }
    //Sortiert das Event Array chronologisch nach den meist verkauften
    if(sortMode === 3) {

        console.log("EventEndorser: ");
        console.log(eventEndorser);
        for (let i=0; i<=4; i++) {
            /*let event = new Event(eventHolder[loadingIndex].ID, eventHolder[loadingIndex].imageSrc, eventHolder[loadingIndex].eventName, eventHolder[loadingIndex].eventDate, eventHolder[loadingIndex].eventPrice, eventHolder[loadingIndex].eventTickets, eventHolder[loadingIndex].maxEventTickets);
            event.checkIsExpired();
            eventHolder.push(event);
            console.log(event);*/

            if(loadingIndex <= eventPricer.length-1){
                createEventHTMLElements(eventEndorser[loadingIndex]);
            }
            else{
                console.log("Out of Bound");
                break;
            }
            loadingIndex++;

        }
    }
    //Sortiert das Event Array chronologisch nach dem Preis
    if(sortMode === 4) {

        console.log("EventPricer: ");
        console.log(eventPricer);
        for (let i=0; i<=4; i++) {
            /*let event = new Event(eventHolder[loadingIndex].ID, eventHolder[loadingIndex].imageSrc, eventHolder[loadingIndex].eventName, eventHolder[loadingIndex].eventDate, eventHolder[loadingIndex].eventPrice, eventHolder[loadingIndex].eventTickets, eventHolder[loadingIndex].maxEventTickets);
            event.checkIsExpired();
            eventHolder.push(event);
            console.log(event);*/
            if(loadingIndex <= eventPricer.length-1){
                createEventHTMLElements(eventPricer[loadingIndex]);
            }
            else{
                console.log("Out of Bound");
                break;
            }

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
//Funktion zum Fetchen der Events
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

//Funktion zum Fetchen der Rankings
function getRatings(cb) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let ratingJsonObject = this.responseText;
            if(typeof ratingJsonObject === 'string'){
                ratingJsonObject = JSON.parse(ratingJsonObject);
                cb(ratingJsonObject);
                console.log("rating received");
            }
        }
    };
    xmlhttp.open("GET", "PHP/getAllRatings.php", true);
    xmlhttp.send();

}

//Konvertiert Event String in ein Objekt Array
function getUpdatedData(cb, event) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
           let eventTickets = this.responseText;
            if(typeof eventTickets === 'string'){
                eventTickets = JSON.parse(eventTickets);
                cb(eventTickets);
            }
        }
    };
    xmlhttp.open("POST", "https://intranet-secure.de/TicketCorner/PHP/getUpdatedData.php", true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send("ID="+ event.id);
    console.log("getUpdateDataCall");
}
//Updated die Ticket Anazhl in der DOM
function updateTicketCount(ticketUpdate, event){
    let tickets = document.createTextNode(ticketUpdate[0].eventTickets);
    let ticketHTML = document.getElementById(event.id);
    let ticketDivider = document.createElement("div");
    ticketDivider.className = "dropdown-divider";

    ticketHTML.textContent = "";
    let bTag = document.createElement("b");
    bTag.textContent = "Anzahl der Tickets: ";
    ticketHTML.appendChild(bTag);
    ticketHTML.appendChild(tickets);
    ticketHTML.appendChild(ticketDivider);
    if(ticketUpdate[0].eventTickets === 0){
        ticketHTML.appendChild(document.createTextNode(" (AUSVERKAUFT)"));
    }

    console.log("UpdateHTMLCall for Event: " + event.name + " Tickets now at: " + ticketUpdate[0].eventTickets);
}

function iterator(){
    for(let i=0; i< eventPricer.length; i++){
        if(document.getElementById(eventPricer[i].id) != null){
            getUpdatedData(function(tickets){
                updateTicketCount(tickets, eventPricer[i]);
            }, eventPricer[i]);
        }
    }
}

setInterval("iterator()", 10000);
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

//CallBack Funktion zum Initialisieren der Event Arrays
function initEvents(eventJsonObject){
    for(let i=0; i<=eventJsonObject.length-1; i++){
        let event = new Event(eventJsonObject[i].ID, eventJsonObject[i].imageSrc, eventJsonObject[i].eventName, eventJsonObject[i].eventDate, eventJsonObject[i].eventPrice, eventJsonObject[i].eventLocation,eventJsonObject[i].eventTickets, eventJsonObject[i].maxEventTickets);
        eventHolder.push(event);
        console.log(event);

    }

    for(let i= 0; i<=eventHolder.length-1; i++){
        if(!eventHolder[i].expired){
            eventEndorser.push(eventHolder[i]);
            if(!eventHolder[i].soldout){
                eventPricer.push(eventHolder[i]);
            }
        }
    }

    rateEvents(eventRatingsAll);

    eventEndorser = quickSortEndorsement(eventEndorser, 0, eventEndorser.length-1).reverse();
    eventPricer = quickSortPrice(eventPricer, 0, eventPricer.length-1);
    updateSlideshow(eventEndorser);
    return eventHolder;
}
//Funktion zum Erstellen der DOM Elemente für Events
function createEventHTMLElements(event){
    event.calculateRating(event.ratingCount, event.ratingValue);
    let img = event.img.replace("../Events/img/","");
    let eventDiv = document.createElement("div");
    let eventImg = document.createElement("div");
    let eventInfo = document.createElement("div");

    let eventName = document.createElement("h2");
    let eventDate = document.createElement("p");
    let eventLocation = document.createElement("p");
    let eventPrice = document.createElement("p");
    let eventTickets = document.createElement("p");
    let eventRating = document.createElement("p");

    let btagDate = document.createElement("b");
    let btagLocation = document.createElement("b");
    let btagPrice = document.createElement("b");
    let btagTickets = document.createElement("b");
    let btagRating = document.createElement("b");
    let price = 0;
    if(getCookie("email").includes("hshl.de")){
         price = document.createTextNode(((event.price * 100) / 100)*0.85 + "€ (15% HSHL-Studenten Rabatt)");
    } else {
         price = document.createTextNode((event.price * 100) / 100 + "€");
    }

    let date = document.createTextNode(event.date);
    let location = document.createTextNode(event.location);
    let tickets = document.createTextNode(event.currentTickets);
    let rating = document.createTextNode(event.ratingCount);

    let eventLink = document.createElement("a");
    let imgElement = document.createElement("img");
    let dividerDate = document.createElement("div");
    let dividerPrice = document.createElement("div");
    let dividerTickets = document.createElement("div");
    let dividerRating = document.createElement("div");
    let dividerLocation = document.createElement("div");
    let dividerEvent = document.createElement("div");

    eventTickets.id = event.id;
    eventInfo.className = "eventInf";
    eventImg.className = "eventImg";
    eventDiv.className = "EventContainer";
    eventName.textContent = event.name;
    btagDate.textContent = "Zeitpunkt: ";
    btagPrice.textContent = "Preis: ";
    btagTickets.textContent = "Anzahl der Tickets: ";
    btagLocation.textContent = "Veranstaltungsort: ";
    btagRating.textContent = "Bewertungen: ";
    eventLink.href = "https://intranet-secure.de/TicketCorner/Events/html/" + img.replace(".jpg",".html");
    imgElement.src = "https://intranet-secure.de/TicketCorner/Events/img/"+ img;
    imgElement.height = 512;
    imgElement.width = 614.4;
    imgElement.id = "eventImg";
    dividerDate.className = "dropdown-divider";
    dividerPrice.className = "dropdown-divider";
    dividerTickets.className = "dropdown-divider";
    dividerRating.className = "dropdown-divider";
    dividerLocation.className = "dropdown-divider";
    dividerEvent.className = "divider";

    document.getElementById("maintext").appendChild(eventDiv);
    eventInfo.appendChild(eventName);

    eventInfo.appendChild(eventLocation);
    eventLocation.appendChild(btagLocation);
    eventLocation.appendChild(location);
    eventLocation.appendChild(dividerLocation);

    eventInfo.appendChild(eventDate);
    eventDate.appendChild(btagDate);
    eventDate.appendChild(date);
    eventDate.appendChild(dividerDate);

    eventInfo.appendChild(eventPrice);
    eventPrice.appendChild(btagPrice);
    eventPrice.appendChild(price);
    eventPrice.appendChild(dividerPrice);

    eventInfo.appendChild(eventTickets);
    eventTickets.appendChild(btagTickets);
    eventTickets.appendChild(tickets);
    eventTickets.appendChild(dividerTickets);

    eventInfo.appendChild(eventRating);
    eventRating.appendChild(btagRating);
    eventRating.appendChild(rating);
    eventInfo.appendChild(createRating(event));
    eventInfo.appendChild(dividerRating);

    eventImg.appendChild(eventLink);
    eventLink.appendChild(imgElement);

    eventDiv.appendChild(eventImg);
    eventDiv.appendChild(eventInfo);
    document.getElementById("maintext").appendChild(dividerEvent);
}

function createRating(event) {

    let spanTag = document.createElement("span");

    let inputStarOne = createStar(event.id);
    let inputStarTwo = createStar(event.id);
    let inputStarThree = createStar(event.id);
    let inputStarFour = createStar(event.id);
    let inputStarFive = createStar(event.id);

    let labelOne = createLabeli(event.id);
    let labelTwo = createLabeli(event.id);
    let labelThree = createLabeli(event.id);
    let labelFour = createLabeli(event.id);
    let labelFive = createLabeli(event.id);

    let starArray = [inputStarFive,labelFive ,inputStarFour,labelFour ,inputStarThree,labelThree ,inputStarTwo,labelTwo ,inputStarOne,labelOne];

    spanTag.className = "star-rating-overall";
    spanTag.title = "Bewertungsschnitt: " + event.rating;

    for(let i = 0; i<starArray.length; i++){
        spanTag.appendChild(starArray[i]);
    }

    switch(Math.round(event.rating)){
        case 1:
            inputStarOne.checked = true;
            break;
        case 2:
            inputStarTwo.checked = true;
            break;
        case 3:
            inputStarThree.checked = true;
            break;
        case 4:
            inputStarFour.checked = true;
            break;
        case 5:
            inputStarFive.checked = true;
            break;
    }

    return spanTag;
}

function rateEvents(ratings){
    let ratingValue;
    let ratingCount;
    let j;

    for(let i = 0; i < eventHolder.length; i++ ){
        ratingValue = 0;
        ratingCount = 0;
        j = 0;
        for(j; j < ratings.length; j++){
            if(eventHolder[i].id === ratings[j].eventID ) {
                ratingValue += parseInt(ratings[j].oneStar) * 1;
                ratingCount += parseInt(ratings[j].oneStar);

                ratingValue += parseInt(ratings[j].twoStars) * 2;
                ratingCount += parseInt(ratings[j].twoStars);

                ratingValue += parseInt(ratings[j].threeStars) * 3;
                ratingCount += parseInt(ratings[j].threeStars);

                ratingValue += parseInt(ratings[j].fourStars) * 4;
                ratingCount += parseInt(ratings[j].fourStars);

                ratingValue += parseInt(ratings[j].fiveStars) * 5;
                ratingCount += parseInt(ratings[j].fiveStars);
            }
        }
        eventHolder[i].ratingValue += ratingValue;
        eventHolder[i].ratingCount += ratingCount;
    }
    console.log("rating complete");
}

function createStar(id){
    let star = document.createElement("input");
    star.type = "radio";
    star.name = id;
    $(star).attr("disabled", true);
    return star;
}

function createLabeli(id){
    let label = document.createElement("label");
    let iTag = document.createElement("i");
    label.for = id;
    iTag.className = "active fa fa-star";
    iTag.setAttribute('aria-hidden', 'true');

    label.appendChild(iTag);

    return label;
}
//Constructor für die Events
function Event(id, img, name, date, price, eventLocation,tickets, maxTickets) {
    this.id = id;
    this.endorsement = (maxTickets - tickets) / maxTickets;
    this.price = parseFloat(price);
    this.img = img;
    this.name = name;
    this.date = date;
    this.location = eventLocation;
    this.maxTickets = parseInt(maxTickets);
    this.currentTickets = parseInt(tickets);
    this.rating = 0;
    this.ratingValue = 0;
    this.ratingCount = 0;
    this.calculateRating = function(ratingValue, ratingCount){
      this.rating = ((ratingCount/ratingValue)*100)/100;
    };
    this.expired = false;
    this.soldout = false;

    //Funktion zum Überprüfen des Datums
    this.checkIsExpired = function() {
        console.log("checkIsExpired | got called");
        if(!this.date) {
            console.log("checkIsExpired | no date defined, returning");
            return;
        }

        let currentDate = new Date();

        currentDate.setHours(0, 0, 0, 0);

        let eventDate = new Date(dateTransform(this.date));

        console.log("checkIsExpired | eventDate is: " + eventDate);

        if(eventDate < currentDate) {

            console.log("checkIsExpired | event is expired, should mark");

            //let expiredDiv = document.createElement("expiredDiv");
            //expiredDiv.className = "centered";

            //let text = document.createTextNode("ABGELAUFEN");
            //expiredDiv.appendChild(text);

            //this.imgElement.appendChild(expiredDiv);
            this.date = this.date.replace(" (ABGELAUFEN)","");
            this.date += " (ABGELAUFEN)";
            this.expired = true;
            console.log("checkIsExpired | should be marked as expired: " + this.name);
        }
        else{

            console.log("checkIsExpired | event is not expired, do nothing");
        }
    };

    this.checkIsSoldOut = function() {
        if(this.currentTickets <= 0) {
            this.currentTickets = this.currentTickets.toString().replace(" (AUSVERKAUFT)","");
            this.currentTickets += " (AUSVERKAUFT)";
            this.soldout = true;
        }
    };

    this.checkIsExpired();
    this.checkIsSoldOut();
}

function dateTransform(date){
    let preDateTranformed = date.split(",");
    preDateTranformed[0] = preDateTranformed[0].split(".").reverse().join(".");
    let dateTransformed = preDateTranformed.join(" ");
    return preDateTranformed[0];
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

//Scroll Funktion zum Nachladen der Events
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
    }if($(window).scrollTop() + $(window).height() == $(document).height() && orderMode === 4) {
        console.log("Bottom reached mode 4");
        loopIt(4);
    }
});
//Funktion zum Aufrufen der jeweiligen Sortier Funktion
function sortEvents(int){
    if(start === 0){
        eventIndexer = Array.from(Array(eventHolder.length).keys());
        start ++;
    }
    $("div").remove(".EventContainer");
    switch (int) {
        case 1:

            loadingIndex = 0;
            loopIt(int);
            orderMode = 1;
            break;
        case 2:

            loadingIndex = eventHolder.length-1;
            loopIt(int);
            orderMode = 2;
            break;
        case 3:

            loadingIndex = 0;
            loopIt(int);
            orderMode = 3;
            break;
        case 4:

            loadingIndex = 0;
            loopIt(int);
            orderMode = 4;
            break;
    }
}
//Search Funktion zum Suchen von Events
function search(value){

    $("#carouselExampleIndicators").fadeOut(1000);
    if(value === ""){
        $("#carouselExampleIndicators").fadeIn(1000);
    }

    $("div").remove(".EventContainer");
    let indicator = 0;
    let searchInput = value.toLowerCase();
    for(let i= 0; i<=eventHolder.length-1; i++){
        if(eventHolder[i].name.toLowerCase().includes(searchInput)){
            createEventHTMLElements(eventHolder[i]);
            orderMode = 5;
            indicator++;
        }
        else if(i >= eventHolder.length-1 && indicator === 0){
            let noResultFound = document.createElement("div");
            noResultFound.className = "EventContainer";
            let pTagNoResult = document.createElement("p");
            pTagNoResult.textContent = "Kein Suchergebnis gefunden";
            noResultFound.appendChild(pTagNoResult);
            document.getElementById("maintext").appendChild(noResultFound);
        }
    }
}


//Implementierung des QuickSort Algorithmus
function quickSortEndorsement(arr, left, right){
    let len = arr.length,
        pivot,
        partitionIndex;

    if(left < right){
        pivot = right;
        partitionIndex = partitionEndorsement(arr, pivot, left, right);
        //sort left and right
        quickSortEndorsement(arr, left, partitionIndex - 1);
        quickSortEndorsement(arr, partitionIndex + 1, right);
    }

    return arr;
}

function partitionEndorsement(arr, pivot, left, right){
    let pivotValue = arr[pivot].endorsement,
        partitionIndex = left;

    for(let i = left; i < right; i++){
        if(arr[i].endorsement < pivotValue){
            swapEndorsement(arr, i, partitionIndex);
            partitionIndex++;
        }
    }
    swapEndorsement(arr, right, partitionIndex);
    return partitionIndex;
}

function swapEndorsement(arr, i, j){
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

function quickSortPrice(arr, left, right){
    let len = arr.length,
        pivot,
        partitionIndex;

    if(left < right){
        pivot = right;
        partitionIndex = partitionPrice(arr, pivot, left, right);
        //sort left and right
        quickSortPrice(arr, left, partitionIndex - 1);
        quickSortPrice(arr, partitionIndex + 1, right);
    }

    return arr;
}

function partitionPrice(arr, pivot, left, right){
    let pivotValue = arr[pivot].price,
        partitionIndex = left;

    for(let i = left; i < right; i++){
        if(arr[i].price < pivotValue){
            swapPrice(arr, i, partitionIndex);
            partitionIndex++;
        }
    }
    swapPrice(arr, right, partitionIndex);
    return partitionIndex;
}

function swapPrice(arr, i, j){
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

function updateSlideshow(eventArray) {
    if(eventArray.length>=3){
        let firstSliderPath = "/TicketCorner"+ eventArray[0].img.replace("..","");
        let secondSliderPath = "/TicketCorner"+eventArray[1].img.replace("..","");
        let thirdSliderPath = "/TicketCorner"+eventArray[2].img.replace("..","");

        document.getElementById("firstSliderImg").src = firstSliderPath;
        document.getElementById("firstSlideshowLink").href = firstSliderPath.replace(/jpg|img/g,"html");
        document.getElementById("secondSliderImg").src = secondSliderPath;
        document.getElementById("secondSlideshowLink").href = secondSliderPath.replace(/jpg|img/g,"html");
        document.getElementById("thirdSliderImg").src = thirdSliderPath;
        document.getElementById("thirdSlideshowLink").href = thirdSliderPath.replace(/jpg|img/g,"html");
    } else {
        console.log("RERROR");
    }




}

