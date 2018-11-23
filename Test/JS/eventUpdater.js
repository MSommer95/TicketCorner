let eventJson = null;
let commentsJSON = null;
let ratingJSON = null;
let ratingOwnJSON = null;
let ID = getHTMLname();
let commentHolder = [];

window.getCookie = function(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
};

function getHTMLname(){
    let path = window.location.pathname;
    let page = path.split("/").pop();
    page = page.replace(".html", "");
    return page;
}

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

function updateHTML(ticketUpdate){
    document.getElementById("eventTickets").textContent = "Anzahl der Tickets: " + ticketUpdate[0].eventTickets;
    console.log("UpdateHTMLCall");
}

function initProcess(){
    console.log("setInterval");
    getUpdatedData(function(events){
        updateHTML(events);
    });
    getComments(function (comments) {
       createCommentSection(comments);
    });
    getRating(function (events) {
        updateRating(events);
    });


}
initProcess();
setInterval("initProcess()", 10000);

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

function inputCreate(form, value ,name) {
    let tag = document.createElement("INPUT");
    tag.name = name;
    tag.value = value;
    tag.type = 'hidden';
    form.appendChild(tag);
}

function createCommentSection(commentsJSON) {
    $("div").remove(".commentSection");
    for(i=0;i<=commentsJSON.length-1;i++){
        let comment = new Comment(commentsJSON[i].userName, commentsJSON[i].datetime, commentsJSON[i].message, i);
        commentHolder.push(comment);
        console.log(comment);
    }
}

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

function sendRatingForm(){
    let form = document.getElementById("ratingForm");
    inputCreate(form, ID, "postID");
    inputCreate(form, getCookie("ID"), "userID");
    form.submit();
}

function getOwnRating(cb) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            ratingOwnJSON = this.responseText;
            if(typeof ratingOwnJSON === 'string'){
                ratingOwnJSON = JSON.parse(ratingOwnJSON);
                cb(ratingOwnJSON);
                console.log(ratingOwnJSON);
                console.log("getRatingDataCall");
            }
        }
    };
    xmlhttp.open("POST", "/../TicketCorner/PHP/getOwnRating.php", true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send("postID="+ ID + "&userID=" + getCookie("ID"));
}


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
   }
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function updateOwnRating(ratingOwnJSON){
    if(ratingOwnJSON.length===1){
        console.log(ratingOwnJSON);
        let result = getKeyByValue(ratingOwnJSON[0],"1");
        document.getElementById(result).checked = true;
    } else{
        document.getElementById("fiveStars").checked = true;
    }
}

getOwnRating(function (events) {
    updateOwnRating(events);
});
