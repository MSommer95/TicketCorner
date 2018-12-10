
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
//Error Handling
if(window.location.href.includes("?")){
    let error = parseURLParams(window.location.href);

    switch (error.Message[0]) {
        case "UserAlreadyExists":
            alert("User already exists");
            break;
        case "UserDoesntExists":
            alert("User doesnt exist");
            break;
        case "WrongLoginData":
            alert("Wrong Login Data");
            break;
        case "OK":
            alert("Ticket gekauft");
            break;
        case "Changed":
            alert("Bewertung wurde aktualisiert");
            break;
        case "RatingCommitted":
            alert("Bewertung abgegeben");
            break;
        case "SQLError":
            alert("Bei uns ist ein Fehler aufgetreten, bitte versuch es nochmal.");
            break;
        case "pwChanged":
            alert("Passwort erfolgreich geändert");
            break;
        case "NoPwGiven":
            alert("Passwort nicht korrekt eingegeben");
            break;
        case "loggedOut":
            alert("Erfolgreich ausgeloggt");
            break;
    }
}
