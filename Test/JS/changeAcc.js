window.getCookie = function(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
};

//Default Einstellung: pdata(Persönliche Daten) sichtbar, pwchange (Passwort change) nicht sichtbar
document.getElementById("pdata").style.display = "block";
document.getElementById("pwchange").style.display = "none";
document.getElementById("acc-delete").style.display = "none";
document.getElementById("event-Container").style.display = "none";
//Funktion zum "Aufdecken" des pdata Forms / Verdeckt das pwchange Form
function enablePData(){
    document.getElementById("profil-change-headline").innerText = "Ihr Profil";
    document.getElementById("pwchange").style.display = "none";
    document.getElementById("acc-delete").style.display = "none";
    document.getElementById("event-Container").style.display = "none";
    document.getElementById("pdata").style.display = "block";
    document.getElementById("btn-pwchange").className = document.getElementById("btn-pwchange").className.replace(/ active/g, "");
    document.getElementById("btn-acc-delete").className = document.getElementById("btn-acc-delete").className.replace(/ active/g, "");
    document.getElementById("btn-event-follows").className = document.getElementById("btn-event-follows").className.replace(/ active/g, "");
    document.getElementById("btn-pdata").className += " active";
}
//Funktion zum "Aufdecken" des pwchange Forms / Verdeckt das pdata Form
function enablePW(){
    document.getElementById("profil-change-headline").innerText = "Passwort ändern";
    document.getElementById("pdata").style.display = "none";
    document.getElementById("acc-delete").style.display = "none";
    document.getElementById("pwchange").style.display = "block";
    document.getElementById("event-Container").style.display = "none";
    document.getElementById("btn-pdata").className = document.getElementById("btn-pdata").className.replace(/ active/g, "");
    document.getElementById("btn-acc-delete").className = document.getElementById("btn-pdata").className.replace(/ active/g, "");
    document.getElementById("btn-event-follows").className = document.getElementById("btn-event-follows").className.replace(/ active/g, "");
    document.getElementById("btn-pwchange").className += " active";
}

function enableAccDelete(){
    document.getElementById("profil-change-headline").innerText = "Account löschen";
    document.getElementById("pdata").style.display = "none";
    document.getElementById("acc-delete").style.display = "block";
    document.getElementById("pwchange").style.display = "none";
    document.getElementById("event-Container").style.display = "none";
    document.getElementById("btn-pdata").className = document.getElementById("btn-pdata").className.replace(/ active/g, "");
    document.getElementById("btn-pwchange").className = document.getElementById("btn-pwchange").className.replace(/ active/g, "");
    document.getElementById("btn-event-follows").className = document.getElementById("btn-event-follows").className.replace(/ active/g, "");
    document.getElementById("btn-acc-delete").className += " active";
}

function enableEventFollow(){
    document.getElementById("profil-change-headline").innerText = "Events denen du folgst";
    document.getElementById("pdata").style.display = "none";
    document.getElementById("acc-delete").style.display = "none";
    document.getElementById("pwchange").style.display = "none";
    document.getElementById("event-Container").style.display = "block";
    document.getElementById("btn-pdata").className = document.getElementById("btn-pdata").className.replace(/ active/g, "");
    document.getElementById("btn-pwchange").className = document.getElementById("btn-pwchange").className.replace(/ active/g, "");
    document.getElementById("btn-acc-delete").className = document.getElementById("btn-acc-delete").className.replace(/ active/g, "");
    document.getElementById("btn-event-follows").className += " active";
}

//Funktion zum Kontrollieren, ob eine Änderung bei einem der Werte aufgetreten ist
function checkForChange(){
    let forenameField = document.getElementById("change-forename").value;
    let surnameField = document.getElementById("change-surname").value;
    let emailField = document.getElementById("change-email").value;

    return (forenameField != getCookie("forename")|| surnameField != getCookie("surname") || emailField != getCookie("email" ));

}
//Legt ein User Objekt an, bei dem die Funktion fillFields mitgegeben wird
function User(id,forename, surname, email){
    this.id = id;
    this.forename = forename;
    this.surname = surname;
    this.email = email;
    //Funktion zum Befüllen der Form Felder
    this.fillFields = function(){
        document.getElementById("change-forename").setAttribute("value", this.forename);
        document.getElementById("change-surname").setAttribute("value", this.surname);
        document.getElementById("change-email").setAttribute("value", this.email);
    }
}
//erstellt ein User Objekt und wendet die Funktion fillFields() auf dieses Objekt an
function initUser(){
    let user = new User(getCookie("ID"),getCookie("forename"), getCookie("surname"), getCookie("email"));
    let eventsHolder = [];
    user.fillFields();
    getLoggedIn(function (deviceCount) {
        updateLoggedInCount(deviceCount);
    }, user);

    getFollowEvents(function (event) {

        for(let i=0; i<=event.length-1; i++) {
            let newEvent = new Event(event[i].ID, event[i].imageSrc, event[i].eventName, event[i].eventDate, event[i].eventLocation, event[i].eventTickets, event[i].maxEventTickets);
            eventsHolder.push(newEvent);
        }

        for(let i = 0; i < eventsHolder.length; i++){
            createHTML(eventsHolder[i]);
        }

    }, user);


}
initUser();
window.onbeforeunload = function() {
    if(checkForChange() == true){
        return "Do you really want to leave our brilliant application?";
    }
};

function inputCreate(form, value ,name){
    let tag = document.createElement("INPUT");
    tag.name = name;
    tag.value = value;
    tag.type = 'hidden';
    form.appendChild(tag);
}
//Hängt dem Form wichtige Metadaten an (Forename, Surname, Email und ID
function changeData(formName) {
    let form = document.getElementById(formName);
    let formDataArray = ["forename", "surname", "email", "ID"];
    for (let i = 0; i <= formDataArray.length - 1; i++) {
        inputCreate(form, getCookie(formDataArray[i]), formDataArray[i]);
    }

}

function updateLoggedInCount(deviceCount) {
    document.getElementById("loggedInCount").textContent += deviceCount;
}

function getLoggedIn(cb, user) {
    let deviceCount;
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            deviceCount = this.responseText;
            if(typeof deviceCount === 'string'){
                deviceCount = JSON.parse(deviceCount);
                cb(deviceCount);
                console.log(deviceCount);
            }
        }
    };
    xmlhttp.open("POST", "PHP/getLoggedIn.php", true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send("email="+ user.email);

}

function deleteAcc(cb) {
    let user = new User(getCookie("ID"),getCookie("forename"), getCookie("surname"), getCookie("email"));
    let deleteMessage;
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            deleteMessage = this.responseText;
            if(typeof deleteMessage === 'string'){
                cb(deleteMessage);
                console.log(deleteMessage);
            }
        }
    };
    xmlhttp.open("POST", "PHP/deleteAcc.php", true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send("ID="+ user.id + "&forename=" + user.forename + "&surname=" + user.surname + "&email=" + user.email + "&confirm-delete=" + document.getElementById("confirm-delete").value);

}

function confirmeDeleted(){
    deleteAcc(function (event){
       console.log(event);
       if(event == "accountDeleted"){
           logout();
           alert.log("Account erfolgreich gelöscht. Sie werden nun weitergeleitet!");
           window.location = "https://intranet-secure.de/TicketCorner/index.html";
       }
    });
}

function getFollowEvents(cb, user) {
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
    xmlhttp.open("POST", "PHP/getFollowedEvents.php", true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send("userId="+ user.id);

}

function unFollow(eventid){
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let eventJsonObject = this.responseText;
            if(typeof eventJsonObject === 'string'){
                eventJsonObject = JSON.parse(eventJsonObject);
                document.getElementById(eventid+"Follow").style.display = "none";
            }
        }
    };
    xmlhttp.open("POST", "PHP/deleteFollowedEvent.php", true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send("userId="+ getCookie("ID")+ "&eventId="+ eventid);

}

function Event(id, img, name, date, location, tickets, maxTickets){
    this.id = id;
    this.img = img;
    this.name = name;
    this.date = date;
    this.location = location;
    this.expired = false;
    this.soldout = false;
    this.currentTickets = parseInt(tickets);
    this.maxTickets = parseInt(maxTickets);

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

        getFollowedEvents(this.id, function(result) {
            //In Callback bei ankommen des Resulatats zuweisen
            self.followed = result;
        });
    };

    //Aufruf der Prüffunktionen
    this.checkIsExpired();
    this.checkIsSoldOut();
    //this.checkIsFollowed();
}

function dateTransform(date){
    let preDateTranformed = date.split(",");
    preDateTranformed[0] = preDateTranformed[0].split(".").reverse().join(".");
    let dateTransformed = preDateTranformed.join(" ");
    return preDateTranformed[0];
}

function createHTML(event){

    let img = event.img.replace("../Events/img/","");
    let eventDiv = document.createElement("div");
    let eventImg = document.createElement("div");
    let eventInfo = document.createElement("div");

    let eventName = document.createElement("h4");
    let eventDate = document.createElement("p");
    let eventLocation = document.createElement("p");
    let eventTickets = document.createElement("p");
    let eventFollowBtn = document.createElement("button");

    let btagDate = document.createElement("b");
    let btagLocation = document.createElement("b");
    let btagTickets = document.createElement("b");

    let date = document.createTextNode(event.date);
    let location = document.createTextNode(event.location);
    let tickets = document.createTextNode(event.currentTickets + " von " + event.maxTickets);

    let eventLink = document.createElement("a");
    let imgElement = document.createElement("img");
    let dividerDate = document.createElement("div");
    let dividerTickets = document.createElement("div");
    let dividerLocation = document.createElement("div");
    let dividerEvent = document.createElement("div");

    eventTickets.id = event.id;
    eventInfo.className = "eventInf-Account";
    eventImg.className = "eventImg-Account";
    eventDiv.className = "EventContainer-Account";
    eventName.textContent = event.name;
    btagDate.textContent = "Zeitpunkt: ";
    btagTickets.textContent = "Anzahl der Tickets: ";
    btagLocation.textContent = "Veranstaltungsort: ";
    eventLink.href = "https://intranet-secure.de/TicketCorner/Events/html/" + img.replace(".jpg",".html");
    imgElement.src = "https://intranet-secure.de/TicketCorner/Events/img/"+ img;
    imgElement.height = 128;
    imgElement.width = 128;
    imgElement.id = "eventImg";
    dividerDate.className = "dropdown-divider";
    dividerTickets.className = "dropdown-divider";
    dividerLocation.className = "dropdown-divider";
    dividerEvent.className = "dropdown-divider";
    eventFollowBtn.className = "flex-c-m btn bg1 bo-rad-23 hov1 m-text3 trans-0-4";
    eventFollowBtn.type = "button";
    eventFollowBtn.setAttribute("onclick", "unFollow(" + event.id + ")");
    eventFollowBtn.textContent = "Unfollow";
    eventFollowBtn.id = event.id + "Follow";

    document.getElementById("event-Container").appendChild(eventDiv);
    eventInfo.appendChild(eventName);

    eventInfo.appendChild(eventLocation);
    eventLocation.appendChild(btagLocation);
    eventLocation.appendChild(location);
    eventLocation.appendChild(dividerLocation);

    eventInfo.appendChild(eventDate);
    eventDate.appendChild(btagDate);
    eventDate.appendChild(date);
    eventDate.appendChild(dividerDate);

    eventInfo.appendChild(eventTickets);
    eventTickets.appendChild(btagTickets);
    eventTickets.appendChild(tickets);
    eventTickets.appendChild(dividerTickets);

    eventImg.appendChild(eventLink);
    eventLink.appendChild(imgElement);

    eventInfo.appendChild(eventFollowBtn);

    eventDiv.appendChild(eventImg);
    eventDiv.appendChild(eventInfo);
    document.getElementById("event-Container").appendChild(dividerEvent);
}