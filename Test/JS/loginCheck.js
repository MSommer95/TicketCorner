
computeLogout();
//Funktion um Cookies via Namen abzurufen
window.getCookie = function(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
};

function inputCreate(form, value ,name){
    let tag = document.createElement("INPUT");
    tag.name = name;
    tag.value = value;
    tag.type = 'hidden';
    form.appendChild(tag);
}
//Funktion zum Kontrrollieren des Login Status
function checkForLogin(){
    if (getCookie("email") == null){
        computeLogout();
    }
    else {
        computeLogin();
    }
}
//Funktion zum Ausloggen (Löscht die Cookies, des Users)
function logout(){
    sendLogOut();
    document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "ID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "forename=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "surname=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "creatorStatus=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    checkForLogin();
}
//Blendet Elemente ein, die nur angezeigt werden sollen, wenn der User ausgeloggt ist
function computeLogout(){
    let lout = document.getElementsByClassName(" loggedOutAcc");
    let lin = document.getElementsByClassName(" loggedInAcc");
    for(i=0; i<lout.length;i++){
        lout.item(i).style.display = "block";
    }
    for(i=0; i<lin.length;i++){
        lin.item(i).style.display = "none";
    }
}
//Blendet Elemente ein, die nur angezeigt werden sollen, wenn der User eingeloggt ist
function computeLogin(){
    if(document.getElementById("loggedInAs")!== null){
        document.getElementById("loggedInAs").textContent = getCookie("email");
    }

    let lout = document.getElementsByClassName(" loggedOutAcc");
    let lin = document.getElementsByClassName(" loggedInAcc");
    let lcreator = document.getElementsByClassName(" creator");
    for(i=0; i<lout.length;i++){
        lout.item(i).style.display = "none";
    }
    for(i=0; i<lin.length;i++){
        lin.item(i).style.display = "block";
    }
    if(getCookie("creatorStatus") == 1){
        for(i=0; i<lcreator.length; i++){
            lcreator.item(i).style.display = "block";
        }
    }
    else {
        for(i=0; i<lcreator.length; i++){
            lcreator.item(i).style.display = "none";
        }
    }
}
//Sendet ein Form, um den user auszuloggen
function sendLogOut(){
    let logoutForm = document.createElement("form");
    logoutForm.action = "https://intranet-secure.de/TicketCorner/PHP/logout.php";
    logoutForm.method = "POST";
    inputCreate(logoutForm, getCookie("ID"), "ID");
    inputCreate(logoutForm, getCookie("forename"), "forename");
    inputCreate(logoutForm, getCookie("surname"), "surname");
    inputCreate(logoutForm, getCookie("email"), "email");
    document.body.appendChild(logoutForm);
    logoutForm.submit();
    }

checkForLogin();


function parseURLParams(url) {
    let queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") return;

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}

// Funktion zum Einblenden/Ausblenden von Notifications
function toggleNotification(toggle, text, type) {
    let notificationBar = document.getElementById("notificationBar");

    if(notificationBar && toggle) {
        notificationBar.innerHTML = "";

        const anchor = document.createElement("closeNotification");
        anchor.setAttribute("id", "closeNotification");
        anchor.setAttribute("onclick", "toggleNotification(false)");
        anchor.innerHTML = "x";

        notificationBar.appendChild(anchor);
    }

    if(!notificationBar) {
        notificationBar = createNotification();
    }

    if(notificationBar && type) {
        switch (type) {
            case "warning":
                notificationBar.style.backgroundColor = "#ff8533";
                break;
            case "error":
                notificationBar.style.backgroundColor = "#e65540";
                break;
            case "information":
                notificationBar.style.backgroundColor = "#0099ff";
                break;
            default:
                break;
        }
    }

    if(toggle) {
        notificationBar.innerHTML += text;
        notificationBar.className = "show";
    }
    else if(notificationBar.className.includes("show")) {
        notificationBar.className = "hide";

        setTimeout(() => {
            notificationBar.className = notificationBar.className.replace("hide", "");
            notificationBar.innerHTML = "";
        }, 100);
    }
    else {
        setTimeout(() => {
            if(notificationBar.className.includes("hide"))
                notificationBar.className = notificationBar.className.replace("hide", "");

            notificationBar.innerHTML = "";
        }, 100);
    }
}

// Funktion zum erstellen der Notification HTML
function createNotification() {
    const head = document.head;
    const link = document.createElement("link");

    link.setAttribute("type", "text/css");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", "../../css/notification.css");

    head.appendChild(link);

    const notificationBar = document.createElement("notificationBar");
    notificationBar.setAttribute("id", "notificationBar");

    const anchor = document.createElement("closeNotification");
    anchor.setAttribute("id", "closeNotification");
    anchor.setAttribute("onclick", "toggleNotification(false)");
    anchor.innerHTML = "x";

    notificationBar.appendChild(anchor);

    const body = document.body;

    body.appendChild(notificationBar);

    return document.getElementById("notificationBar");
}




//Error Handling
if(window.location.href.includes("?")){
    let error = parseURLParams(window.location.href);

    switch (error.Message[0]) {
        case "UserAlreadyExists":
            toggleNotification(true, "<b>User already exists!", "error");
            break;
        case "UserDoesntExists":
            toggleNotification(true, "<b>User doesnt exist!", "error");
            break;
        case "WrongLoginData":
            toggleNotification(true, "<b>Wrong Login Data!", "error");
            break;
        case "OK":
            toggleNotification(true, "<b>Ticket gekauft!", "information");
            break;
        case "Changed":
            toggleNotification(true, "<b>Bewertung wurde aktualisiert", "information");
            break;
        case "RatingCommitted":
            toggleNotification(true, "<b>Bewertung abgegeben", "information");
            break;
        case "SQLError":
            toggleNotification(true, "<b>Bei uns ist ein Fehler aufgetreten, bitte versuch es nochmal.", "error");
            break;
        case "pwChanged":
            toggleNotification(true, "<b>Passwort erfolgreich geändert", "warning");
            break;
        case "NoPwGiven":
            toggleNotification(true, "<b>Passwort nicht korrekt eingegeben", "error");
            break;
        case "loggedOut":
            toggleNotification(true, "<b>Erfolgreich ausgeloggt", "information");
            break;
        case "NoComment":
            toggleNotification(true, "<b>Kommentar nicht vorhanden oder keine Befugnis", "error");
            break;
        case "DataChanged":
            toggleNotification(true, "<b>Deine Daten wurden aktualisiert", "information");
            break;
    }
}
