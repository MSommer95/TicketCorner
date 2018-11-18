let eventJson = null;
let ID = getHTMLname();

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
}
initProcess();
setInterval("initProcess()", 10000);

function sendCommentForm(){
    let form = document.getElementById("comment-section");
    inputCreate(form, getCookie("ID"), "userID");
    inputCreate(form, ID, "postID");
    inputCreate(form, document.getElementById("comment-section").value, "message");
    form.submit();
}

function inputCreate(form, value ,name) {
    let tag = document.createElement("INPUT");
    tag.name = name;
    tag.value = value;
    tag.type = 'hidden';
    form.appendChild(tag);
}


