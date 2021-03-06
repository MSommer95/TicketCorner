let eventJson = null;
let commentsJSON = null;
let ratingJSON = null;
let ratingOwnJSON = null;
let ID = getHTMLname();
let commentHolder = [];
let initPage = 1;
let currentEvent;
//Funktion zur Cookie Findung (Über den Namen als String)
window.getCookie = function(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
};
//Funktion zur ID Seperierung der Event Page
function getHTMLname(){
    let path = window.location.pathname;
    let page = path.split("/").pop();
    page = page.replace(".html", "");
    return page;
}
//Get Funtion an PHP getUpdateData.php für den Event String
//Konvertiert Event String in ein Objekt Array
function getUpdatedData(cb) {
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
    xmlhttp.open("POST", "https://intranet-secure.de/TicketCorner/PHP/getUpdatedData.php", true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send("ID="+ ID);
}
//Updated die Ticket Anazhl in der DOM
function updateTicketCount(ticketUpdate){
    let ticketHTML = document.getElementById("eventTickets");
    let tickets = document.createTextNode(ticketUpdate[0].eventTickets + " von " + currentEvent.maxTickets);

    ticketHTML.textContent = "";
    let bTag = document.createElement("b");
    bTag.textContent = "Anzahl der Tickets: ";
    ticketHTML.appendChild(bTag);
    ticketHTML.appendChild(tickets);
    if(ticketUpdate[0].eventTickets === 0){
        ticketHTML.appendChild(document.createTextNode(" (AUSVERKAUFT)"));
    }
}

function updatePrice(price){

    let priceText = document.createTextNode(price + "€ (15% HSHL-Studenten Rabatt)");
    let priceTag = document.getElementById("eventPrice");
    priceTag.textContent = "";
    let bTag = document.createElement("b");
    bTag.textContent = "Preis: ";
    priceTag.appendChild(bTag);
    priceTag.appendChild(priceText);
}

//Initialisiert drei Callback Funktionen mit PHP Aufrufen
function initProcess(){
    //Ruft CallBackFunktion zur Aktualisierung der Kommentare auf
    getComments(function (comments) {
        createCommentSection(comments);
    });
    //Ruft CallBackFunktion zur Aktualisierung der Ratings auf
    getRating(function (events) {
        updateRating(events);
    });
    //Ruft CallBackFunktion zur Aktualisierung der Tickets auf
    getUpdatedData(function(events){
        updateTicketCount(events);
    });
}

//Funktion zum Senden eines Kommentars an ein PHP uploadeComments.php Script auf dem Server
function sendCommentForm(){

    let messageField = document.getElementById("comment-section");
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "https://intranet-secure.de/TicketCorner/PHP/uploadeComments.php", true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send("postID="+ ID + "&userID=" + getCookie("ID") + "&userName=" + getCookie("forename") + " " + getCookie("surname") + "&message=" + messageField.value);
    xmlhttp.onload = function () {
        initProcess();
        messageField.value = "";
        toggleNotification(true, "<b>Kommentar wurde gepostet.", "information");
    }
}
//Funktion zur schnellen Generierung von form Tags
function inputCreate(form, value ,name) {
    let tag = document.createElement("INPUT");
    tag.name = name;
    tag.value = value;
    tag.type = 'hidden';
    form.appendChild(tag);
}
//Funktion zur Erstellung der Kommentar Felder
function createCommentSection(commentsJSON) {
    $("div").remove(".commentSection");
    for(i=0;i<=commentsJSON.length-1;i++){
        let comment = new Comment(commentsJSON[i].userName, commentsJSON[i].datetime, commentsJSON[i].message, commentsJSON[i].ID);
        createComment(comment);
        commentHolder.push(comment);
    }
}
//Funktion zum Fetchen der Kommentare des jeweiligen Events
function getComments(cb) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            commentsJSON = this.responseText;
            if(typeof commentsJSON === 'string'){
                commentsJSON = JSON.parse(commentsJSON);
                cb(commentsJSON);
            }
        }
    };
    xmlhttp.open("POST", "https://intranet-secure.de/TicketCorner/PHP/getComments.php", true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send("postID="+ ID);
}

function createComment(comment){
    let sectionSplitterOne = document.createElement("div");
    sectionSplitterOne.className = "dropdown-divider";

    let commentDiv = document.createElement("div");
    commentDiv.className = "commentSection";

    let messageTag = document.createElement("p");
    messageTag.className = "commentText";
    messageTag.textContent = comment.message;
    messageTag.id = comment.id;

    let userNameTag = document.createElement("label");
    userNameTag.className = "commentUserName";
    userNameTag.textContent = "Name: " + comment.userName ;
    userNameTag.htmlFor = comment.id;

    let datetimeTag = document.createElement("label");
    datetimeTag.textContent = "Datum: " + comment.dateTime;
    datetimeTag.htmlFor = comment.id;



    document.getElementById("maintext").appendChild(commentDiv);
    commentDiv.appendChild(userNameTag);
    commentDiv.appendChild(datetimeTag);
    if(getCookie("forename")+" " + getCookie("surname") == comment.userName){
        let deleteBtn = document.createElement("input");
        deleteBtn.className = "delete-btn ";
        deleteBtn.style.display = "block";
        deleteBtn.type = "image";
        deleteBtn.src = "https://intranet-secure.de/TicketCorner/icons/" + "baseline_delete_forever_black_48dp.png";
        deleteBtn.addEventListener("click",function(){deleteComment(comment.id);});

        commentDiv.appendChild(deleteBtn);


    }
    commentDiv.appendChild(sectionSplitterOne);
    commentDiv.appendChild(messageTag);

}

function deleteComment(commentID){
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            initProcess();
            toggleNotification(true, "<b>Kommentar erfolgreich gelöscht.", "information");
        }
    };
    xmlhttp.open("POST", "https://intranet-secure.de/TicketCorner/PHP/deleteComment.php", true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send("postID="+ ID + "&commentID=" + commentID + "&userID=" + getCookie("ID"));
}

//Objekt Comment ist dafür zuständig, die Felder und Attribute eines Kommentarfeldes zu pflegen
function Comment(userName,datetime,message, id){
    this.userName = userName;
    this.dateTime = datetime;
    this.message = message;
    this.id = id;
}
//Funktion zum Fetchen des Ratings, des jeweiligen Events
function getRating(cb) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            ratingJSON = this.responseText;
            if(typeof ratingJSON === 'string'){
                ratingJSON = JSON.parse(ratingJSON);
                cb(ratingJSON);
            }
        }
    };
    xmlhttp.open("POST", "/../TicketCorner/PHP/getRating.php", true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send("postID="+ ID);
}
//Funktion zum Absenden einer vergebenen Bewertung
function sendRatingForm(){
    let form = document.getElementById("ratingForm");
    inputCreate(form, ID, "postID");
    inputCreate(form, getCookie("ID"), "userID");
    form.submit();
}

//Funktion mit der Logik zum Aufspalten des RatingsArray (Hält alle Bewertungen in einer Matrix) und zur Berechnung des Ratings
function updateRating(ratingJSON){
    let ratingcounts = 0;
    if(ratingJSON.length >= 1){
        initRating(ratingJSON);
        let one =0;
        let two =0;
        let three =0;
        let four =0;
        let five =0;

        for(let i=0; i<=ratingJSON.length-1; i++){
            ratingcounts += parseInt(ratingJSON[i].oneStar) *1;
            one += parseInt(ratingJSON[i].oneStar);
            ratingcounts += parseInt(ratingJSON[i].twoStars) *2;
            two += parseInt(ratingJSON[i].twoStars);
            ratingcounts += parseInt(ratingJSON[i].threeStars) *3;
            three += parseInt(ratingJSON[i].threeStars);
            ratingcounts += parseInt(ratingJSON[i].fourStars) *4;
            four += parseInt(ratingJSON[i].fourStars);
            ratingcounts += parseInt(ratingJSON[i].fiveStars) *5;
            five += parseInt(ratingJSON[i].fiveStars);
        }
        ratingcounts = ratingcounts/ratingJSON.length;

        switch (true) {
            case (ratingcounts === 0):
                document.getElementById("rating").textContent = "Noch keine Bewertungen";
                break;
            case (ratingJSON.length===1):
                document.getElementById("rating").textContent ="Es hat eine Person das Event bewertet. Bewertung: " + Math.round(ratingcounts*100)/100 + " Sterne";
                break;
            case (ratingJSON.length>1):
                document.getElementById("rating").textContent ="Es haben " + ratingJSON.length + " Personen das Event bewertet. Bewertung: " + Math.round(ratingcounts*100)/100 + " Sterne";
                break;
        }
        switch(Math.round(ratingcounts)){
            case 1:
                document.getElementById("oneStarOverAll").checked = true;
                break;
            case 2:
                document.getElementById("twoStarsOverAll").checked = true;
                break;
            case 3:
                document.getElementById("threeStarsOverAll").checked = true;
                break;
            case 4:
                document.getElementById("fourStarsOverAll").checked = true;
                break;
            case 5:
                document.getElementById("fiveStarsOverAll").checked = true;
                break;
        }

    } else {
        document.getElementById("rating").textContent = "Noch keine Bewertungen";
        /*if(initPage === 1){
            document.getElementById("threeStars").checked = true;
            initPage++;
        }*/

    }
}
//Funktion zum Lokalisierung eines bestimmten Keys in einem Array, nach seinem Value
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

let eventHolderIndex =  [];
let eventEndorserIndex = [];

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
    xmlhttp.open("GET", "https://intranet-secure.de/TicketCorner/PHP/getEvents.php", true);
    xmlhttp.send();

}
function Event(id, img, name, date, price, description, tickets, maxTickets) {
    this.id = id;
    this.endorsement = (maxTickets - tickets) / maxTickets;
    this.img = img;
    this.name = name;
    this.date = date;
    this.price = price;
    this.description = description;
    this.expired = false;
    this.soldout = false;
    this.currentTickets = parseInt(tickets);
    this.maxTickets = parseInt(maxTickets);
    this.followed = false;

    this.checkIsExpired = function() {
        if(!this.date) {
            return;
        }

        let currentDate = new Date();

        currentDate.setHours(0, 0, 0, 0);


        let eventDate = new Date(dateTransform(this.date));


        if(eventDate < currentDate) {

            this.date = this.date.replace(" (ABGELAUFEN)","");
            this.date += " (ABGELAUFEN)";
            this.expired = true;
        }
        else{
        }
    };
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

        getFollowedEvent(this.id,function(result) {
            //In Callback bei ankommen des Resulatats zuweisen
            self.followed = result;
            if(document.getElementById(id  +  ".FollowBTN") != null && result === true){
                document.getElementById(id +  ".FollowBTN").textContent = "Unfollow";
                document.getElementById(id + ".FollowBTN").setAttribute("onclick", "unFollow(" + id + ")");
            }

        });
    };

    //Aufruf der Prüffunktionen
    this.checkIsExpired();
    this.checkIsSoldOut();

}

function dateTransform(date){
    let preDateTranformed = date.split(",");
    preDateTranformed[0] = preDateTranformed[0].split(".").reverse().join(".");
    let dateTransformed = preDateTranformed.join(" ");
    return preDateTranformed[0];
}

function updateHTML(event){
    if(event.soldout){
        document.getElementById("eventTickets").appendChild(document.createTextNode(" (AUSVERKAUFT)"));
    }
    if(event.expired){
        document.getElementById("eventDate").appendChild(document.createTextNode(" (ABGELAUFEN)"));
    }

}

function initEvents(eventJsonObject){
    for(let i=0; i<=eventJsonObject.length-1; i++){
        let event = new Event(eventJsonObject[i].ID, eventJsonObject[i].imageSrc, eventJsonObject[i].eventName, eventJsonObject[i].eventDate, eventJsonObject[i].eventPrice, eventJsonObject[i].eventDescription , eventJsonObject[i].eventTickets, eventJsonObject[i].maxEventTickets);
        eventHolderIndex.push(event);

    }

    for(let i= 0; i<=eventHolderIndex.length-1; i++){
        if(eventHolderIndex[i].id === getHTMLname()){
            currentEvent = eventHolderIndex[i];
            currentEvent.checkIsFollowed();
        }
        if(!eventHolderIndex[i].expired){
            eventEndorserIndex.push(eventHolderIndex[i]);
        }
    }

    eventEndorserIndex = quickSortEndorsement(eventEndorserIndex, 0, eventEndorserIndex.length-1).reverse();
    if(eventEndorserIndex.length >= 3){
        updateSlideshow(eventEndorserIndex);
    } else if(eventHolderIndex.length >= 3) {
        updateSlideshow(eventHolderIndex);
    }
    updateHTML(currentEvent);
    if(getCookie("email") != null && getCookie("email").includes("hshl.de")) {
        let price = parseInt(currentEvent.price) * 0.85;
        updatePrice(price);
    }
    return eventHolderIndex;
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

function initRating(ratingJSON){
    let userID = getCookie("ID");
    for(let i = 0;i < ratingJSON.length; i++){
        if(ratingJSON[i].userID == userID && initPage === 1){
            let result = getKeyByValue(ratingJSON[i],"1");
            if(result != null){
                document.getElementById(result).checked = true;
            }
            initPage++;
        } else if(i === ratingJSON.length-1 && initPage === 1){
            document.getElementById("threeStars").checked = true;
            initPage++;
        }
    }
}



// Datenbankeinträge für das Folgen von Events schreiben
function followEventHome(eventId) {
    const userId = getCookie("ID");

    if(typeof eventId !== 'string') {
        eventId = eventId.toString();
    }

    if(!userId) {
        return;
    }

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let isFollowed = JSON.parse(this.responseText);

            if(isFollowed.insertId !== 0) {
                currentEvent.isFollowed = true;
                document.getElementById(eventId +  ".FollowBTN").textContent = "Unfollow";
                document.getElementById(eventId + ".FollowBTN").setAttribute("onclick", "unFollow(" + eventId + ")");
                toggleNotification(true, "<b>Du folgst nun dem Event.", "information");
            }
        }
    };

    xmlhttp.open("POST", "https://intranet-secure.de/TicketCorner/PHP/addFollowedEvent.php", true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send("userId="+ userId + "&eventId="+ currentEvent.id);
}

function unFollow(eventid){
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let eventJsonObject = this.responseText;
            if(typeof eventJsonObject === 'string'){
                document.getElementById(eventid +  ".FollowBTN").textContent = "Follow";
                document.getElementById(eventid + ".FollowBTN").setAttribute("onclick", "followEventHome(" + eventid + ")");
                toggleNotification(true, "<b>Du folgst dem Event nun nicht mehr.", "information");
            }
        }
    };
    xmlhttp.open("POST", "https://intranet-secure.de/TicketCorner/PHP/deleteFollowedEvent.php", true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send("userId="+ getCookie("ID")+ "&eventId="+ eventid);

}

// Gibt zurück, ob ein Nutzer einem Event folgt
function getFollowedEvent(id, cb) {
    const userId = getCookie("ID");

    if(typeof id !== 'string') {
        id = id.toString();
    }

    if(!userId) {
        return;
    }


    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let result = JSON.parse(this.responseText);

            const currentFollowedEvent = result[0];

            if(currentFollowedEvent != null && currentFollowedEvent.ID === currentEvent.id) {
                cb(true);
                return;
            }

            cb(false);

        }
    };

    xmlhttp.open("POST", "https://intranet-secure.de/TicketCorner/PHP/getFollowedEvent.php", true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send("eventId="+ parseInt(currentEvent.id) + "&userId="+ userId);
}

getEvents(function (events) {
    initEvents(events);

});
//startet die erste Initialisierung
initProcess();
//startet ein Intervall, welches alle 10 Sekunden die InitProcess() Funktion aufruft
setInterval("initProcess()", 10000);