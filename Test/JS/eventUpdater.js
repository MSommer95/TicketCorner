let eventJson = null;
let commentsJSON = null;
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


