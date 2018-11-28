let eventJson = null;
let commentsJSON = null;
let ratingJSON = null;
let ratingOwnJSON = null;
let ID = getHTMLname();
let commentHolder = [];
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
    console.log("getUpdateDataCall");
}
//Updated die Ticket Anazhl in der DOM
function updateHTML(ticketUpdate){
    document.getElementById("eventTickets").textContent = "Anzahl der Tickets: " + ticketUpdate[0].eventTickets;
    console.log("UpdateHTMLCall");
}
//Initialisiert drei Callback Funktionen mit PHP Aufrufen
function initProcess(){
    console.log("setInterval");
    //Ruft CallBackFunktion zur Aktualisierung der Tickets auf
    getUpdatedData(function(events){
        updateHTML(events);
    });
    //Ruft CallBackFunktion zur Aktualisierung der Kommentare auf
    getComments(function (comments) {
       createCommentSection(comments);
    });
    //Ruft CallBackFunktion zur Aktualisierung der Ratings auf
    getRating(function (events) {
        updateRating(events);
    });


}
//startet die erste Initialisierung
initProcess();
//startet ein Intervall, welches alle 10 Sekunden die InitProcess() Funktion aufruft
setInterval("initProcess()", 10000);
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
        let comment = new Comment(commentsJSON[i].userName, commentsJSON[i].datetime, commentsJSON[i].message, i);
        commentHolder.push(comment);
        console.log(comment);
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
                console.log(commentsJSON);
            }
        }
    };
    xmlhttp.open("POST", "https://intranet-secure.de/TicketCorner/PHP/getComments.php", true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send("postID="+ ID);
    console.log("getUpdateDataCall");
}
//Objekt Comment ist dafür zuständig, die Felder und Attribute eines Kommentarfeldes zu pflegen
function Comment(userName,datetime,message, i){

    this.sectionSplitterOne = document.createElement("div");
    this.sectionSplitterOne.className = "dropdown-divider";
    this.commentDiv = document.createElement("div");
    this.commentDiv.className = "commentSection";
    this.messageTag = document.createElement("p");
    this.messageTag.textContent = message;
    this.messageTag.id = i;
    this.userNameTag = document.createElement("label");
    this.userNameTag.textContent = userName;
    this.userNameTag.htmlFor = i;
    this.datetimeTag = document.createElement("label");
    this.datetimeTag.textContent = datetime;
    this.datetimeTag.htmlFor = i;
    this.sectionSplitterTwo = document.createElement("div");
    this.sectionSplitterTwo.className = "dropdown-divider";


    document.getElementById("maintext").appendChild(this.commentDiv);
    this.commentDiv.appendChild(this.sectionSplitterOne);
    this.commentDiv.appendChild(this.userNameTag);
    this.commentDiv.appendChild(this.datetimeTag);
    this.commentDiv.appendChild(this.messageTag);
    this.commentDiv.appendChild(this.sectionSplitterTwo);
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
                console.log(ratingJSON);
                console.log("getRatingDataCall");
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
    console.log(ratingJSON);
   if(ratingJSON.length >= 1){
       let ratingcounts = 0;
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

           if(ratingJSON[i].userID == getCookie("ID")){
               console.log(ratingJSON);
               let result = getKeyByValue(ratingJSON[i],"1");
               document.getElementById(result).checked = true;
           }
       }
       ratingcounts = ratingcounts/ratingJSON.length;
       console.log(ratingcounts);
       console.log("one "+one);
       console.log("two "+one);
       console.log("three "+three);
       console.log("four "+four);
       console.log("five "+five);
       if(ratingJSON>1){
           document.getElementById("rating").textContent ="Es haben " + ratingJSON.length + " Personen das Event bewertet. Bewertung: " + Math.round(ratingcounts*100)/100 + " gute Nudel Sterne";
       }else{
           document.getElementById("rating").textContent ="Es hat eine Person das Event bewertet. Bewertung: " + Math.round(ratingcounts*100)/100 + " gute Nudel Sterne";
       }

   } else {
       document.getElementById("rating").textContent = "Noch keine Bewertungen";
       document.getElementById("threeStars").checked = true;
   }
}
//Funktion zum Lokalisierung eines bestimmten Keys in einem Array, nach seinem Value
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
