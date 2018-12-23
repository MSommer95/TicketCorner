
let eventHolder =  [];
let eventEndorser = [];
let eventIndexer = [];
let eventPricer = [];
let eventRatingsAll = [];
let start = 0;
let loadingIndex = 0;
let orderMode= 1;
let eventJsonObject = null;
let eventLoader = 0;
const eventMap = new Map();
const followMap = new Map();

function loopIt(sortMode) {

    //Sortiert das Event Array chronologisch nach den neusten
    if(sortMode === 1){
        console.log("eventHolder 1: ");
        console.log(eventHolder);
        for(let i=0; i<=4; i++) {
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

// Gibt zurück, ob ein Nutzer einem Event folgt
function getFollowedEvent(id, cb) {
    const userId = getCookie("ID");

    if(typeof id !== 'string') {
        id = id.toString();
    }

    if(!userId) {
        console.log("getFollowedEvent | user not logged in, returning");
        return;
    }

    if(!eventMap.has(id)){
        console.log("getFollowedEvent | Event doesnt exist, returning -> WHY?");
        return;
    }

    const followedEvent = eventMap.get(id);

    console.log(followedEvent);

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let result = JSON.parse(this.responseText);

            console.log(result);

            const currentFollowedEvent = result[0];

            console.log(currentFollowedEvent);

            if(currentFollowedEvent != null && currentFollowedEvent.ID === followedEvent.id) {
                cb(id,true);
                return;
            }

            cb(id,false);

        }
    };

    xmlhttp.open("POST", "PHP/getFollowedEvent.php", true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send("eventId="+ parseInt(followedEvent.id) + "&userId="+ userId);
    console.log("getFollowedEvent");
}

// Holt alle gefolgten Events des Nutzers aus der Datenbank
function getFollowedEvents(cb) {
    const userId = getCookie("ID");

    if(!userId) {
        console.log("getFollowedEvent | user not logged in, returning");
        return;
    }

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let followedEvents = JSON.parse(this.responseText);

            cb(followedEvents);
        }
    };

    xmlhttp.open("POST", "PHP/getFollowedEvents.php", true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send("userId="+ userId);
    console.log("getFollowedEvents");
}

//Updated die Ticket Anazhl in der DOM
function updateFollowButtons(followUpdate, event){
    if(followUpdate === true){
        document.getElementById(event.id +  "FollowBTN").textContent = "Unfollow";
        document.getElementById(event.id + "FollowBTN").setAttribute("onclick", "unFollow(" + event.id + ")");
    }
}

function followButtonsIterator(){
    for(let i=0; i< eventHolder.length; i++){
        if(document.getElementById(eventHolder[i].id  +  "FollowBTN") != null){
            getFollowedEvent(eventHolder[i].id, function(eventFollowStatus){
                updateFollowButtons(eventFollowStatus, eventHolder[i]);
            });
        }
    }
}

//Updated die Ticket Anazhl in der DOM
function updateTicketCount(ticketUpdate, event){
    let tickets = document.createTextNode(ticketUpdate[0].eventTickets + " von " + event.maxTickets);
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
        let sold = " (AUSVERKAUFT)";
        ticketHTML.appendChild(document.createTextNode(sold.bold()));
    }

    console.log("UpdateHTMLCall for Event: " + event.name + " Tickets now at: " + ticketUpdate[0].eventTickets);
}

// Ticketanzahl aktualisieren
function TicketIterator(){
    for(let i=0; i< eventPricer.length; i++){
        if(document.getElementById(eventPricer[i].id) != null){
            getUpdatedData(function(tickets){
                updateTicketCount(tickets, eventPricer[i]);
            }, eventPricer[i]);
        }
    }
}

// Gefolgte Events aktualisieren
function updateFollowMap(event) {
    if(followMap.has(event.id)) {
        followMap.delete(event.id);

        followMap.set(event.id, event);
        return;
    }

    followMap.set(event.id, event);
}

function unFollow(eventid){
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let eventJsonObject = this.responseText;
            if(typeof eventJsonObject === 'string'){

                document.getElementById(eventid +  "FollowBTN").textContent = "Follow";
                document.getElementById(eventid + "FollowBTN").setAttribute("onclick", "followEventHome(" + eventid + ")");
            }
        }
    };
    xmlhttp.open("POST", "PHP/deleteFollowedEvent.php", true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send("userId="+ getCookie("ID")+ "&eventId="+ eventid);

}

//CallBack Funktion zum Initialisieren der Event Arrays
function initEvents(eventJsonObject){
    for(let i=0; i<=eventJsonObject.length-1; i++){
        let event = new Event(eventJsonObject[i].ID, eventJsonObject[i].imageSrc, eventJsonObject[i].eventName, eventJsonObject[i].eventDate, eventJsonObject[i].eventPrice, eventJsonObject[i].eventLocation,eventJsonObject[i].eventTickets, eventJsonObject[i].maxEventTickets);
        if(event.followed) {
            updateFollowMap(event);
        }
        else {
            eventHolder.push(event);
            console.log(event);
        }
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
    console.log(eventMap);
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
    if(getCookie("email") != null && getCookie("email").includes("hshl.de")){
         price = document.createTextNode(((event.price * 100) / 100)*0.85 + "€ (15% HSHL-Studenten Rabatt)");
    } else {
         price = document.createTextNode((event.price * 100) / 100 + "€");
    }

    let date = document.createTextNode(event.date);
    let location = document.createTextNode(event.location);
    let tickets = document.createTextNode(event.currentTickets + " von " + event.maxTickets);
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

    if(getCookie("email") != null){

        let eventFollowBtn = document.createElement("button");

        eventFollowBtn.className = "flex-c-m btn bg1 bo-rad-23 hov1 m-text3 trans-0-4";
        eventFollowBtn.type = "button";
        eventFollowBtn.id = event.id + "FollowBTN";

        if(event.followed){
            eventFollowBtn.setAttribute("onclick", "unFollow(" + event.id + ")");
            eventFollowBtn.textContent = "Unfollow";
        } else {
            eventFollowBtn.setAttribute("onclick", "followEventHome(" + event.id + ")");
            eventFollowBtn.textContent = "Follow";
        }
        eventInfo.appendChild(eventFollowBtn);
    }
    eventDiv.appendChild(eventImg);
    eventDiv.appendChild(eventInfo);
    document.getElementById("maintext").appendChild(dividerEvent);
    eventLoader++;
}

// Bewertungsdarstellung generieren
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

// Eventbewertung für alle Events verarbeiten
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

// Datenbankeinträge für das Folgen von Events schreiben
function followEventHome(eventId) {
    const userId = getCookie("ID");

    if(typeof eventId !== 'string') {
        eventId = eventId.toString();
    }

    if(!userId) {
        console.log("followEventHome | user not logged in, returning -> HIDE BUTTON LATER");
        return;
    }

    if(!eventMap.has(eventId.toString())) {
        console.log("followEventHome | event doesnt exist, returning -> HOW CAN THIS HAPPEN?");
        return;
    }

    const eventToFollow = eventMap.get(eventId);

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let isFollowed = JSON.parse(this.responseText);

            if(isFollowed.insertId !== 0) {
                console.log('followEventHome | New entry for following event added: ' + isFollowed.insertId);

                eventToFollow.isFollowed = true;
                updateFollowMap(eventToFollow);
                document.getElementById(eventId +  "FollowBTN").textContent = "Unfollow";
                document.getElementById(eventId + "FollowBTN").setAttribute("onclick", "unFollow(" + eventId + ")");

            }
        }
    };

    xmlhttp.open("POST", "https://intranet-secure.de/TicketCorner/PHP/addFollowedEvent.php", true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send("userId="+ userId + "&eventId="+ eventToFollow.id);
    console.log("addFollowedEvent");
}

// Betwertungsstern generieren und zurückgeben
function createStar(id){
    let star = document.createElement("input");
    star.type = "radio";
    star.name = id;
    $(star).attr("disabled", true);
    return star;
}

// Label erstellen und zurückgeben
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
    this.followed = false;

    if(eventMap.has(this.id)) {
        eventMap.delete(this.id);
    }
    eventMap.set(this.id, this);

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

            this.date = this.date.replace(" (ABGELAUFEN)","");
            this.date += " (ABGELAUFEN)";
            this.expired = true;

            console.log("checkIsExpired | should be marked as expired: " + this.name);
        }
        else{

            console.log("checkIsExpired | event is not expired, do nothing");
        }
    };

    //Funktion zum Überprüfen des Ticketbestands
    this.checkIsSoldOut = function() {
        if(this.currentTickets <= 0) {
            this.maxTickets = this.maxTickets.toString().replace(" (AUSVERKAUFT)","");
            this.maxTickets += " (AUSVERKAUFT)";
            this.soldout = true;
        }
    };

    //Funktion zum Überprüfen des Followstatus
    this.checkIsFollowed = function() {
        //Event instanz zwischenspeichern
        const self = this;

        getFollowedEvent(this.id, function(result) {
            //In Callback bei ankommen des Resulatats zuweisen
            self.followed = result;
            console.log("Event.checkIsFollowed | Event should be marked as followed");
            if(document.getElementById(id  +  "FollowBTN") != null && result === true){
                document.getElementById(id +  "FollowBTN").textContent = "Unfollow";
                document.getElementById(id + "FollowBTN").setAttribute("onclick", "unFollow(" + id + ")");
            }

        });
    };

    this.destroy = function() {
        if(eventMap.has(this.id)) {
            eventMap.delete(this.id);
        }
        delete this;
    };

    //Aufruf der Prüffunktionen
    this.checkIsExpired();
    this.checkIsSoldOut();
    this.checkIsFollowed();
}

// Datumsformatierung für Weiterverarbeitung anpassen
function dateTransform(date){
    let preDateTranformed = date.split(",");
    preDateTranformed[0] = preDateTranformed[0].split(".").reverse().join(".");
    let dateTransformed = preDateTranformed.join(" ");
    return preDateTranformed[0];
}

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
    $("div").remove(".divider");
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
    $("div").remove(".divider");
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

// Sortieren nach Preis mit Quick Sort
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

// Slideshow darstellung erneuern
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
function iterators(){
    TicketIterator();
    followButtonsIterator();
}

setInterval("iterators()", 10000);
