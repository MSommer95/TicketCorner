let eventArray;

window.getCookie = function(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
};

function getFieldValue(field) {
    return document.getElementById(field).value;
}
function getName(){
    let name = getFieldValue("form_name");
    let preis = getFieldValue("form_price");
    let tickets = getFieldValue("form_tickets");
    let beschreibung = getFieldValue("form_message");
    eventArray = {eventName: name, eventPreis: preis, eventTickets: tickets, eventBeschreibung: beschreibung};
    eventList.push(eventArray);
    console.log(eventArray);
    localStorage.setItem("liste", JSON.stringify(eventList));
}


function previewFile(){
    let preview = document.querySelector('img'); //selects the query named img
    let file    = document.querySelector('input[type=file]').files[0]; //sames as here
    let reader  = new FileReader();

    reader.onloadend = function () {
        preview.src = reader.result;
    }

    if (file) {
        reader.readAsDataURL(file); //reads the data as a URL
    } else {
        preview.src = "";
    }
}

let id = $("<input>")
    .attr("type", "hidden")
    .attr("name", "ID").val(getCookie("ID"));
$('#create-form').append(id);
